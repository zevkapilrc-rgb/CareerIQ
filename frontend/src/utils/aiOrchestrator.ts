// ═══════════════════════════════════════════════════════════════
// Legacy AI Orchestrator Re-export
// Delegates all calls to the unified src/lib/gemini-service/client
// ═══════════════════════════════════════════════════════════════

import { callGemini, GeminiMessage } from "../lib/gemini-service/client";

interface AIMessage {
  role: "user" | "model" | "assistant";
  parts: Array<{
    text?: string;
    inlineData?: {
      data: string;
      mimeType: string;
    };
  }>;
}

interface AIOrchestratorOptions {
  contents: AIMessage[];
  systemPrompt?: string;
  responseJson?: boolean;
  modelName?: string;
}

export async function generateContent({
  contents,
  systemPrompt,
  responseJson = false,
  modelName = "gemini-2.5-flash",
}: AIOrchestratorOptions): Promise<string> {
  // Delegate directly to the new client
  return callGemini({
    contents: contents as GeminiMessage[],
    systemPrompt,
    responseJson,
    modelName,
  });
}
