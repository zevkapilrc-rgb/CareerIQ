"use client";
import { useState, useEffect, useRef } from "react";
import { useAppStore } from "@/src/state/useAppStore";
import { Keyboard, Brain, Bug, Target, Zap, Database, Type, Book, Globe, Gamepad2, Joystick, Trophy, FileText, Mic, Star, Medal, BookOpen } from "lucide-react";

// ──────────────────────────────────────────────────
//  QUIZ DATA (Code Quiz game)
// ──────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
    { q: "What does Big-O O(log n) represent?", options: ["Linear", "Logarithmic", "Quadratic", "Constant"], ans: 1 },
    { q: "Which hook should you use to memoize a value in React?", options: ["useCallback", "useState", "useMemo", "useRef"], ans: 2 },
    { q: "What does 'async/await' do in JavaScript?", options: ["Runs code in parallel", "Blocks the main thread", "Handles async code synchronously", "Creates a new thread"], ans: 2 },
    { q: "What is the purpose of Docker?", options: ["Database management", "Containerization", "Load balancing", "Code compilation"], ans: 1 },
    { q: "Which SQL clause filters rows AFTER grouping?", options: ["WHERE", "HAVING", "GROUP BY", "SELECT"], ans: 1 },
    { q: "In TypeScript, what does 'readonly' do?", options: ["Makes a type optional", "Prevents reassignment", "Creates a union type", "Enables strict mode"], ans: 1 },
    { q: "What is a REST API?", options: ["Real-time Socket Technology", "REpresentational State Transfer", "Recursive Execution Stack Token", "Remote Event Stream Transfer"], ans: 1 },
    { q: "Which sorting algorithm has O(n log n) average complexity?", options: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"], ans: 2 },
    { q: "What does 'npm' stand for?", options: ["Node Package Manager", "New Package Module", "Network Protocol Module", "Node Process Manager"], ans: 0 },
    { q: "Which CSS property creates a flex container?", options: ["grid: flex", "display: flex", "position: flex", "layout: flex"], ans: 1 },
    { q: "What is a closure in JavaScript?", options: ["A function without parameters", "A function with access to its outer scope", "An arrow function", "A constructor function"], ans: 1 },
    { q: "What is the time complexity of binary search?", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], ans: 2 },
    { q: "In Python, what does 'list comprehension' do?", options: ["Sorts a list", "Creates a list concisely", "Filters only numbers", "Reverses a list"], ans: 1 },
    { q: "What is CAP theorem?", options: ["Code Abstraction Protocol", "Consistency, Availability, Partition Tolerance", "Client API Protocol", "Cache Allocation Pattern"], ans: 1 },
    { q: "Which HTTP method is idempotent?", options: ["POST always", "GET", "PATCH", "PUT only"], ans: 1 },
    { q: "What is 'Redux' primarily used for?", options: ["DOM manipulation", "Server routing", "State management", "API calls"], ans: 2 },
    { q: "What does 'SOLID' stand for in OOP?", options: ["5 coding best practices", "Single, Open, Liskov, Interface, Dependency", "Standard Object Linked Interface Design", "Strict Object Layout in Development"], ans: 1 },
    { q: "What is a microservice architecture?", options: ["One large service", "Small independent services", "A frontend pattern", "A database design"], ans: 1 },
    { q: "What is 'debouncing' in JavaScript?", options: ["Removing event listeners", "Delaying function execution", "Compressing images", "Caching API calls"], ans: 1 },
    { q: "Which data structure uses LIFO order?", options: ["Queue", "Stack", "Linked List", "Binary Tree"], ans: 1 },
];

const BUG_QUESTIONS = [
    {
        code: `function sum(arr) {\n  let total = 0;\n  for (let i = 0; i <= arr.length; i++) {\n    total += arr[i];\n  }\n  return total;\n}`,
        bug: "Loop condition should be `i < arr.length` not `i <= arr.length` (off-by-one error causes undefined access)",
        hint: "Check the loop boundary condition",
    },
    {
        code: `async function fetchData(url) {\n  const res = fetch(url);\n  const data = await res.json();\n  return data;\n}`,
        bug: "Missing `await` before `fetch(url)`. `res` is a Promise, not a Response, so `.json()` will fail.",
        hint: "Are you awaiting all async operations?",
    },
    {
        code: `const memoize = (fn) => {\n  const cache = {};\n  return (n) => {\n    if (cache[n]) return cache[n];\n    return cache[n] = fn(n);\n  };\n};`,
        bug: "`if (cache[n])` fails when fn(n) returns 0 or falsy values. Should be `if (n in cache)` or `cache[n] !== undefined`",
        hint: "Consider falsy return values",
    },
    {
        code: `function deepCopy(obj) {\n  return Object.assign({}, obj);\n}`,
        bug: "Object.assign creates a SHALLOW copy. Nested objects are still referenced. Use JSON.parse(JSON.stringify(obj)) or structuredClone(obj) for deep copy.",
        hint: "Does this copy work for nested objects?",
    },
    {
        code: `useEffect(() => {\n  const interval = setInterval(() => {\n    setCount(count + 1);\n  }, 1000);\n}, []);`,
        bug: "Missing cleanup return and stale closure on `count`. Should be: `setCount(c => c + 1)` and `return () => clearInterval(interval)`",
        hint: "Check cleanup logic and dependency array",
    },
];

const FLASHCARDS = [
    { front: "What is O(1)?", back: "Constant time complexity — execution time doesn't grow with input size. Example: array access by index." },
    { front: "What is Memoization?", back: "Caching expensive function results to avoid recomputation. Key technique in Dynamic Programming." },
    { front: "What is a Promise?", back: "An object representing eventually completed or failed async operation. Has .then(), .catch(), .finally() methods." },
    { front: "What is SQL INNER JOIN?", back: "Returns rows where there's a match in BOTH tables. Most common join type." },
    { front: "What is REST?", back: "REpresentational State Transfer — architectural style using HTTP methods GET/POST/PUT/DELETE for stateless APIs." },
    { front: "Explain useCallback", back: "React hook that memoizes a function reference, preventing unnecessary re-renders when passed as props." },
    { front: "What is a Hash Table?", back: "Data structure with O(1) avg lookup/insert using a hash function to map keys to array indices." },
    { front: "What is TCP vs UDP?", back: "TCP: reliable, ordered, slow. UDP: fast, no guarantee. Use TCP for APIs, UDP for video/gaming." },
    { front: "What is CSRF?", back: "Cross-Site Request Forgery: attack making users unwittingly send requests. Prevented by CSRF tokens." },
    { front: "Explain CAP theorem", back: "Any distributed system can only guarantee 2 of 3: Consistency, Availability, Partition Tolerance." },
    { front: "What is a Closure?", back: "A function that retains access to its outer scope's variables even after the outer function returns." },
    { front: "What is SSR?", back: "Server-Side Rendering: HTML generated on server per request. Better SEO and initial load vs CSR." },
    { front: "What is Debouncing?", back: "Delays executing a function until N ms have passed since last call. Reduces API calls on user input." },
    { front: "Explain Git rebase vs merge", back: "Merge: creates a merge commit, preserves history. Rebase: replays commits linearly, cleaner history." },
    { front: "What is a Deadlock?", back: "Two processes each waiting for resources the other holds. Prevented by ordering resources or using timeouts." },
];

const TYPING_SENTENCES = [
    "Merge sort has O(n log n) time complexity in all cases.",
    "React re-renders when state or props change.",
    "SQL joins combine rows from multiple tables based on conditions.",
    "REST APIs use HTTP verbs like GET POST PUT and DELETE.",
    "Docker containers share the OS kernel for lightweight isolation.",
    "TypeScript adds static type checking to JavaScript at compile time.",
    "Binary search requires a sorted array and runs in O(log n).",
    "AWS Lambda runs code without provisioning servers.",
    "Kubernetes orchestrates containerized applications at scale.",
    "GraphQL lets clients request exactly the data they need.",
    "A closure is a function that remembers its outer scope variables.",
    "Debouncing delays a function call until the user stops typing.",
    "The virtual DOM diffing algorithm makes React updates efficient.",
    "Git rebase replays commits on top of another branch cleanly.",
    "A deadlock occurs when two processes wait on each other forever.",
    "Microservices split an application into small independent services.",
    "JWT tokens encode claims and are signed for verification.",
    "Redis is an in-memory key-value store used for caching.",
    "SQL indexes speed up queries by avoiding full table scans.",
    "Event-driven architecture decouples producers from consumers.",
];

// ──────────────────────────────────────────────────
//  TYPING SPEED GAME
// ──────────────────────────────────────────────────
function TypingGame({ onExit, onXP }: { onExit: () => void; onXP: (xp: number, r: string) => void }) {
    const [sentenceList] = useState(() => [...TYPING_SENTENCES].sort(() => Math.random() - 0.5));
    const [sentenceIdx, setSentenceIdx] = useState(0);
    const sentence = sentenceList[sentenceIdx];
    const [input, setInput] = useState("");
    const [start, setStart] = useState<number | null>(null);
    const [done, setDone] = useState(false);
    const [wpm, setWpm] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleType = (val: string) => {
        if (!start) setStart(Date.now());
        setInput(val);
        if (val === sentence) {
            const elapsed = (Date.now() - (start || Date.now())) / 1000 / 60;
            const wordCount = sentence.split(" ").length;
            const w = Math.round(wordCount / elapsed);
            setWpm(w);
            setDone(true);
            const xp = w >= 60 ? 80 : w >= 40 ? 50 : 30;
            onXP(xp, `Typing Speed: ${w} WPM`);
        }
    };

    const chars = sentence.split("").map((c, i) => {
        const typed = input[i];
        const style: React.CSSProperties = typed === undefined ? { color: "var(--text-muted)" } : typed === c ? { color: "var(--green)" } : { color: "var(--red)", textDecoration: "underline" };
        return <span key={i} style={style}>{c}</span>;
    });

    const accuracy = input.length > 0 ? Math.round((input.split("").filter((c, i) => c === sentence[i]).length / input.length) * 100) : 100;

    return (
        <div className="card" style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <h2 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}><Keyboard size={24} /> Typing Speed Race</h2>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Sentence {sentenceIdx + 1}/{sentenceList.length}</span>
                    <button className="btn-ghost" onClick={onExit} style={{ fontSize: "0.8rem" }}>← Exit</button>
                </div>
            </div>
            {!done ? (
                <>
                    <div style={{ fontFamily: "monospace", fontSize: "1.05rem", lineHeight: 1.9, background: "rgba(102,51,153,0.08)", borderRadius: 12, padding: "16px 20px", marginBottom: 18, letterSpacing: "0.03em" }}>{chars}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: 10 }}>Accuracy: <strong style={{ color: accuracy >= 95 ? "var(--green)" : accuracy >= 80 ? "var(--yellow)" : "var(--red)" }}>{accuracy}%</strong></div>
                    <input ref={inputRef} autoFocus value={input} onChange={e => handleType(e.target.value)} placeholder="Start typing..." className="input-field" style={{ fontFamily: "monospace" }} />
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 8 }}>{input.length}/{sentence.length} chars · {start ? `${Math.round((Date.now() - start) / 1000)}s` : "Start typing to begin timer"}</div>
                </>
            ) : (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                    <div style={{ marginBottom: 12, display: "flex", justifyContent: "center", color: wpm >= 60 ? "var(--green)" : wpm >= 40 ? "var(--yellow)" : "var(--red)" }}><Target size={48} /></div>
                    <div style={{ fontSize: "2.5rem", fontWeight: 800, color: wpm >= 60 ? "var(--green)" : wpm >= 40 ? "var(--yellow)" : "var(--red)" }}>{wpm} WPM</div>
                    <div style={{ color: "var(--text-muted)", marginBottom: 20, fontSize: "0.85rem" }}>{wpm >= 60 ? "Excellent!" : wpm >= 40 ? "Good!" : "Keep practicing!"} · {accuracy}% accuracy</div>
                    <button className="btn-primary" onClick={() => { setInput(""); setStart(null); setDone(false); setSentenceIdx(i => (i + 1) % sentenceList.length); }}>Next Sentence →</button>
                    <button className="btn-ghost" onClick={onExit} style={{ marginLeft: 10 }}>Back</button>
                </div>
            )}
        </div>
    );
}

// ──────────────────────────────────────────────────
//  CODE QUIZ GAME
// ──────────────────────────────────────────────────
function QuizGame({ onExit, onXP }: { onExit: () => void; onXP: (xp: number, r: string) => void }) {
    const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10);
    const [idx, setIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [done, setDone] = useState(false);

    const q = shuffled[idx];

    const pick = (i: number) => {
        if (selected !== null) return;
        setSelected(i);
        if (i === q.ans) setScore(s => s + 1);
        setTimeout(() => {
            if (idx + 1 < shuffled.length) { setIdx(i2 => i2 + 1); setSelected(null); }
            else { setDone(true); onXP(Math.round((score + (i === q.ans ? 1 : 0)) * 15), `Code Quiz: ${score + (i === q.ans ? 1 : 0)}/10`); }
        }, 900);
    };

    const pct = Math.round((score / shuffled.length) * 100);

    if (done) return (
        <div className="card" style={{ maxWidth: 580, margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12, color: "var(--accent)" }}><Brain size={48} /></div>
            <h2>Quiz Complete!</h2>
            <div style={{ fontSize: "3rem", fontWeight: 800, color: pct >= 80 ? "var(--green)" : pct >= 60 ? "var(--yellow)" : "var(--red)", margin: "12px 0" }}>{score}/10</div>
            <div style={{ color: "var(--text-muted)", marginBottom: 24 }}>{pct >= 80 ? "Excellent knowledge!" : pct >= 60 ? "Good, keep learning!" : "Review the concepts and try again"}</div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button className="btn-primary" onClick={() => { setIdx(0); setScore(0); setSelected(null); setDone(false); }}>Play Again</button>
                <button className="btn-ghost" onClick={onExit}>Back</button>
            </div>
        </div>
    );

    return (
        <div className="card" style={{ maxWidth: 640, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                <h2 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}><Brain size={24} /> Code Quiz</h2>
                <button className="btn-ghost" onClick={onExit} style={{ fontSize: "0.8rem" }}>← Exit</button>
            </div>
            <div style={{ display: "flex", gap: 4, marginBottom: 22 }}>
                {shuffled.map((_, i) => <div key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: i < idx ? "var(--green)" : i === idx ? "var(--accent)" : "rgba(163,119,157,0.15)" }} />)}
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginBottom: 12 }}>Question {idx + 1} of {shuffled.length} · Score: {score}</div>
            <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text)", marginBottom: 22, lineHeight: 1.6 }}>{q.q}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {q.options.map((o, i) => {
                    const isCorrect = selected !== null && i === q.ans;
                    const isWrong = selected === i && i !== q.ans;
                    return (
                        <button key={i} onClick={() => pick(i)} style={{ textAlign: "left", padding: "12px 18px", borderRadius: 12, border: `2px solid ${isCorrect ? "var(--green)" : isWrong ? "var(--red)" : selected === i ? "var(--accent)" : "rgba(163,119,157,0.18)"}`, background: isCorrect ? "rgba(86,227,160,0.1)" : isWrong ? "rgba(248,113,113,0.1)" : selected === i ? "rgba(102,51,153,0.15)" : "var(--surface)", color: "var(--text)", cursor: selected !== null ? "default" : "pointer", fontSize: "0.88rem", transition: "all 0.15s", fontWeight: selected === i ? 600 : 400 }}>
                            {String.fromCharCode(65 + i)}. {o} {isCorrect && "✓"} {isWrong && "✗"}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ──────────────────────────────────────────────────
//  BUG HUNT GAME
// ──────────────────────────────────────────────────
function BugHuntGame({ onExit, onXP }: { onExit: () => void; onXP: (xp: number, r: string) => void }) {
    const [shuffled] = useState(() => [...BUG_QUESTIONS].sort(() => Math.random() - 0.5));
    const [idx, setIdx] = useState(0);
    const [showBug, setShowBug] = useState(false);
    const [answer, setAnswer] = useState("");
    const [revealed, setRevealed] = useState(false);
    const [score, setScore] = useState(0);
    const q = shuffled[idx];

    const submit = () => {
        if (answer.length < 10) return;
        setRevealed(true);
        const hasKeyword = q.bug.toLowerCase().split(" ").filter(w => w.length > 4).some(w => answer.toLowerCase().includes(w));
        if (hasKeyword) { setScore(s => s + 1); onXP(35, "Bug found!"); }
    };

    const next = () => {
        if (idx + 1 < shuffled.length) { setIdx(idx + 1); setRevealed(false); setAnswer(""); setShowBug(false); }
        else onExit();
    };

    return (
        <div className="card" style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                <h2 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}><Bug size={24} /> Bug Hunt</h2>
                <div style={{ display: "flex", gap: 8 }}>
                    <span style={{ color: "var(--green)", fontWeight: 700 }}>Score: {score}/{shuffled.length}</span>
                    <button className="btn-ghost" onClick={onExit} style={{ fontSize: "0.8rem" }}>← Exit</button>
                </div>
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 10 }}>Bug {idx + 1} of {shuffled.length} · Hint: {q.hint}</div>
            <div style={{ background: "#120a22", borderRadius: 12, padding: "16px 20px", fontFamily: "monospace", fontSize: "0.85rem", color: "#E6C7E6", whiteSpace: "pre-wrap", marginBottom: 16, border: "1px solid rgba(163,119,157,0.15)", overflowX: "auto" }}>{q.code}</div>
            {!revealed ? (
                <>
                    <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Describe the bug you found..." className="input-field" rows={3} style={{ marginBottom: 12 }} />
                    <div style={{ display: "flex", gap: 10 }}>
                        <button className="btn-primary" onClick={submit}>Submit Answer →</button>
                        <button className="btn-ghost" onClick={() => setShowBug(!showBug)}>Hint {showBug ? "×" : "→"}</button>
                    </div>
                    {showBug && <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 10, fontSize: "0.8rem", color: "var(--yellow)" }}>Hint: {q.hint}</div>}
                </>
            ) : (
                <div>
                    <div style={{ padding: "14px 18px", background: "rgba(86,227,160,0.06)", border: "1px solid rgba(86,227,160,0.2)", borderRadius: 10, marginBottom: 14 }}>
                        <div style={{ fontWeight: 700, color: "var(--green)", marginBottom: 6 }}>✓ The Bug Was:</div>
                        <div style={{ fontSize: "0.83rem", color: "var(--text-sub)", lineHeight: 1.7 }}>{q.bug}</div>
                    </div>
                    <button className="btn-primary" onClick={next}>{idx + 1 < shuffled.length ? "Next Bug →" : "Finish"}</button>
                </div>
            )}
        </div>
    );
}

// ──────────────────────────────────────────────────
//  FLASHCARD MEMORY GAME
// ──────────────────────────────────────────────────
function FlashcardGame({ onExit, onXP }: { onExit: () => void; onXP: (xp: number, r: string) => void }) {
    const deck = [...FLASHCARDS].sort(() => Math.random() - 0.5);
    const [idx, setIdx] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [known, setKnown] = useState(0);
    const [reviewing, setReviewing] = useState(false);

    const mark = (knew: boolean) => {
        if (knew) { setKnown(k => k + 1); onXP(10, "Flashcard studied!"); }
        if (idx + 1 < deck.length) { setIdx(idx + 1); setFlipped(false); }
        else setReviewing(true);
    };

    if (reviewing) return (
        <div className="card" style={{ maxWidth: 540, margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12, color: "var(--accent)" }}><BookOpen size={48} /></div>
            <h2>Deck Complete!</h2>
            <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--green)", margin: "12px 0" }}>{known}/{deck.length}</div>
            <div style={{ color: "var(--text-muted)", marginBottom: 24 }}>cards you knew</div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button className="btn-primary" onClick={() => { setIdx(0); setFlipped(false); setKnown(0); setReviewing(false); }}>Restart</button>
                <button className="btn-ghost" onClick={onExit}>Back</button>
            </div>
        </div>
    );

    const card = deck[idx];
    return (
        <div style={{ maxWidth: 540, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18, alignItems: "center" }}>
                <h2 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}><BookOpen size={24} /> Flashcards</h2>
                <button className="btn-ghost" onClick={onExit} style={{ fontSize: "0.8rem" }}>← Exit</button>
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: 16 }}>{idx + 1}/{deck.length} · {known} known</div>
            <div style={{ perspective: 1000 }} onClick={() => setFlipped(!flipped)}>
                <div style={{ width: "100%", height: 220, cursor: "pointer", position: "relative", transformStyle: "preserve-3d", transition: "transform 0.5s", transform: flipped ? "rotateY(180deg)" : "rotateY(0)" }}>
                    {/* Front */}
                    <div className="liquid-glass" style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 28, background: "rgba(46,26,71,0.5)", textAlign: "center" }}>
                        <div style={{ fontSize: "0.65rem", color: "var(--accent)", fontWeight: 700, marginBottom: 12, letterSpacing: "0.1em" }}>QUESTION — TAP TO REVEAL</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text)", lineHeight: 1.5 }}>{card.front}</div>
                    </div>
                    {/* Back */}
                    <div className="liquid-glass" style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 28, background: "rgba(102,51,153,0.2)", textAlign: "center", transform: "rotateY(180deg)" }}>
                        <div style={{ fontSize: "0.65rem", color: "var(--green)", fontWeight: 700, marginBottom: 12, letterSpacing: "0.1em" }}>ANSWER</div>
                        <div style={{ fontSize: "0.9rem", color: "var(--text)", lineHeight: 1.7 }}>{card.back}</div>
                    </div>
                </div>
            </div>
            {flipped && (
                <div style={{ display: "flex", gap: 12, marginTop: 18, justifyContent: "center" }}>
                    <button onClick={() => mark(false)} style={{ flex: 1, padding: "11px 0", borderRadius: 11, border: "2px solid rgba(248,113,113,0.3)", background: "rgba(248,113,113,0.08)", color: "var(--red)", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}>Needs Review</button>
                    <button onClick={() => mark(true)} style={{ flex: 1, padding: "11px 0", borderRadius: 11, border: "2px solid rgba(86,227,160,0.3)", background: "rgba(86,227,160,0.08)", color: "var(--green)", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}>✓ Mastered</button>
                </div>
            )}
        </div>
    );
}

// ──────────────────────────────────────────────────
//  PATTERN MATCH GAME
// ──────────────────────────────────────────────────
const PATTERNS = [
    { code: "arr.map(x => x * 2)", pattern: "Map", options: ["Filter", "Map", "Reduce", "ForEach"] },
    { code: "arr.filter(x => x > 5)", pattern: "Filter", options: ["Map", "Reduce", "Filter", "Find"] },
    { code: "arr.reduce((a,b) => a+b, 0)", pattern: "Reduce", options: ["Map", "Filter", "Reduce", "Some"] },
    { code: "Promise.all([p1, p2])", pattern: "Promise.all", options: ["Promise.race", "Promise.all", "Promise.any", "async/await"] },
    { code: "const [a, ...rest] = arr;", pattern: "Destructuring + Spread", options: ["Spread Only", "Rest Only", "Destructuring + Spread", "Assignment"] },
    { code: "obj?.prop?.val", pattern: "Optional Chaining", options: ["Nullish Coalescing", "Optional Chaining", "Ternary", "Short-circuit"] },
    { code: "x ?? 'default'", pattern: "Nullish Coalescing", options: ["OR operator", "Nullish Coalescing", "Ternary", "Default param"] },
    { code: "yield* iterator", pattern: "Generator Delegation", options: ["Async/Await", "Iterator Protocol", "Generator Delegation", "Symbol"] },
];
function PatternMatchGame({ onExit, onXP }: { onExit: () => void; onXP: (xp: number, r: string) => void }) {
    const [shuffled] = useState(() => [...PATTERNS].sort(() => Math.random() - 0.5));
    const [idx, setIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [picked, setPicked] = useState<number | null>(null);
    const [done, setDone] = useState(false);
    const p = shuffled[idx];
    const pick = (i: number) => {
        if (picked !== null) return;
        setPicked(i);
        if (p.options[i] === p.pattern) setScore(s => s + 1);
        setTimeout(() => { setPicked(null); if (idx + 1 >= shuffled.length) { setDone(true); onXP(score * 20, `Pattern Match: ${score}/${shuffled.length}`); } else setIdx(idx + 1); }, 1200);
    };
    if (done) return (<div className="page-enter" style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}><h2 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><Target size={24} /> Pattern Match Complete!</h2><div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--accent)", margin: "20px 0" }}>{score}/{shuffled.length}</div><button className="btn-primary" onClick={onExit}>Back to Games</button></div>);
    return (<div className="page-enter" style={{ maxWidth: 600, margin: "0 auto" }}><button className="btn-ghost" onClick={onExit}>← Back</button><h2 style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}><Target size={24} /> Pattern Match · {idx + 1}/{shuffled.length}</h2><div className="card" style={{ fontFamily: "monospace", padding: 20, fontSize: "1.1rem", marginBottom: 16, background: "rgba(102,51,153,0.08)" }}>{p.code}</div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>{p.options.map((o, i) => (<button key={i} onClick={() => pick(i)} disabled={picked !== null} style={{ padding: 14, borderRadius: 10, border: `2px solid ${picked === i ? (o === p.pattern ? "var(--green)" : "#f87171") : "rgba(163,119,157,0.2)"}`, background: picked === i ? (o === p.pattern ? "rgba(86,227,160,0.12)" : "rgba(248,113,113,0.12)") : "transparent", color: "var(--text)", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}>{o}</button>))}</div></div>);
}

// ──────────────────────────────────────────────────
//  ALGORITHM RACE GAME
// ──────────────────────────────────────────────────
const ALGO_QS = [
    { algo: "Binary Search", answer: "O(log n)", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"] },
    { algo: "Bubble Sort", answer: "O(n²)", options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"] },
    { algo: "Hash Table Lookup", answer: "O(1)", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"] },
    { algo: "Merge Sort", answer: "O(n log n)", options: ["O(n²)", "O(n)", "O(n log n)", "O(2^n)"] },
    { algo: "Linear Search", answer: "O(n)", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"] },
    { algo: "Quick Sort (avg)", answer: "O(n log n)", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"] },
    { algo: "BFS/DFS on Graph", answer: "O(V+E)", options: ["O(V)", "O(E)", "O(V+E)", "O(V²)"] },
    { algo: "Fibonacci (naive)", answer: "O(2^n)", options: ["O(n)", "O(n²)", "O(2^n)", "O(n log n)"] },
];
function AlgoRaceGame({ onExit, onXP }: { onExit: () => void; onXP: (xp: number, r: string) => void }) {
    const [shuffled] = useState(() => [...ALGO_QS].sort(() => Math.random() - 0.5));
    const [idx, setIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [picked, setPicked] = useState<number | null>(null);
    const [done, setDone] = useState(false);
    const q = shuffled[idx];
    const pick = (i: number) => {
        if (picked !== null) return; setPicked(i);
        if (q.options[i] === q.answer) setScore(s => s + 1);
        setTimeout(() => { setPicked(null); if (idx + 1 >= shuffled.length) { setDone(true); onXP(score * 20, `Algo Race: ${score}/${shuffled.length}`); } else setIdx(idx + 1); }, 1000);
    };
    if (done) return (<div className="page-enter" style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}><h2 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><Zap size={24} /> Algorithm Race Complete!</h2><div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--accent)", margin: "20px 0" }}>{score}/{shuffled.length}</div><button className="btn-primary" onClick={onExit}>Back to Games</button></div>);
    return (<div className="page-enter" style={{ maxWidth: 600, margin: "0 auto" }}><button className="btn-ghost" onClick={onExit}>← Back</button><h2 style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}><Zap size={24} /> Algorithm Race · {idx + 1}/{shuffled.length}</h2><div className="card" style={{ textAlign: "center", padding: 24, marginBottom: 16 }}><div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 8 }}>What is the time complexity of:</div><div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--accent)" }}>{q.algo}</div></div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>{q.options.map((o, i) => (<button key={i} onClick={() => pick(i)} disabled={picked !== null} style={{ padding: 14, borderRadius: 10, border: `2px solid ${picked === i ? (o === q.answer ? "var(--green)" : "#f87171") : "rgba(163,119,157,0.2)"}`, background: picked === i ? (o === q.answer ? "rgba(86,227,160,0.12)" : "rgba(248,113,113,0.12)") : "transparent", color: "var(--text)", cursor: "pointer", fontWeight: 700, fontSize: "0.95rem", fontFamily: "monospace" }}>{o}</button>))}</div></div>);
}

// ──────────────────────────────────────────────────
//  SQL CHALLENGE GAME
// ──────────────────────────────────────────────────
const SQL_QS = [
    { q: "Select all columns from 'users' table", ans: "SELECT * FROM users", options: ["SELECT * FROM users", "GET ALL FROM users", "FETCH users", "READ * users"] },
    { q: "Count distinct cities from 'orders'", ans: "SELECT COUNT(DISTINCT city) FROM orders", options: ["SELECT COUNT(city) FROM orders", "SELECT COUNT(DISTINCT city) FROM orders", "COUNT DISTINCT city IN orders", "SELECT UNIQUE(city) FROM orders"] },
    { q: "Get users older than 25, sorted by name", ans: "SELECT * FROM users WHERE age > 25 ORDER BY name", options: ["SELECT * FROM users WHERE age > 25 ORDER BY name", "GET users age>25 SORT name", "SELECT FROM users age>25", "FIND users WHERE age>25"] },
    { q: "Join 'orders' with 'products' on product_id", ans: "SELECT * FROM orders JOIN products ON orders.product_id = products.id", options: ["SELECT * FROM orders, products", "MERGE orders products", "SELECT * FROM orders JOIN products ON orders.product_id = products.id", "LINK orders TO products"] },
    { q: "Insert a new user 'Alice', age 30", ans: "INSERT INTO users (name, age) VALUES ('Alice', 30)", options: ["ADD user Alice 30", "INSERT INTO users (name, age) VALUES ('Alice', 30)", "CREATE user Alice age=30", "PUT users Alice 30"] },
    { q: "Delete users with no email", ans: "DELETE FROM users WHERE email IS NULL", options: ["REMOVE users no email", "DELETE FROM users WHERE email IS NULL", "DROP users WHERE email = ''", "DELETE users email=null"] },
];
function SQLChallengeGame({ onExit, onXP }: { onExit: () => void; onXP: (xp: number, r: string) => void }) {
    const [shuffled] = useState(() => [...SQL_QS].sort(() => Math.random() - 0.5));
    const [idx, setIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [picked, setPicked] = useState<number | null>(null);
    const [done, setDone] = useState(false);
    const q = shuffled[idx];
    const pick = (i: number) => {
        if (picked !== null) return; setPicked(i);
        if (q.options[i] === q.ans) setScore(s => s + 1);
        setTimeout(() => { setPicked(null); if (idx + 1 >= shuffled.length) { setDone(true); onXP(score * 25, `SQL Challenge: ${score}/${shuffled.length}`); } else setIdx(idx + 1); }, 1200);
    };
    if (done) return (<div className="page-enter" style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}><h2 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><Database size={24} /> SQL Challenge Complete!</h2><div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--accent)", margin: "20px 0" }}>{score}/{shuffled.length}</div><button className="btn-primary" onClick={onExit}>Back to Games</button></div>);
    return (<div className="page-enter" style={{ maxWidth: 600, margin: "0 auto" }}><button className="btn-ghost" onClick={onExit}>← Back</button><h2 style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}><Database size={24} /> SQL Challenge · {idx + 1}/{shuffled.length}</h2><div className="card" style={{ textAlign: "center", padding: 20, marginBottom: 16 }}><div style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text)" }}>{q.q}</div></div><div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{q.options.map((o, i) => (<button key={i} onClick={() => pick(i)} disabled={picked !== null} style={{ padding: 12, borderRadius: 10, border: `2px solid ${picked === i ? (o === q.ans ? "var(--green)" : "#f87171") : "rgba(163,119,157,0.2)"}`, background: picked === i ? (o === q.ans ? "rgba(86,227,160,0.12)" : "rgba(248,113,113,0.12)") : "transparent", color: "var(--text)", cursor: "pointer", fontWeight: 600, fontSize: "0.78rem", fontFamily: "monospace", textAlign: "left" }}>{o}</button>))}</div></div>);
}

// ──────────────────────────────────────────────────
//  REGEX MASTER GAME
// ──────────────────────────────────────────────────
const REGEX_QS = [
    { q: "Match any email address", ans: "/\\S+@\\S+\\.\\S+/", options: ["/\\S+@\\S+\\.\\S+/", "/@.*/", "/email/", "/\\w+@/"] },
    { q: "Match a 10-digit phone number", ans: "/^\\d{10}$/", options: ["/\\d+/", "/^\\d{10}$/", "/phone/", "/[0-9]*/"] },
    { q: "Match any URL starting with https", ans: "/^https:\\/\\/.+/", options: ["/http/", "/^https:\\/\\/.+/", "/url/", "/www\\..*/"] },
    { q: "Match words starting with capital letter", ans: "/\\b[A-Z]\\w*/g", options: ["/[a-z]+/", "/^[A-Z]/", "/\\b[A-Z]\\w*/g", "/Capital/"] },
    { q: "Match HEX color code (#RRGGBB)", ans: "/^#[0-9A-Fa-f]{6}$/", options: ["/^#\\w{6}$/", "/^#[0-9A-Fa-f]{6}$/", "/#color/", "/^#\\d{6}$/"] },
    { q: "Remove all whitespace", ans: "/\\s/g", options: ["/\\w/g", "/\\s/g", "/ /", "/space/g"] },
];
function RegexMasterGame({ onExit, onXP }: { onExit: () => void; onXP: (xp: number, r: string) => void }) {
    const [shuffled] = useState(() => [...REGEX_QS].sort(() => Math.random() - 0.5));
    const [idx, setIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [picked, setPicked] = useState<number | null>(null);
    const [done, setDone] = useState(false);
    const q = shuffled[idx];
    const pick = (i: number) => {
        if (picked !== null) return; setPicked(i);
        if (q.options[i] === q.ans) setScore(s => s + 1);
        setTimeout(() => { setPicked(null); if (idx + 1 >= shuffled.length) { setDone(true); onXP(score * 20, `Regex Master: ${score}/${shuffled.length}`); } else setIdx(idx + 1); }, 1000);
    };
    if (done) return (<div className="page-enter" style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}><h2 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><Type size={24} /> Regex Master Complete!</h2><div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--accent)", margin: "20px 0" }}>{score}/{shuffled.length}</div><button className="btn-primary" onClick={onExit}>Back to Games</button></div>);
    return (<div className="page-enter" style={{ maxWidth: 600, margin: "0 auto" }}><button className="btn-ghost" onClick={onExit}>← Back</button><h2 style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}><Type size={24} /> Regex Master · {idx + 1}/{shuffled.length}</h2><div className="card" style={{ textAlign: "center", padding: 20, marginBottom: 16 }}><div style={{ fontSize: "0.88rem", fontWeight: 600 }}>{q.q}</div></div><div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{q.options.map((o, i) => (<button key={i} onClick={() => pick(i)} disabled={picked !== null} style={{ padding: 12, borderRadius: 10, border: `2px solid ${picked === i ? (o === q.ans ? "var(--green)" : "#f87171") : "rgba(163,119,157,0.2)"}`, background: picked === i ? (o === q.ans ? "rgba(86,227,160,0.12)" : "rgba(248,113,113,0.12)") : "transparent", color: "var(--text)", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem", fontFamily: "monospace" }}>{o}</button>))}</div></div>);
}

// ──────────────────────────────────────────────────
//  STACK BUILDER GAME
// ──────────────────────────────────────────────────
const STACK_TASKS = [
    { instr: "Push 5, Push 3, Pop, Push 7, Peek", expected: "7", explain: "Stack: [5] → [5,3] → [5] → [5,7]. Peek = 7" },
    { instr: "Push 1, Push 2, Push 3, Pop, Pop, Peek", expected: "1", explain: "Stack: [1,2,3] → [1,2] → [1]. Peek = 1" },
    { instr: "Push 10, Push 20, Pop, Push 30, Pop, Peek", expected: "10", explain: "[10,20] → [10] → [10,30] → [10]. Peek = 10" },
    { instr: "Push A, Push B, Push C, Pop, Push D, Peek", expected: "D", explain: "[A,B,C] → [A,B] → [A,B,D]. Peek = D" },
    { instr: "Push 9, Pop, Push 4, Push 6, Pop, Peek", expected: "4", explain: "[9] → [] → [4,6] → [4]. Peek = 4" },
];
function StackBuilderGame({ onExit, onXP }: { onExit: () => void; onXP: (xp: number, r: string) => void }) {
    const [shuffled] = useState(() => [...STACK_TASKS].sort(() => Math.random() - 0.5));
    const [idx, setIdx] = useState(0);
    const [ans, setAns] = useState("");
    const [feedback, setFeedback] = useState("");
    const [score, setScore] = useState(0);
    const [done, setDone] = useState(false);
    const task = shuffled[idx];
    const submit = () => {
        const correct = ans.trim().toLowerCase() === task.expected.toLowerCase();
        if (correct) setScore(s => s + 1);
        setFeedback(correct ? `✅ Correct! ${task.explain}` : `❌ Wrong. Answer: ${task.expected}. ${task.explain}`);
        setTimeout(() => { setFeedback(""); setAns(""); if (idx + 1 >= shuffled.length) { setDone(true); onXP(score * 25, `Stack Builder: ${score}/${shuffled.length}`); } else setIdx(idx + 1); }, 2500);
    };
    if (done) return (<div className="page-enter" style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}><h2 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><Book size={24} /> Stack Builder Complete!</h2><div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--accent)", margin: "20px 0" }}>{score}/{shuffled.length}</div><button className="btn-primary" onClick={onExit}>Back to Games</button></div>);
    return (<div className="page-enter" style={{ maxWidth: 600, margin: "0 auto" }}><button className="btn-ghost" onClick={onExit}>← Back</button><h2 style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}><Book size={24} /> Stack Builder · {idx + 1}/{shuffled.length}</h2><div className="card" style={{ padding: 20, marginBottom: 16 }}><div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 8 }}>Execute these stack operations and tell the result of the last Peek:</div><div style={{ fontFamily: "monospace", fontSize: "1rem", fontWeight: 700, color: "var(--accent)" }}>{task.instr}</div></div>{feedback && <div className="card" style={{ marginBottom: 12, fontSize: "0.82rem", color: feedback.startsWith("✅") ? "var(--green)" : "#f87171" }}>{feedback}</div>}<div style={{ display: "flex", gap: 10 }}><input className="input-field" value={ans} onChange={e => setAns(e.target.value)} placeholder="Your answer..." onKeyDown={e => e.key === "Enter" && submit()} style={{ flex: 1 }} /><button className="btn-primary" onClick={submit}>Submit</button></div></div>);
}

// ──────────────────────────────────────────────────
//  CODE TRANSLATOR GAME
// ──────────────────────────────────────────────────
const TRANSLATE_QS = [
    { from: "Python", code: "print('Hello')", to: "JavaScript", ans: "console.log('Hello')", options: ["console.log('Hello')", "print('Hello')", "System.out.println('Hello')", "echo 'Hello'"] },
    { from: "JavaScript", code: "const x = [1,2,3].length", to: "Python", ans: "x = len([1,2,3])", options: ["x = size([1,2,3])", "x = [1,2,3].count()", "x = len([1,2,3])", "x = [1,2,3].length"] },
    { from: "Python", code: "for i in range(5):", to: "JavaScript", ans: "for (let i = 0; i < 5; i++)", options: ["for i in range(5)", "for (let i = 0; i < 5; i++)", "for (i=0; i<=5; i++)", "range(5).forEach()"] },
    { from: "JavaScript", code: "arr.push(item)", to: "Python", ans: "arr.append(item)", options: ["arr.add(item)", "arr.push(item)", "arr.append(item)", "arr.insert(item)"] },
    { from: "Python", code: "x = {'a': 1, 'b': 2}", to: "JavaScript", ans: "const x = {a: 1, b: 2}", options: ["var x = {'a': 1}", "const x = {a: 1, b: 2}", "let x = new Map()", "x = Object({a:1})"] },
    { from: "JavaScript", code: "str.includes('hello')", to: "Python", ans: "'hello' in str", options: ["str.contains('hello')", "'hello' in str", "str.has('hello')", "str.find('hello')"] },
];
function CodeTranslatorGame({ onExit, onXP }: { onExit: () => void; onXP: (xp: number, r: string) => void }) {
    const [shuffled] = useState(() => [...TRANSLATE_QS].sort(() => Math.random() - 0.5));
    const [idx, setIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [picked, setPicked] = useState<number | null>(null);
    const [done, setDone] = useState(false);
    const q = shuffled[idx];
    const pick = (i: number) => {
        if (picked !== null) return; setPicked(i);
        if (q.options[i] === q.ans) setScore(s => s + 1);
        setTimeout(() => { setPicked(null); if (idx + 1 >= shuffled.length) { setDone(true); onXP(score * 20, `Translator: ${score}/${shuffled.length}`); } else setIdx(idx + 1); }, 1000);
    };
    if (done) return (<div className="page-enter" style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}><h2 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><Globe size={24} /> Code Translator Complete!</h2><div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--accent)", margin: "20px 0" }}>{score}/{shuffled.length}</div><button className="btn-primary" onClick={onExit}>Back to Games</button></div>);
    return (<div className="page-enter" style={{ maxWidth: 600, margin: "0 auto" }}><button className="btn-ghost" onClick={onExit}>← Back</button><h2 style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}><Globe size={24} /> Code Translator · {idx + 1}/{shuffled.length}</h2><div className="card" style={{ padding: 20, marginBottom: 16, textAlign: "center" }}><div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: 8 }}>Translate from <strong style={{ color: "#f472b6" }}>{q.from}</strong> → <strong style={{ color: "var(--green)" }}>{q.to}</strong></div><div style={{ fontFamily: "monospace", fontSize: "1.05rem", fontWeight: 700, color: "#f472b6", background: "rgba(244,114,182,0.08)", borderRadius: 10, padding: "12px 16px" }}>{q.code}</div></div><div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{q.options.map((o, i) => (<button key={i} onClick={() => pick(i)} disabled={picked !== null} style={{ padding: 12, borderRadius: 10, border: `2px solid ${picked === i ? (o === q.ans ? "var(--green)" : "#f87171") : "rgba(163,119,157,0.2)"}`, background: picked === i ? (o === q.ans ? "rgba(86,227,160,0.12)" : "rgba(248,113,113,0.12)") : "transparent", color: "var(--text)", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem", fontFamily: "monospace" }}>{o}</button>))}</div></div>);
}

// ──────────────────────────────────────────────────
//  MAIN GAMIFICATION PAGE
// ──────────────────────────────────────────────────
type GameId = "typing" | "quiz" | "bughunt" | "flashcard" | "pattern" | "algorace" | "sql" | "regex" | "stack" | "translator" | null;

const GAMES = [
    { id: "typing" as GameId, icon: <Keyboard size={28} />, title: "Code Syntax Speed", desc: "Type complex tech sentences to improve muscle memory. Scored by WPM and strict accuracy.", color: "#8b5cf6", badge: "Speed", xpRange: "30–80 XP" },
    { id: "quiz" as GameId, icon: <Brain size={28} />, title: "CS Fundamentals Assessment", desc: "Advanced multiple-choice on System Design, Data Structures, and Core Architecture.", color: "#10b981", badge: "Knowledge", xpRange: "Up to 150 XP" },
    { id: "bughunt" as GameId, icon: <Bug size={28} />, title: "Production Bug Hunt", desc: "Identify memory leaks, off-by-one errors, and async issues in real production code.", color: "#f59e0b", badge: "Debugging", xpRange: "35 XP / bug" },
    { id: "flashcard" as GameId, icon: <BookOpen size={28} />, title: "Spaced Repetition Engine", desc: "Master complex concepts (CAP theorem, Paxos, B-Trees) using spaced repetition.", color: "#3b82f6", badge: "Memory", xpRange: "10 XP / card" },
    { id: "pattern" as GameId, icon: <Target size={28} />, title: "Design Pattern Match", desc: "Recognize structural and behavioral design patterns in raw code snippets.", color: "#ec4899", badge: "Patterns", xpRange: "20 XP / match" },
    { id: "algorace" as GameId, icon: <Zap size={28} />, title: "Big-O Algorithm Analysis", desc: "Analyze the time and space complexity of advanced algorithms under time pressure.", color: "#eab308", badge: "Algorithms", xpRange: "20 XP / correct" },
    { id: "sql" as GameId, icon: <Database size={28} />, title: "Advanced Query Optimizer", desc: "Construct optimal SQL queries involving CTEs, window functions, and complex joins.", color: "#14b8a6", badge: "Database", xpRange: "25 XP / query" },
    { id: "regex" as GameId, icon: <Type size={28} />, title: "Regex Parsing Engine", desc: "Formulate precise regular expressions to extract complex data patterns.", color: "#f97316", badge: "Regex", xpRange: "20 XP / pattern" },
    { id: "stack" as GameId, icon: <Book size={28} />, title: "Memory Stack Simulator", desc: "Simulate heap and stack memory operations to predict final execution states.", color: "#a855f7", badge: "DSA", xpRange: "25 XP / correct" },
    { id: "translator" as GameId, icon: <Globe size={28} />, title: "Cross-Language Compiler", desc: "Translate core logic paradigms between Python, JavaScript, and Go syntax.", color: "#06b6d4", badge: "Polyglot", xpRange: "20 XP / translate" },
];

export default function GamificationPage() {
    const { profile, addXP } = useAppStore();
    const [activeGame, setActiveGame] = useState<GameId>(null);

    // Read progress safely
    const getProgress = () => {
        if (typeof window === "undefined") return {};
        const s = localStorage.getItem("ciq-progress");
        return s ? JSON.parse(s) : {};
    };

    const challenges = [
        { label: "Upload Resume", desc: "Activate AI pipeline", done: !!profile?.skills?.length, xp: 100, icon: <FileText size={20} /> },
        { label: "Complete Interview", desc: "Finish a full mock round", done: typeof window !== "undefined" && !!localStorage.getItem("ciq-interview-done"), xp: 150, icon: <Mic size={20} /> },
        { label: "Learn 4 Lessons", desc: "Finish 4 learning modules", done: typeof window !== "undefined" && !!localStorage.getItem("ciq-lesson-done"), xp: 80, icon: <Book size={20} /> },
        { label: "Code Syntax Speed", desc: "Exceed 40 WPM strictly", done: (profile?.xp || 0) >= 50, xp: 80, icon: <Keyboard size={20} /> },
        { label: "CS Assessment", desc: "Score 6+ on Fundamentals", done: (profile?.xp || 0) >= 100, xp: 120, icon: <Brain size={20} /> },
        { label: "Find 3 Critical Bugs", desc: "Clear the Production Bug Hunt", done: (profile?.xp || 0) >= 200, xp: 100, icon: <Bug size={20} /> },
        { label: "Global Market Analysis", desc: "Analyze 5 global job markets", done: false, xp: 60, icon: <Globe size={20} /> },
        { label: "Reach Engineer Level I", desc: "Accumulate 500+ XP", done: (profile?.xp || 0) >= 500, xp: 0, icon: <Star size={20} /> },
        { label: "Reach Senior Architect", desc: "Accumulate 1500+ XP", done: (profile?.xp || 0) >= 1500, xp: 0, icon: <Medal size={20} /> },
    ];

    if (activeGame === "typing") return <TypingGame onExit={() => setActiveGame(null)} onXP={addXP} />;
    if (activeGame === "quiz") return <QuizGame onExit={() => setActiveGame(null)} onXP={addXP} />;
    if (activeGame === "bughunt") return <BugHuntGame onExit={() => setActiveGame(null)} onXP={addXP} />;
    if (activeGame === "flashcard") return <FlashcardGame onExit={() => setActiveGame(null)} onXP={addXP} />;
    if (activeGame === "pattern") return <PatternMatchGame onExit={() => setActiveGame(null)} onXP={addXP} />;
    if (activeGame === "algorace") return <AlgoRaceGame onExit={() => setActiveGame(null)} onXP={addXP} />;
    if (activeGame === "sql") return <SQLChallengeGame onExit={() => setActiveGame(null)} onXP={addXP} />;
    if (activeGame === "regex") return <RegexMasterGame onExit={() => setActiveGame(null)} onXP={addXP} />;
    if (activeGame === "stack") return <StackBuilderGame onExit={() => setActiveGame(null)} onXP={addXP} />;
    if (activeGame === "translator") return <CodeTranslatorGame onExit={() => setActiveGame(null)} onXP={addXP} />;

    return (
        <div className="page-enter">
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
                <div>
                    <h1 style={{ marginBottom: 4, display: "flex", alignItems: "center", gap: 10, letterSpacing: "-0.03em" }}>
                        <Target size={28} color="var(--accent)" /> Advanced Skill Simulations
                    </h1>
                    <p style={{ color: "var(--text-sub)", fontSize: "0.9rem", maxWidth: 600, lineHeight: 1.5 }}>
                        Engage in rigorous technical simulations designed to validate and exponentially improve your engineering competencies.
                    </p>
                </div>
                <div className="card liquid-glass" style={{ minWidth: 160, textAlign: "center", padding: "16px 24px", borderColor: "var(--accent-glow)" }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Total XP</div>
                    <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--accent)", textShadow: "0 0 20px rgba(167,139,250,0.4)" }}>{profile?.xp || 0}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--green)", fontWeight: 600 }}>{profile?.level || "L1 Engineer"}</div>
                </div>
            </div>

            {/* Playable Games */}
            <h2 style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 10, fontSize: "1.2rem", fontWeight: 700 }}><Zap size={20} color="var(--yellow)" /> Technical Assessments</h2>
            <div className="grid-4" style={{ marginBottom: 40 }}>
                {GAMES.map(g => (
                    <div key={g.id} className="card liquid-glass" style={{ cursor: "pointer", borderColor: "rgba(255,255,255,0.08)", background: "rgba(20,15,35,0.6)", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}
                        onClick={() => setActiveGame(g.id)}
                        onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-6px)"; el.style.borderColor = `${g.color}50`; el.style.boxShadow = `0 10px 30px ${g.color}15, inset 0 0 20px ${g.color}05`; }}
                        onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = ""; el.style.borderColor = "rgba(255,255,255,0.08)"; el.style.boxShadow = ""; }}>
                        <div style={{ marginBottom: 14, color: g.color, display: "inline-flex", padding: 10, borderRadius: 12, background: `${g.color}15` }}>{g.icon}</div>
                        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                            <span style={{ fontSize: "0.65rem", fontWeight: 700, background: `${g.color}15`, color: g.color, border: `1px solid ${g.color}30`, borderRadius: 4, padding: "3px 8px", textTransform: "uppercase" }}>{g.badge}</span>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text)", marginBottom: 8, letterSpacing: "-0.02em" }}>{g.title}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-sub)", lineHeight: 1.6, marginBottom: 18 }}>{g.desc}</div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 12 }}>
                            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>{g.xpRange}</span>
                            <span style={{ fontSize: "0.75rem", color: g.color, fontWeight: 700 }}>Initialize →</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Challenges */}
            <h2 style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10, fontSize: "1.2rem", fontWeight: 700 }}><Trophy size={20} color="var(--green)" /> Core Competency Checklist</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12 }}>
                {challenges.map((c, i) => (
                    <div key={i} className="card" style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", opacity: c.done ? 0.6 : 1, borderColor: c.done ? "rgba(86,227,160,0.15)" : "rgba(255,255,255,0.05)", background: c.done ? "rgba(86,227,160,0.03)" : "var(--surface)" }}>
                        <div style={{ flexShrink: 0, color: c.done ? "var(--green)" : "var(--accent)" }}>{c.icon}</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                                <span style={{ fontWeight: 600, fontSize: "0.9rem", color: c.done ? "var(--text-muted)" : "var(--text)", textDecoration: c.done ? "line-through" : "none" }}>{c.label}</span>
                                {c.done && <span style={{ fontSize: "0.65rem", background: "rgba(86,227,160,0.1)", color: "var(--green)", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>✓ VERIFIED</span>}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-sub)" }}>{c.desc}</div>
                        </div>
                        {c.xp > 0 && !c.done && <span style={{ flexShrink: 0, fontSize: "0.75rem", color: "var(--accent)", fontWeight: 700 }}>+{c.xp} XP</span>}
                    </div>
                ))}
            </div>
        </div>
    );
}
