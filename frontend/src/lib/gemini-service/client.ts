// ═══════════════════════════════════════════════════════════════
// Hirevix Gemini Service — Client
// Unified AI client with structured output, Groq fallback,
// retries, and timeout protection.
// ═══════════════════════════════════════════════════════════════

import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export interface GeminiCallOptions {
  contents: GeminiMessage[];
  systemPrompt?: string;
  responseSchema?: Record<string, unknown>;
  responseJson?: boolean;
  modelName?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface GeminiMessage {
  role: "user" | "model" | "assistant";
  parts: Array<{
    text?: string;
    inlineData?: { data: string; mimeType: string };
  }>;
}

// ── Groq Fallback ───────────────────────────────────────────────

function convertToGroqMessages(contents: GeminiMessage[]): Array<{ role: string; content: string | Array<Record<string, unknown>> }> {
  return contents.map((item) => {
    const role = item.role === "model" || item.role === "assistant" ? "assistant" : "user";
    let textContent = "";
    const images: Array<Record<string, unknown>> = [];

    for (const part of item.parts) {
      if (part.text) textContent += part.text + "\n";
      if (part.inlineData?.mimeType?.startsWith("image/")) {
        images.push({
          type: "image_url",
          image_url: { url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` },
        });
      }
    }

    if (images.length > 0) {
      const contentArray: Array<Record<string, unknown>> = [];
      if (textContent.trim()) contentArray.push({ type: "text", text: textContent.trim() });
      contentArray.push(...images);
      return { role, content: contentArray };
    }
    return { role, content: textContent.trim() || "Empty prompt content" };
  });
}

async function callGroq(
  messages: Array<Record<string, unknown>>,
  systemPrompt?: string,
  responseJson = false
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not configured");

  const groqMessages = [...messages];
  if (systemPrompt) groqMessages.unshift({ role: "system", content: systemPrompt });

  const hasImages = messages.some(
    (msg) => Array.isArray(msg.content) && (msg.content as Array<Record<string, unknown>>).some((c) => c.type === "image_url")
  );
  const model = hasImages
    ? "meta-llama/llama-4-scout-17b-16e-instruct"
    : "llama-3.3-70b-versatile";

  const payload: Record<string, unknown> = {
    model,
    messages: groqMessages,
    temperature: 0.2,
    max_tokens: 4096,
  };
  if (responseJson) payload.response_format = { type: "json_object" };

  console.log(`[gemini-service] Groq fallback: model=${model}, json=${responseJson}`);

  const response = await Promise.race([
    fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("Groq API timed out (45s)")), 45000)
    ),
  ]);

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq HTTP ${response.status}: ${errText}`);
  }

  const result = await response.json();
  const reply = result?.choices?.[0]?.message?.content;
  if (!reply) throw new Error("Groq returned empty completion");
  return reply;
}

// ── Primary Gemini Call ─────────────────────────────────────────

export async function callGemini({
  contents,
  systemPrompt,
  responseSchema,
  responseJson = false,
  modelName = "gemini-2.5-flash",
  temperature = 0.2,
  maxTokens = 8192,
}: GeminiCallOptions): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY;

  // Skip straight to Groq if Gemini key is missing/invalid
  if (!geminiKey || !geminiKey.startsWith("AIza")) {
    console.warn(`[gemini-service] GEMINI_API_KEY invalid, falling back to Groq`);
    const groqMessages = convertToGroqMessages(contents);
    return callGroq(groqMessages as Array<Record<string, unknown>>, systemPrompt, responseJson || !!responseSchema);
  }

  let lastError: Error | null = null;
  let retries = 2;
  let delay = 1000;

  while (retries > 0) {
    try {
      console.log(`[gemini-service] Calling Gemini ${modelName}`);
      const genAI = new GoogleGenerativeAI(geminiKey);

      const generationConfig: Record<string, unknown> = { temperature, maxOutputTokens: maxTokens };

      // Structured output via responseSchema
      if (responseSchema) {
        generationConfig.responseMimeType = "application/json";
        generationConfig.responseSchema = responseSchema;
      } else if (responseJson) {
        generationConfig.responseMimeType = "application/json";
      }

      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt || undefined,
        generationConfig,
      });

      const response = await Promise.race([
        model.generateContent({ contents: contents as any }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Gemini API timed out (45s)")), 45000)
        ),
      ]);

      const text = response.response.text();
      if (text) return text;
      throw new Error("Empty response from Gemini");
    } catch (err: any) {
      lastError = err;
      retries--;
      if (retries > 0) {
        console.warn(`[gemini-service] Gemini failed, retrying in ${delay}ms: ${err.message}`);
        await new Promise((r) => setTimeout(r, delay));
        delay *= 2;
      }
    }
  }

  // Fallback to Groq
  console.error(`[gemini-service] Gemini exhausted retries, falling back to Groq`);
  try {
    const groqMessages = convertToGroqMessages(contents);
    return callGroq(groqMessages as Array<Record<string, unknown>>, systemPrompt, responseJson || !!responseSchema);
  } catch (groqErr: any) {
    throw new Error(
      `AI Pipeline Failed. Gemini: ${lastError?.message}. Groq: ${groqErr.message}`
    );
  }
}
