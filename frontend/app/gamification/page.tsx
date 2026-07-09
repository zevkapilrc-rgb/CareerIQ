"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useAppStore } from "@/src/state/useAppStore";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Keyboard, Brain, Bug, Target, Zap, Database, Type, BookOpen, Globe,
  Gamepad2, Trophy, FileText, Mic, Star, Medal, Award, Activity,
  ChevronRight, Sparkles, TrendingUp, Clock, CheckCircle, Play,
  ArrowLeft, RotateCcw, Book
} from "lucide-react";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { ProgressBar } from "@/src/components/ui/Progress";
import GlassCard from "@/src/components/ui/GlassCard";
import KPICard from "@/src/components/ui/KPICard";
import Badge from "@/src/components/ui/Badge";
import PremiumButton from "@/src/components/ui/PremiumButton";

// ──────────────────────────────────────────────────
//  PROCEDURAL QUESTION GENERATORS
// ──────────────────────────────────────────────────

function getRandomTypingSentence(): string {
  const subjects = [
    "React component", "Next.js server page", "TypeScript compiler", "Redis caching layer",
    "PostgreSQL query optimizer", "Docker microservice container", "Kubernetes pod replica",
    "Kafka message streaming broker", "Binary search tree node", "Dynamic programming matrix",
    "Deep learning model training", "GraphQL query schema", "REST API request handler",
    "Zustand client store state", "Git branch merge commit", "AWS Lambda execution environment",
    "OAuth authentication protocol", "Elasticsearch indexing query", "CSS grid flex container",
    "Websocket server socket channel", "WebAssembly execution module", "Vite build bundler",
  ];
  const verbs = [
    "re-renders when state update changes", "runs in O(log n) average time complexity",
    "caches database calls to reduce response latency", "compiles type annotations statically",
    "filters rows dynamically after grouping fields", "decouples system microservices asynchronously",
    "handles CORS requests securely in production", "scales read replicas across multiple regions",
    "maps user credentials using bcrypt hashing", "memoizes heavy recursive calculation results",
    "resolves nested array object fields recursively", "validates schema request bodies automatically",
    "prevents memory leaks using garbage collection", "establishes secure HTTPS network tunnels",
    "executes atomic transactions with ACID isolation", "balances server loads across active nodes",
  ];
  const contexts = [
    "in multi-tenant environments.", "to optimize overall page speed.", "with zero downtime.",
    "to secure user data privacy.", "for high scalability.", "without blocking the event loop.",
    "using modern development patterns.", "under heavy concurrent loads.", "to improve P99 web latency.",
  ];
  const sub = subjects[Math.floor(Math.random() * subjects.length)];
  const v = verbs[Math.floor(Math.random() * verbs.length)];
  const c = contexts[Math.floor(Math.random() * contexts.length)];
  const randomMs = Math.floor(Math.random() * 50) + 2;
  const randomPct = Math.floor(Math.random() * 60) + 15;
  let sentence = sub + " " + v + " " + c;
  if (Math.random() > 0.5) {
    sentence += " Processed in " + randomMs + "ms showing " + randomPct + "% efficiency gains.";
  }
  return sentence;
}

function getRandomQuizQuestion(): { q: string; options: string[]; ans: number } {
  const algos = [
    { name: "Binary Search", avg: "O(log n)", worst: "O(log n)", best: "O(1)" },
    { name: "Bubble Sort", avg: "O(n²)", worst: "O(n²)", best: "O(n)" },
    { name: "Merge Sort", avg: "O(n log n)", worst: "O(n log n)", best: "O(n log n)" },
    { name: "Quick Sort", avg: "O(n log n)", worst: "O(n²)", best: "O(n log n)" },
    { name: "Insertion Sort", avg: "O(n²)", worst: "O(n²)", best: "O(n)" },
    { name: "Heap Sort", avg: "O(n log n)", worst: "O(n log n)", best: "O(n log n)" },
    { name: "Linear Search", avg: "O(n)", worst: "O(n)", best: "O(1)" },
  ];
  const possibleOpts = ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)", "O(nk)", "O(2^n)"];
  const type = Math.floor(Math.random() * 4);
  if (type === 0) {
    const algo = algos[Math.floor(Math.random() * algos.length)];
    const caseType = Math.floor(Math.random() * 3);
    let q = "", correct = "";
    if (caseType === 0) { q = `What is the AVERAGE time complexity of ${algo.name}?`; correct = algo.avg; }
    else if (caseType === 1) { q = `What is the WORST-CASE time complexity of ${algo.name}?`; correct = algo.worst; }
    else { q = `What is the BEST-CASE time complexity of ${algo.name}?`; correct = algo.best; }
    const opts = [correct, ...possibleOpts.filter(o => o !== correct).slice(0, 3)].sort(() => Math.random() - 0.5);
    return { q, options: opts, ans: opts.indexOf(correct) };
  } else if (type === 1) {
    const a = Math.floor(Math.random() * 20) + 2, b = Math.floor(Math.random() * 10) + 2, step = Math.floor(Math.random() * 3) + 1;
    const ansVal = a + b * step;
    const q = `What is the return value?\n\nfunction compute() {\n  let x = ${a};\n  for (let i = 0; i < ${b}; i++) {\n    x += ${step};\n  }\n  return x;\n}`;
    const opts = Array.from(new Set([ansVal, a + b, a * b, a + b * step * 2, ansVal - 1])).slice(0, 4).map(String).sort(() => Math.random() - 0.5);
    if (opts.indexOf(String(ansVal)) === -1) { opts[0] = String(ansVal); opts.sort(() => Math.random() - 0.5); }
    return { q, options: opts, ans: opts.indexOf(String(ansVal)) };
  } else if (type === 2) {
    const a = Math.floor(Math.random() * 100) + 5, b = Math.floor(Math.random() * 100) + 5;
    const ansVal = Math.abs(a - b);
    const q = `What is the value of 'z'?\n\nlet x = ${a};\nlet y = ${b};\nlet z = (x > y) ? x - y : y - x;`;
    const opts = Array.from(new Set([ansVal, a + b, a, b, ansVal + 10])).slice(0, 4).map(String).sort(() => Math.random() - 0.5);
    if (opts.indexOf(String(ansVal)) === -1) { opts[0] = String(ansVal); opts.sort(() => Math.random() - 0.5); }
    return { q, options: opts, ans: opts.indexOf(String(ansVal)) };
  } else {
    const a = Math.floor(Math.random() * 10) + 2, b = Math.floor(Math.random() * 10) + 2;
    const ansVal = a * b;
    const q = `What is the final value of 'count'?\n\nlet count = 0;\nfor (let i = 0; i < ${a}; i++) {\n  for (let j = 0; j < ${b}; j++) {\n    count++;\n  }\n}`;
    const opts = Array.from(new Set([ansVal, a + b, a * b + a, a * b - b, ansVal + 5])).slice(0, 4).map(String).sort(() => Math.random() - 0.5);
    if (opts.indexOf(String(ansVal)) === -1) { opts[0] = String(ansVal); opts.sort(() => Math.random() - 0.5); }
    return { q, options: opts, ans: opts.indexOf(String(ansVal)) };
  }
}

function getRandomBugQuestion(): { code: string; bug: string; hint: string } {
  const varNames = ["arr", "items", "data", "records", "users", "prices", "scores", "values", "list"];
  const funcNames = ["sum", "calculateTotal", "processList", "aggregate", "findSum", "countAll"];
  const v = varNames[Math.floor(Math.random() * varNames.length)];
  const fn = funcNames[Math.floor(Math.random() * funcNames.length)];
  const type = Math.floor(Math.random() * 4);
  if (type === 0) {
    const loopVar = Math.random() > 0.5 ? "i" : "j";
    const code = `function ${fn}(${v}) {\n  let total = 0;\n  for (let ${loopVar} = 0; ${loopVar} <= ${v}.length; ${loopVar}++) {\n    total += ${v}[${loopVar}];\n  }\n  return total;\n}`;
    return { code, bug: "Loop uses '<=' instead of '<', causing off-by-one error (accesses undefined index equal to length)", hint: "Check the loop boundary condition" };
  } else if (type === 1) {
    const ep = ["users", "products", "data", "profile"][Math.floor(Math.random() * 4)];
    const code = `async function fetch${ep.charAt(0).toUpperCase() + ep.slice(1)}() {\n  const res = fetch('/api/${ep}');\n  const json = await res.json();\n  return json;\n}`;
    return { code, bug: "Missing 'await' before fetch(). The 'res' is a Promise, not a Response — .json() will throw a runtime error.", hint: "Is the fetch resolved before calling .json()?" };
  } else if (type === 2) {
    const st = ["count", "score", "timer", "clicks"][Math.floor(Math.random() * 4)];
    const setSt = `set${st.charAt(0).toUpperCase() + st.slice(1)}`;
    const interval = (Math.floor(Math.random() * 5) + 1) * 500;
    const code = `useEffect(() => {\n  const id = setInterval(() => {\n    ${setSt}(${st} + 1);\n  }, ${interval});\n  return () => clearInterval(id);\n}, []);`;
    return { code, bug: `Missing '${st}' in useEffect dependency array. Stale closure — use functional update: ${setSt}(prev => prev + 1)`, hint: "How is the state variable referenced inside the interval?" };
  } else {
    const prop = ["address", "profile", "settings", "meta"][Math.floor(Math.random() * 4)];
    const code = `function cloneUser(user) {\n  const copy = Object.assign({}, user);\n  copy.${prop}.updatedAt = new Date();\n  return copy;\n}`;
    return { code, bug: `Object.assign performs shallow copy. Nested '${prop}' is a shared reference — modifying it mutates the original.`, hint: "Are nested objects duplicated or reference-copied?" };
  }
}

function getRandomFlashcard(): { front: string; back: string } {
  const solid = [
    { front: "S in SOLID", back: "Single Responsibility: A class should have only one reason to change." },
    { front: "O in SOLID", back: "Open/Closed: Open for extension, closed for modification." },
    { front: "L in SOLID", back: "Liskov Substitution: Subtypes must be substitutable for base types." },
    { front: "I in SOLID", back: "Interface Segregation: Clients shouldn't depend on methods they don't use." },
    { front: "D in SOLID", back: "Dependency Inversion: Depend on abstractions, not concretions." },
  ];
  const ds = ["Array", "Singly Linked List", "Stack", "Queue", "Binary Search Tree", "Hash Table"];
  const ops = ["Access", "Search", "Insertion", "Deletion"];
  const dsComplexity: Record<string, Record<string, string>> = {
    "Array": { "Access": "O(1)", "Search": "O(n)", "Insertion": "O(n)", "Deletion": "O(n)" },
    "Singly Linked List": { "Access": "O(n)", "Search": "O(n)", "Insertion": "O(1)", "Deletion": "O(1)" },
    "Stack": { "Access": "O(n)", "Search": "O(n)", "Insertion": "O(1)", "Deletion": "O(1)" },
    "Queue": { "Access": "O(n)", "Search": "O(n)", "Insertion": "O(1)", "Deletion": "O(1)" },
    "Binary Search Tree": { "Access": "O(log n) avg", "Search": "O(log n) avg", "Insertion": "O(log n) avg", "Deletion": "O(log n) avg" },
    "Hash Table": { "Access": "N/A", "Search": "O(1) avg", "Insertion": "O(1) avg", "Deletion": "O(1) avg" },
  };
  const gitCmds = [
    { cmd: "git init", desc: "Initializes a new local Git repository" },
    { cmd: "git clone", desc: "Creates a local copy of a remote repository" },
    { cmd: "git add", desc: "Adds modified files to the staging area" },
    { cmd: "git commit", desc: "Saves the staged snapshot permanently in history" },
    { cmd: "git merge", desc: "Combines changes from one branch into current branch" },
    { cmd: "git rebase", desc: "Applies local commits on top of another base branch" },
    { cmd: "git stash", desc: "Temporarily saves changes and reverts to HEAD" },
  ];
  const type = Math.floor(Math.random() * 4);
  if (type === 0) return solid[Math.floor(Math.random() * solid.length)];
  if (type === 1) {
    const d = ds[Math.floor(Math.random() * ds.length)];
    const op = ops[Math.floor(Math.random() * ops.length)];
    return { front: `${op} operation in a ${d}?`, back: `${dsComplexity[d]?.[op] || "O(n)"}` };
  }
  if (type === 2) {
    const g = gitCmds[Math.floor(Math.random() * gitCmds.length)];
    return { front: `What does '${g.cmd}' do?`, back: g.desc };
  }
  const a = Math.floor(Math.random() * 100) + 10, b = Math.floor(Math.random() * 20) + 2, c = Math.floor(Math.random() * 50) + 5;
  return { front: `What is ${a} × ${b} + ${c}?`, back: `${a * b + c}` };
}

function getRandomPattern(): { code: string; pattern: string; options: string[] } {
  const v = ["arr", "items", "data", "list", "nums"][Math.floor(Math.random() * 5)];
  const num = Math.floor(Math.random() * 50) + 2;
  const typeIdx = Math.floor(Math.random() * 6);
  let code = "", pattern = "", options: string[] = [];
  if (typeIdx === 0) { code = `${v}.map(x => x * ${num})`; pattern = "Map"; options = ["Map", "Filter", "Reduce", "ForEach"]; }
  else if (typeIdx === 1) { code = `${v}.filter(x => x > ${num})`; pattern = "Filter"; options = ["Map", "Filter", "Reduce", "Find"]; }
  else if (typeIdx === 2) { code = `${v}.reduce((acc, val) => acc + val, ${num})`; pattern = "Reduce"; options = ["Map", "Filter", "Reduce", "Some"]; }
  else if (typeIdx === 3) { code = `const [a, b, ...rest] = ${v};`; pattern = "Destructuring + Rest"; options = ["Spread Only", "Rest Only", "Destructuring + Rest", "Assignment"]; }
  else if (typeIdx === 4) { code = `obj?.profile?.settings?.theme ?? 'dark'`; pattern = "Optional Chaining + Nullish"; options = ["Ternary", "Logical OR", "Optional Chaining + Nullish", "Short-circuit"]; }
  else { code = `const copy = { ...${v}, timestamp: Date.now() };`; pattern = "Object Spread"; options = ["Object Spread", "Object Assign", "Shallow Clone", "Rest Bind"]; }
  return { code, pattern, options: [...options].sort(() => Math.random() - 0.5) };
}

function getRandomAlgoQuestion(): { algo: string; answer: string; options: string[] } {
  const complex = ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)", "O(2^n)", "O(V+E)", "O(V²)"];
  const algos = [
    { name: "Binary Search", ans: "O(log n)" }, { name: "Bubble Sort (average)", ans: "O(n²)" },
    { name: "Merge Sort (average)", ans: "O(n log n)" }, { name: "Quick Sort (average)", ans: "O(n log n)" },
    { name: "Insertion Sort (average)", ans: "O(n²)" }, { name: "Linear Search", ans: "O(n)" },
    { name: "Hash Table Lookup (average)", ans: "O(1)" }, { name: "DFS/BFS Graph Traversal", ans: "O(V+E)" },
    { name: "Fibonacci (recursive)", ans: "O(2^n)" },
  ];
  const item = algos[Math.floor(Math.random() * algos.length)];
  const opts = Array.from(new Set([item.ans, ...complex.filter(c => c !== item.ans).slice(0, 3)])).sort(() => Math.random() - 0.5);
  return { algo: item.name, answer: item.ans, options: opts };
}

function getRandomSQLQuestion(): { q: string; ans: string; options: string[] } {
  const tables = ["users", "orders", "products", "employees", "sales", "transactions", "customers"];
  const cols = ["id", "name", "email", "status", "price", "amount", "created_at", "category"];
  const table = tables[Math.floor(Math.random() * tables.length)];
  const col = cols[Math.floor(Math.random() * cols.length)];
  const limit = Math.floor(Math.random() * 100) + 10;
  const type = Math.floor(Math.random() * 4);
  let q = "", ans = "", options: string[] = [];
  if (type === 0) {
    q = `Select all fields from '${table}' where ${col} is greater than ${limit}`;
    ans = `SELECT * FROM ${table} WHERE ${col} > ${limit}`;
    options = [ans, `SELECT ALL FROM ${table} WHERE ${col} > ${limit}`, `GET FROM ${table} WHERE ${col} > ${limit}`, `SELECT * FROM ${table} HAVING ${col} > ${limit}`];
  } else if (type === 1) {
    q = `Count the total records in '${table}'`;
    ans = `SELECT COUNT(*) FROM ${table}`;
    options = [ans, `SELECT SUM(*) FROM ${table}`, `COUNT RECORDS IN ${table}`, `SELECT COUNT(all) FROM ${table}`];
  } else if (type === 2) {
    q = `Delete records from '${table}' where ${col} is NULL`;
    ans = `DELETE FROM ${table} WHERE ${col} IS NULL`;
    options = [ans, `REMOVE FROM ${table} WHERE ${col} IS NULL`, `DELETE * FROM ${table} WHERE ${col} = NULL`, `DROP RECORDS FROM ${table} WHERE ${col} IS NULL`];
  } else {
    q = `Select distinct categories from '${table}' ordered by ${col} descending`;
    ans = `SELECT DISTINCT category FROM ${table} ORDER BY ${col} DESC`;
    options = [ans, `SELECT category FROM ${table} GROUP BY category ORDER BY ${col} DESC`, `SELECT UNIQUE category FROM ${table} ORDER BY ${col} DOWN`, `GET category FROM ${table} ORDER BY ${col} DESCENDING`];
  }
  return { q, ans, options: [...options].sort(() => Math.random() - 0.5) };
}

function getRandomRegexQuestion(): { q: string; ans: string; options: string[] } {
  const type = Math.floor(Math.random() * 4);
  if (type === 0) return { q: "Match a HEX color code (e.g. #FF5733)", ans: "/^#[0-9A-Fa-f]{6}$/", options: ["/^#[0-9A-Fa-f]{6}$/", "/^#\\w{6}$/", "/#color/", "/^#\\d{6}$/"].sort(() => Math.random() - 0.5) };
  if (type === 1) return { q: "Match a standard email address", ans: "/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/", options: ["/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/", "/@.*/", "/\\w+@\\w+/", "/email/"].sort(() => Math.random() - 0.5) };
  if (type === 2) return { q: "Match exactly 10 numeric digits (phone check)", ans: "/^\\d{10}$/", options: ["/^\\d{10}$/", "/\\d{10}/", "/[0-9]*/", "/^\\d{10,12}$/"].sort(() => Math.random() - 0.5) };
  return { q: "Match a URL starting with https://", ans: "/^https:\\/\\/.+/", options: ["/^https:\\/\\/.+/", "/http.*/", "/^https:.*/", "/https:\\/\\/www/"].sort(() => Math.random() - 0.5) };
}

function getRandomStackTask(): { instr: string; expected: string; explain: string } {
  const stack: string[] = [];
  const operations: string[] = [];
  const trace: string[] = [];
  const numOps = 4 + Math.floor(Math.random() * 4);
  for (let j = 0; j < numOps; j++) {
    const isPush = stack.length === 0 || Math.random() > 0.4;
    if (isPush) { const el = String(Math.floor(Math.random() * 20) + 1); stack.push(el); operations.push(`Push ${el}`); }
    else { stack.pop(); operations.push("Pop"); }
    trace.push(`[${stack.join(",")}]`);
  }
  const expected = stack.length > 0 ? stack[stack.length - 1] : "Empty";
  operations.push("Peek");
  return { instr: operations.join(", "), expected, explain: `Stack trace: ${trace.join(" → ")}. Top is ${expected}` };
}

function getRandomTranslatorQuestion(): { from: string; code: string; to: string; ans: string; options: string[] } {
  const val = Math.floor(Math.random() * 100) + 2;
  const type = Math.floor(Math.random() * 3);
  const v = ["x", "y", "data", "items", "val"][Math.floor(Math.random() * 5)];
  if (type === 0) {
    const ans = `console.log("Hello World ${val}")`;
    return { from: "Python", code: `print("Hello World ${val}")`, to: "JavaScript", ans, options: [ans, `print("Hello World ${val}")`, `System.out.println("Hello World ${val}")`, `echo "Hello World ${val}"`].sort(() => Math.random() - 0.5) };
  }
  if (type === 1) {
    const ans = `${v} = len([${val}, ${val + 1}])`;
    return { from: "JavaScript", code: `const ${v} = [${val}, ${val + 1}].length;`, to: "Python", ans, options: [ans, `${v} = [${val}, ${val + 1}].length`, `${v} = size([${val}, ${val + 1}])`, `${v} = [${val}, ${val + 1}].count()`].sort(() => Math.random() - 0.5) };
  }
  const ans = `for (let ${v} = 0; ${v} < ${val}; ${v}++)`;
  return { from: "Python", code: `for ${v} in range(${val}):`, to: "JavaScript", ans, options: [ans, `for (let ${v} = 1; ${v} <= ${val}; ${v}++)`, `for (let ${v} = 0; ${v} <= ${val}; ${v}++)`, `for (let ${v} = 1; ${v} < ${val}; ${v}++)`].sort(() => Math.random() - 0.5) };
}

// ──────────────────────────────────────────────────
//  SHARED GAME COMPONENTS
// ──────────────────────────────────────────────────

function GameHeader({ title, icon, score, total, onExit }: { title: string; icon: React.ReactNode; score?: number; total?: number; onExit: () => void }) {
  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800/60">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#6D001A]/15 border border-[#6D001A]/25 flex items-center justify-center text-[#Fca5a5]">
          {icon}
        </div>
        <div>
          <h2 className="text-base font-semibold text-zinc-100">{title}</h2>
          {score !== undefined && total !== undefined && (
            <p className="text-xs text-zinc-500 mt-0.5">Score: <span className="text-[#Fca5a5] font-bold">{score}</span> / {total}</p>
          )}
        </div>
      </div>
      <button
        onClick={onExit}
        className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-1.5 rounded-lg transition-all"
      >
        <ArrowLeft size={12} /> Exit
      </button>
    </div>
  );
}

function AnswerButton({ label, onClick, state, children }: {
  label?: string; onClick?: () => void; state: "default" | "correct" | "wrong" | "neutral"; children: React.ReactNode;
}) {
  const styles = {
    default: "bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-300 border-zinc-800/80 hover:border-zinc-700",
    correct: "bg-emerald-950/30 text-emerald-400 border-emerald-800/60",
    wrong: "bg-red-950/30 text-red-400 border-red-800/60",
    neutral: "bg-zinc-950/30 text-zinc-500 border-zinc-900 opacity-60",
  };
  return (
    <button
      onClick={onClick}
      className={`w-full text-left py-3 px-4 border rounded-xl text-sm font-mono transition-all duration-200 flex items-center justify-between gap-3 ${styles[state]}`}
    >
      <span>{label && <span className="text-zinc-500 mr-2">{label}.</span>}{children}</span>
      {state === "correct" && <span className="text-emerald-400 flex-shrink-0">✓</span>}
      {state === "wrong" && <span className="text-red-400 flex-shrink-0">✗</span>}
    </button>
  );
}

function GameComplete({ icon, title, score, total, onRestart, onExit, xpEarned }: {
  icon: React.ReactNode; title: string; score: number; total: number; onRestart: () => void; onExit: () => void; xpEarned?: number;
}) {
  const pct = Math.round((score / total) * 100);
  const color = pct >= 80 ? "text-emerald-400" : pct >= 60 ? "text-amber-400" : "text-[#Fca5a5]";
  const msg = pct >= 80 ? "Excellent performance!" : pct >= 60 ? "Good work — keep improving!" : "Review the concepts and try again";
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 px-6">
      <div className="w-16 h-16 rounded-2xl bg-[#6D001A]/15 border border-[#6D001A]/25 flex items-center justify-center text-[#Fca5a5] mx-auto mb-5">
        {icon}
      </div>
      <h2 className="text-2xl font-semibold text-zinc-100 mb-1">{title}</h2>
      <p className="text-sm text-zinc-500 mb-6">{msg}</p>
      <div className={`text-6xl font-bold font-mono mb-2 ${color}`}>{score}/{total}</div>
      <div className={`text-sm font-semibold uppercase tracking-wider ${color} mb-2`}>{pct}%</div>
      {xpEarned !== undefined && xpEarned > 0 && (
        <div className="inline-flex items-center gap-1.5 bg-emerald-950/20 border border-emerald-900/40 px-3 py-1 rounded-full text-xs font-bold text-emerald-400 mb-6">
          <Zap size={12} /> +{xpEarned} XP earned
        </div>
      )}
      <div className="flex gap-3 justify-center mt-4">
        <button onClick={onRestart} className="flex items-center gap-2 px-4 py-2.5 bg-[#6D001A] hover:bg-[#8B0025] text-white text-sm font-semibold rounded-xl transition-colors">
          <RotateCcw size={14} /> Play Again
        </button>
        <button onClick={onExit} className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-sm font-semibold border border-zinc-800 rounded-xl transition-colors">
          Back to Hub
        </button>
      </div>
    </motion.div>
  );
}

// ──────────────────────────────────────────────────
//  TYPING SPEED GAME
// ──────────────────────────────────────────────────
function TypingGame({ onExit, onXP }: { onExit: () => void; onXP: (xp: number, r: string) => void }) {
  const [sentence, setSentence] = useState(() => getRandomTypingSentence());
  const [sentenceCount, setSentenceCount] = useState(1);
  const [input, setInput] = useState("");
  const [start, setStart] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (start && !done) {
      timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 500);
    }
    return () => clearInterval(timerRef.current);
  }, [start, done]);

  const handleType = (val: string) => {
    if (!start) setStart(Date.now());
    setInput(val);
    if (val === sentence) {
      clearInterval(timerRef.current);
      const elapsedMin = (Date.now() - (start || Date.now())) / 1000 / 60;
      const wordCount = sentence.split(" ").length;
      const w = Math.round(wordCount / elapsedMin);
      setWpm(w);
      setDone(true);
      const xp = w >= 60 ? 80 : w >= 40 ? 50 : 30;
      onXP(xp, `Typing Speed: ${w} WPM`);
    }
  };

  const chars = sentence.split("").map((c, i) => {
    const typed = input[i];
    const color = typed === undefined ? "text-zinc-600" : typed === c ? "text-emerald-400" : "text-red-400 underline decoration-red-500/60";
    return <span key={i} className={color}>{c}</span>;
  });

  const accuracy = input.length > 0 ? Math.round((input.split("").filter((c, i) => c === sentence[i]).length / input.length) * 100) : 100;
  const progress = Math.min(100, (input.length / sentence.length) * 100);

  if (done) return (
    <GameComplete
      icon={<Keyboard size={24} />}
      title="Speed Complete!"
      score={wpm}
      total={100}
      xpEarned={wpm >= 60 ? 80 : wpm >= 40 ? 50 : 30}
      onRestart={() => { setInput(""); setStart(null); setDone(false); setSentence(getRandomTypingSentence()); setSentenceCount(c => c + 1); setElapsed(0); }}
      onExit={onExit}
    />
  );

  return (
    <div>
      <GameHeader title="Syntax Speed Race" icon={<Keyboard size={18} />} onExit={onExit} />
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
          <span>Sentence #{sentenceCount}</span>
          <div className="flex gap-4">
            <span>Accuracy: <strong className={accuracy >= 95 ? "text-emerald-400" : accuracy >= 80 ? "text-amber-400" : "text-red-400"}>{accuracy}%</strong></span>
            <span>{start ? `${elapsed}s elapsed` : "Start typing to begin"}</span>
          </div>
        </div>

        <div className="font-mono text-base leading-relaxed bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-5 tracking-wide select-none">
          {chars}
        </div>

        <ProgressBar value={progress} />

        <Input
          ref={inputRef}
          autoFocus
          value={input}
          onChange={e => handleType(e.target.value)}
          placeholder="Start typing the sentence above exactly..."
          className="font-mono"
        />
        <p className="text-xs text-zinc-600">{input.length}/{sentence.length} characters · Type the highlighted text exactly</p>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────
//  CODE QUIZ GAME
// ──────────────────────────────────────────────────
function QuizGame({ onExit, onXP }: { onExit: () => void; onXP: (xp: number, r: string) => void }) {
  const [questions] = useState(() => Array.from({ length: 10 }, getRandomQuizQuestion));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const q = questions[idx];
  const pick = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.ans) setScore(s => s + 1);
    setTimeout(() => {
      if (idx + 1 < questions.length) { setIdx(i2 => i2 + 1); setSelected(null); }
      else { setDone(true); onXP(Math.round((score + (i === q.ans ? 1 : 0)) * 15), `Code Quiz: ${score + (i === q.ans ? 1 : 0)}/10`); }
    }, 1000);
  };

  if (done) return <GameComplete icon={<Brain size={24} />} title="Quiz Complete!" score={score} total={questions.length} xpEarned={score * 15} onRestart={() => { setIdx(0); setScore(0); setSelected(null); setDone(false); }} onExit={onExit} />;

  return (
    <div>
      <GameHeader title="CS Fundamentals Quiz" icon={<Brain size={18} />} score={score} total={questions.length} onExit={onExit} />
      <div className="flex gap-1.5 mb-6">
        {questions.map((_, i) => (
          <div key={i} className={`flex-1 h-1.5 rounded-full transition-colors ${i < idx ? "bg-emerald-500/70" : i === idx ? "bg-[#6D001A]" : "bg-zinc-800"}`} />
        ))}
      </div>
      <p className="text-xs text-zinc-500 mb-3">Question {idx + 1} of {questions.length}</p>
      <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-5 mb-5 text-sm text-zinc-200 font-medium whitespace-pre-wrap leading-relaxed">
        {q.q}
      </div>
      <div className="flex flex-col gap-2.5">
        {q.options.map((o, i) => (
          <AnswerButton
            key={i}
            label={String.fromCharCode(65 + i)}
            onClick={() => pick(i)}
            state={selected === null ? "default" : i === q.ans ? "correct" : selected === i ? "wrong" : "neutral"}
          >
            {o}
          </AnswerButton>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────
//  BUG HUNT GAME
// ──────────────────────────────────────────────────
function BugHuntGame({ onExit, onXP }: { onExit: () => void; onXP: (xp: number, r: string) => void }) {
  const [questions] = useState(() => Array.from({ length: 5 }, getRandomBugQuestion));
  const [idx, setIdx] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = questions[idx];

  const submit = () => {
    if (answer.length < 10) return;
    setRevealed(true);
    const hasKeyword = q.bug.toLowerCase().split(" ").filter(w => w.length > 4).some(w => answer.toLowerCase().includes(w));
    if (hasKeyword) { setScore(s => s + 1); onXP(35, "Bug found!"); }
  };

  const next = () => {
    if (idx + 1 < questions.length) { setIdx(idx + 1); setRevealed(false); setAnswer(""); setShowHint(false); }
    else { setDone(true); onXP(score * 35, `Bug Hunt: ${score}/${questions.length}`); }
  };

  if (done) return <GameComplete icon={<Bug size={24} />} title="Bug Hunt Complete!" score={score} total={questions.length} xpEarned={score * 35} onRestart={() => { setIdx(0); setRevealed(false); setAnswer(""); setShowHint(false); setScore(0); setDone(false); }} onExit={onExit} />;

  return (
    <div>
      <GameHeader title="Production Bug Hunt" icon={<Bug size={18} />} score={score} total={questions.length} onExit={onExit} />
      <p className="text-xs text-zinc-500 mb-4">Bug {idx + 1} of {questions.length} · Find the issue in the code below</p>

      <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-5 font-mono text-sm text-zinc-300 overflow-x-auto whitespace-pre-wrap mb-5 leading-relaxed">
        {q.code}
      </div>

      {!revealed ? (
        <div className="flex flex-col gap-3">
          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Describe the bug you found in the code above..."
            rows={3}
            className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-[#6D001A] text-zinc-200 text-sm rounded-xl p-4 outline-none transition-colors resize-none"
          />
          <div className="flex gap-3">
            <button
              onClick={submit}
              disabled={answer.length < 10}
              className="px-4 py-2.5 bg-[#6D001A] hover:bg-[#8B0025] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Submit Answer
            </button>
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-sm font-semibold border border-zinc-800 rounded-xl transition-colors"
            >
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
          </div>
          <AnimatePresence>
            {showHint && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-3.5 bg-amber-950/20 border border-amber-900/40 rounded-xl text-xs text-amber-400">
                💡 <strong>Hint:</strong> {q.hint}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl">
            <div className="font-semibold text-emerald-400 text-sm mb-1.5 flex items-center gap-2">
              <CheckCircle size={16} /> The Bug Was:
            </div>
            <div className="text-xs text-zinc-300 leading-relaxed">{q.bug}</div>
          </div>
          <button onClick={next} className="w-full py-3 bg-[#6D001A] hover:bg-[#8B0025] text-white font-semibold rounded-xl transition-colors">
            {idx + 1 < questions.length ? "Next Bug →" : "See Results"}
          </button>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────
//  FLASHCARD MEMORY GAME
// ──────────────────────────────────────────────────
function FlashcardGame({ onExit, onXP }: { onExit: () => void; onXP: (xp: number, r: string) => void }) {
  const [deck] = useState(() => Array.from({ length: 10 }, getRandomFlashcard));
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [done, setDone] = useState(false);

  const mark = (knew: boolean) => {
    const finalKnown = known + (knew ? 1 : 0);
    if (knew) { setKnown(k => k + 1); onXP(10, "Flashcard studied!"); }
    if (idx + 1 < deck.length) { setIdx(idx + 1); setFlipped(false); }
    else { setDone(true); onXP(finalKnown * 5, `Flashcards: ${finalKnown}/${deck.length}`); }
  };

  if (done) return <GameComplete icon={<BookOpen size={24} />} title="Deck Complete!" score={known} total={deck.length} xpEarned={known * 10} onRestart={() => { setIdx(0); setFlipped(false); setKnown(0); setDone(false); }} onExit={onExit} />;

  const card = deck[idx];
  return (
    <div>
      <GameHeader title="System Flashcards" icon={<BookOpen size={18} />} score={known} total={deck.length} onExit={onExit} />
      <p className="text-xs text-zinc-500 mb-5">{idx + 1}/{deck.length} · {known} mastered · Click card to reveal answer</p>
      <div style={{ perspective: 1000 }} onClick={() => setFlipped(!flipped)} className="cursor-pointer mb-6">
        <div className="w-full h-56 relative transition-transform duration-500" style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0)" }}>
          <div className="absolute inset-0 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center" style={{ backfaceVisibility: "hidden" }}>
            <div className="text-[10px] text-[#6D001A] font-bold tracking-wider mb-4 uppercase">Question · Tap to flip</div>
            <div className="text-base font-semibold text-zinc-100 leading-relaxed">{card.front}</div>
          </div>
          <div className="absolute inset-0 bg-zinc-950 border border-[#6D001A]/30 rounded-2xl flex flex-col items-center justify-center p-8 text-center" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
            <div className="text-[10px] text-emerald-400 font-bold tracking-wider mb-4 uppercase">Answer</div>
            <div className="text-sm text-zinc-300 leading-relaxed font-mono">{card.back}</div>
          </div>
        </div>
      </div>
      {flipped && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
          <button onClick={() => mark(false)} className="flex-1 py-3 rounded-xl border border-red-900/30 bg-red-950/10 text-red-400 font-semibold text-sm hover:bg-red-950/20 transition-colors">
            Needs Review
          </button>
          <button onClick={() => mark(true)} className="flex-1 py-3 rounded-xl border border-emerald-900/30 bg-emerald-950/10 text-emerald-400 font-semibold text-sm hover:bg-emerald-950/20 transition-colors">
            Mastered ✓
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────
//  PATTERN MATCH GAME
// ──────────────────────────────────────────────────
function PatternMatchGame({ onExit, onXP }: { onExit: () => void; onXP: (xp: number, r: string) => void }) {
  const [questions] = useState(() => Array.from({ length: 10 }, getRandomPattern));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const p = questions[idx];
  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (p.options[i] === p.pattern) setScore(s => s + 1);
    setTimeout(() => { setPicked(null); if (idx + 1 >= questions.length) { setDone(true); onXP(score * 20, `Pattern Match: ${score}/${questions.length}`); } else setIdx(idx + 1); }, 1100);
  };
  if (done) return <GameComplete icon={<Target size={24} />} title="Pattern Match!" score={score} total={questions.length} xpEarned={score * 20} onRestart={() => { setIdx(0); setScore(0); setPicked(null); setDone(false); }} onExit={onExit} />;
  return (
    <div>
      <GameHeader title="Pattern Matcher" icon={<Target size={18} />} score={score} total={questions.length} onExit={onExit} />
      <p className="text-xs text-zinc-500 mb-4">Q {idx + 1}/{questions.length} · Identify the JavaScript pattern</p>
      <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-5 font-mono text-base text-emerald-300 mb-5">{p.code}</div>
      <div className="grid grid-cols-2 gap-3">
        {p.options.map((o, i) => (
          <AnswerButton key={i} onClick={() => pick(i)} state={picked === null ? "default" : o === p.pattern ? "correct" : picked === i ? "wrong" : "neutral"}>
            {o}
          </AnswerButton>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────
//  ALGO RACE GAME
// ──────────────────────────────────────────────────
function AlgoRaceGame({ onExit, onXP }: { onExit: () => void; onXP: (xp: number, r: string) => void }) {
  const [questions] = useState(() => Array.from({ length: 10 }, getRandomAlgoQuestion));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const q = questions[idx];
  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (q.options[i] === q.answer) setScore(s => s + 1);
    setTimeout(() => { setPicked(null); if (idx + 1 >= questions.length) { setDone(true); onXP(score * 20, `Algo Race: ${score}/${questions.length}`); } else setIdx(idx + 1); }, 900);
  };
  if (done) return <GameComplete icon={<Zap size={24} />} title="Algorithm Race!" score={score} total={questions.length} xpEarned={score * 20} onRestart={() => { setIdx(0); setScore(0); setPicked(null); setDone(false); }} onExit={onExit} />;
  return (
    <div>
      <GameHeader title="Algorithm Speed Race" icon={<Zap size={18} />} score={score} total={questions.length} onExit={onExit} />
      <p className="text-xs text-zinc-500 mb-4">Q {idx + 1}/{questions.length} · Average time complexity</p>
      <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-6 text-center mb-6">
        <p className="text-xs text-zinc-500 mb-3 uppercase tracking-wider">What is the average time complexity of:</p>
        <p className="text-xl font-semibold text-zinc-100">{q.algo}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {q.options.map((o, i) => (
          <AnswerButton key={i} onClick={() => pick(i)} state={picked === null ? "default" : o === q.answer ? "correct" : picked === i ? "wrong" : "neutral"}>
            {o}
          </AnswerButton>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────
//  SQL CHALLENGE GAME
// ──────────────────────────────────────────────────
function SQLChallengeGame({ onExit, onXP }: { onExit: () => void; onXP: (xp: number, r: string) => void }) {
  const [questions] = useState(() => Array.from({ length: 5 }, getRandomSQLQuestion));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const q = questions[idx];
  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (q.options[i] === q.ans) setScore(s => s + 1);
    setTimeout(() => { setPicked(null); if (idx + 1 >= questions.length) { setDone(true); onXP(score * 25, `SQL Challenge: ${score}/${questions.length}`); } else setIdx(idx + 1); }, 1100);
  };
  if (done) return <GameComplete icon={<Database size={24} />} title="SQL Master!" score={score} total={questions.length} xpEarned={score * 25} onRestart={() => { setIdx(0); setScore(0); setPicked(null); setDone(false); }} onExit={onExit} />;
  return (
    <div>
      <GameHeader title="SQL Query Master" icon={<Database size={18} />} score={score} total={questions.length} onExit={onExit} />
      <p className="text-xs text-zinc-500 mb-4">Q {idx + 1}/{questions.length} · Select the correct SQL query</p>
      <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-5 text-sm font-medium text-zinc-200 mb-5">{q.q}</div>
      <div className="flex flex-col gap-2.5">
        {q.options.map((o, i) => (
          <AnswerButton key={i} onClick={() => pick(i)} state={picked === null ? "default" : o === q.ans ? "correct" : picked === i ? "wrong" : "neutral"}>
            {o}
          </AnswerButton>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────
//  REGEX MASTER GAME
// ──────────────────────────────────────────────────
function RegexMasterGame({ onExit, onXP }: { onExit: () => void; onXP: (xp: number, r: string) => void }) {
  const [questions] = useState(() => Array.from({ length: 5 }, getRandomRegexQuestion));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const q = questions[idx];
  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (q.options[i] === q.ans) setScore(s => s + 1);
    setTimeout(() => { setPicked(null); if (idx + 1 >= questions.length) { setDone(true); onXP(score * 20, `Regex Master: ${score}/${questions.length}`); } else setIdx(idx + 1); }, 900);
  };
  if (done) return <GameComplete icon={<Type size={24} />} title="Regex Master!" score={score} total={questions.length} xpEarned={score * 20} onRestart={() => { setIdx(0); setScore(0); setPicked(null); setDone(false); }} onExit={onExit} />;
  return (
    <div>
      <GameHeader title="Regex Master" icon={<Type size={18} />} score={score} total={questions.length} onExit={onExit} />
      <p className="text-xs text-zinc-500 mb-4">Q {idx + 1}/{questions.length} · Match the regex pattern</p>
      <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-5 text-sm font-medium text-zinc-200 mb-5">{q.q}</div>
      <div className="flex flex-col gap-2.5">
        {q.options.map((o, i) => (
          <AnswerButton key={i} onClick={() => pick(i)} state={picked === null ? "default" : o === q.ans ? "correct" : picked === i ? "wrong" : "neutral"}>
            {o}
          </AnswerButton>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────
//  STACK BUILDER GAME
// ──────────────────────────────────────────────────
function StackBuilderGame({ onExit, onXP }: { onExit: () => void; onXP: (xp: number, r: string) => void }) {
  const [questions] = useState(() => Array.from({ length: 5 }, getRandomStackTask));
  const [idx, setIdx] = useState(0);
  const [ans, setAns] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const task = questions[idx];
  const submit = () => {
    const correct = ans.trim().toLowerCase() === task.expected.toLowerCase();
    if (correct) setScore(s => s + 1);
    setFeedback(correct ? `✅ Correct! ${task.explain}` : `❌ Wrong. Answer: ${task.expected}. ${task.explain}`);
    setTimeout(() => {
      setFeedback(""); setAns("");
      if (idx + 1 >= questions.length) { setDone(true); onXP(score * 25, `Stack Builder: ${score}/${questions.length}`); }
      else setIdx(idx + 1);
    }, 2500);
  };
  if (done) return <GameComplete icon={<Book size={24} />} title="Stack Builder!" score={score} total={questions.length} xpEarned={score * 25} onRestart={() => { setIdx(0); setAns(""); setFeedback(""); setScore(0); setDone(false); }} onExit={onExit} />;
  return (
    <div>
      <GameHeader title="Stack Builder" icon={<Book size={18} />} score={score} total={questions.length} onExit={onExit} />
      <p className="text-xs text-zinc-500 mb-4">Q {idx + 1}/{questions.length} · Execute the stack operations and give the Peek result</p>
      <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-5 mb-5">
        <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wider">Operations:</p>
        <p className="font-mono text-sm font-semibold text-[#Fca5a5]">{task.instr}</p>
      </div>
      <AnimatePresence>
        {feedback && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`p-4 border rounded-xl mb-4 text-xs leading-relaxed ${feedback.startsWith("✅") ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/40" : "bg-red-950/20 text-red-400 border-red-900/40"}`}>
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex gap-3">
        <Input value={ans} onChange={e => setAns(e.target.value)} placeholder="Type the top of stack after Peek..." onKeyDown={e => e.key === "Enter" && submit()} className="flex-1" />
        <button onClick={submit} disabled={!ans.trim()} className="px-5 py-2.5 bg-[#6D001A] hover:bg-[#8B0025] disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap">
          Submit
        </button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────
//  CODE TRANSLATOR GAME
// ──────────────────────────────────────────────────
function CodeTranslatorGame({ onExit, onXP }: { onExit: () => void; onXP: (xp: number, r: string) => void }) {
  const [questions] = useState(() => Array.from({ length: 5 }, getRandomTranslatorQuestion));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const q = questions[idx];
  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (q.options[i] === q.ans) setScore(s => s + 1);
    setTimeout(() => { setPicked(null); if (idx + 1 >= questions.length) { setDone(true); onXP(score * 20, `Translator: ${score}/${questions.length}`); } else setIdx(idx + 1); }, 900);
  };
  if (done) return <GameComplete icon={<Globe size={24} />} title="Code Translator!" score={score} total={questions.length} xpEarned={score * 20} onRestart={() => { setIdx(0); setScore(0); setPicked(null); setDone(false); }} onExit={onExit} />;
  return (
    <div>
      <GameHeader title="Code Translator" icon={<Globe size={18} />} score={score} total={questions.length} onExit={onExit} />
      <p className="text-xs text-zinc-500 mb-4">Q {idx + 1}/{questions.length} · Translate the code</p>
      <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-5 mb-5 text-center">
        <p className="text-xs text-zinc-500 mb-3">Translate from <strong className="text-rose-400">{q.from}</strong> → <strong className="text-emerald-400">{q.to}</strong></p>
        <div className="font-mono text-sm font-semibold text-rose-400 bg-rose-950/10 border border-rose-900/20 rounded-lg p-3 inline-block">{q.code}</div>
      </div>
      <div className="flex flex-col gap-2.5">
        {q.options.map((o, i) => (
          <AnswerButton key={i} onClick={() => pick(i)} state={picked === null ? "default" : o === q.ans ? "correct" : picked === i ? "wrong" : "neutral"}>
            {o}
          </AnswerButton>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────
//  GAME DEFINITIONS
// ──────────────────────────────────────────────────
type GameId = "typing" | "quiz" | "bughunt" | "flashcard" | "pattern" | "algorace" | "sql" | "regex" | "stack" | "translator" | null;

const GAMES = [
  { id: "typing" as const, icon: Keyboard, badge: "Speed", badgeColor: "text-blue-400 bg-blue-950/20 border-blue-900/30", title: "Syntax Speed Race", desc: "Type production syntax at speed. Every word counts.", xpRange: "30–80 XP", difficulty: "Beginner" },
  { id: "quiz" as const, icon: Brain, badge: "Logic", badgeColor: "text-purple-400 bg-purple-950/20 border-purple-900/30", title: "CS Fundamentals Quiz", desc: "Validate time complexity, loop outputs, and core CS knowledge.", xpRange: "50–150 XP", difficulty: "Intermediate" },
  { id: "bughunt" as const, icon: Bug, badge: "QA", badgeColor: "text-red-400 bg-red-950/20 border-red-900/30", title: "Production Bug Hunt", desc: "Find stale closures, off-by-one errors, and missing awaits.", xpRange: "50–175 XP", difficulty: "Advanced" },
  { id: "flashcard" as const, icon: BookOpen, badge: "Memory", badgeColor: "text-amber-400 bg-amber-950/20 border-amber-900/30", title: "System Flashcards", desc: "Revise SOLID principles, Git commands, and data structures.", xpRange: "10–100 XP", difficulty: "Beginner" },
  { id: "pattern" as const, icon: Target, badge: "Syntax", badgeColor: "text-emerald-400 bg-emerald-950/20 border-emerald-900/30", title: "Pattern Matcher", desc: "Identify map, filter, spread, and optional chaining patterns.", xpRange: "20–100 XP", difficulty: "Intermediate" },
  { id: "algorace" as const, icon: Zap, badge: "Algo", badgeColor: "text-yellow-400 bg-yellow-950/20 border-yellow-900/30", title: "Algorithm Race", desc: "Identify time complexities of sorting and search algorithms.", xpRange: "20–100 XP", difficulty: "Intermediate" },
  { id: "sql" as const, icon: Database, badge: "Database", badgeColor: "text-cyan-400 bg-cyan-950/20 border-cyan-900/30", title: "SQL Query Master", desc: "Select correct SQL for COUNT, DELETE, SELECT, and ORDER.", xpRange: "25–125 XP", difficulty: "Intermediate" },
  { id: "regex" as const, icon: Type, badge: "Parsing", badgeColor: "text-pink-400 bg-pink-950/20 border-pink-900/30", title: "Regex Master", desc: "Match hex colors, emails, phone numbers to correct patterns.", xpRange: "20–100 XP", difficulty: "Advanced" },
  { id: "stack" as const, icon: Book, badge: "Structure", badgeColor: "text-orange-400 bg-orange-950/20 border-orange-900/30", title: "Stack Builder", desc: "Trace Push/Pop operations and determine the top of stack.", xpRange: "25–125 XP", difficulty: "Beginner" },
  { id: "translator" as const, icon: Globe, badge: "Translation", badgeColor: "text-teal-400 bg-teal-950/20 border-teal-900/30", title: "Code Translator", desc: "Convert loops and prints between Python and JavaScript.", xpRange: "20–100 XP", difficulty: "Intermediate" },
];

const difficultyColor: Record<string, string> = {
  Beginner: "text-emerald-400",
  Intermediate: "text-amber-400",
  Advanced: "text-red-400",
};

// ──────────────────────────────────────────────────
//  INNER PAGE (uses useSearchParams — needs Suspense)
// ──────────────────────────────────────────────────
function GamificationInner() {
  const { profile, addXP } = useAppStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameParam = searchParams.get("game") as GameId;
  const [activeGame, setActiveGame] = useState<GameId>(null);
  const [gameHistory, setGameHistory] = useState<any[]>([]);

  // ✅ FIX: All localStorage reads in useEffect
  const [challengeDoneStates, setChallengeDoneStates] = useState({
    interview: false,
    lesson: false,
    typing: false,
    quiz: false,
    bughunt: false,
  });

  useEffect(() => {
    setChallengeDoneStates({
      interview: !!localStorage.getItem("ciq-interview-done"),
      lesson: !!localStorage.getItem("ciq-lesson-done"),
      typing: !!localStorage.getItem("ciq-typing-done"),
      quiz: !!localStorage.getItem("ciq-quiz-done"),
      bughunt: !!localStorage.getItem("ciq-bughunt-done"),
    });
    const stored = localStorage.getItem("ciq-game-history");
    if (stored) { try { setGameHistory(JSON.parse(stored)); } catch { setGameHistory([]); } }
  }, []);

  // Refresh challenge states when returning from a game
  useEffect(() => {
    if (!activeGame) {
      setChallengeDoneStates({
        interview: !!localStorage.getItem("ciq-interview-done"),
        lesson: !!localStorage.getItem("ciq-lesson-done"),
        typing: !!localStorage.getItem("ciq-typing-done"),
        quiz: !!localStorage.getItem("ciq-quiz-done"),
        bughunt: !!localStorage.getItem("ciq-bughunt-done"),
      });
    }
  }, [activeGame]);

  useEffect(() => {
    if (gameParam) setActiveGame(gameParam);
    else setActiveGame(null);
  }, [gameParam]);

  const handleExit = () => {
    router.push("/gamification");
  };

  const recordGameHistory = (gameName: string, scoreStr: string, xpGained: number) => {
    const stored = localStorage.getItem("ciq-game-history");
    const history = stored ? JSON.parse(stored) : [];
    const entry = { id: Math.random().toString(36).substr(2, 9), gameName, score: scoreStr, xp: xpGained, timestamp: new Date().toISOString() };
    const updated = [entry, ...history].slice(0, 50);
    localStorage.setItem("ciq-game-history", JSON.stringify(updated));
    setGameHistory(updated);
    window.dispatchEvent(new Event("ciq-game-played"));
  };

  const handleXPAdd = (xp: number, label: string) => {
    addXP(xp, label);
    if (label.toLowerCase().includes("typing")) localStorage.setItem("ciq-typing-done", "true");
    if (label.toLowerCase().includes("bug")) localStorage.setItem("ciq-bughunt-done", "true");
    if (label.toLowerCase().includes("quiz") || label.toLowerCase().includes("fundamentals")) localStorage.setItem("ciq-quiz-done", "true");

    const gameNameMap: [string, string][] = [
      ["Typing Speed:", "Syntax Speed Race"], ["Code Quiz:", "CS Fundamentals Quiz"],
      ["Bug Hunt:", "Production Bug Hunt"], ["Flashcards:", "System Flashcards"],
      ["Pattern Match:", "Pattern Matcher"], ["Algo Race:", "Algorithm Race"],
      ["SQL Challenge:", "SQL Query Master"], ["Regex Master:", "Regex Master"],
      ["Stack Builder:", "Stack Builder"], ["Translator:", "Code Translator"],
    ];
    for (const [prefix, name] of gameNameMap) {
      if (label.startsWith(prefix)) { recordGameHistory(name, label.replace(prefix, "").trim(), xp); break; }
    }
  };

  const userXP = profile?.xp || 0;
  const level = profile?.level || "Explorer";
  const nextLevelXP = userXP < 500 ? 500 : userXP < 1500 ? 1500 : userXP < 3000 ? 3000 : 6000;
  const prevLevelXP = userXP < 500 ? 0 : userXP < 1500 ? 500 : userXP < 3000 ? 1500 : 3000;
  const levelProgress = Math.round(((userXP - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100);

  const challenges = [
    { label: "Upload Resume", desc: "Activate AI scan pipeline", done: !!profile?.skills?.length, xp: 100, icon: FileText },
    { label: "Complete Mock Interview", desc: "Finish a full session", done: challengeDoneStates.interview, xp: 150, icon: Mic },
    { label: "Learn 4 Lessons", desc: "Finish 4 learning modules", done: challengeDoneStates.lesson, xp: 80, icon: BookOpen },
    { label: "Syntax Speed Race", desc: "Exceed 40 WPM", done: challengeDoneStates.typing, xp: 80, icon: Keyboard },
    { label: "CS Assessment", desc: "Score 6+ on Fundamentals", done: challengeDoneStates.quiz, xp: 120, icon: Brain },
    { label: "Find 3 Critical Bugs", desc: "Clear the Bug Hunt", done: challengeDoneStates.bughunt, xp: 100, icon: Bug },
    { label: "Reach Engineer Level I", desc: "Accumulate 500+ XP", done: userXP >= 500, xp: 0, icon: Star },
    { label: "Reach Senior Architect", desc: "Accumulate 1500+ XP", done: userXP >= 1500, xp: 0, icon: Medal },
  ];

  const badges = [
    { id: "initiate", name: "System Initiate", desc: "Scanned a professional resume", unlocked: !!profile?.skills?.length, color: "#6D001A", icon: FileText },
    { id: "novice", name: "CS Novice I", desc: "Gained 150+ total XP", unlocked: userXP >= 150, color: "#a1a1aa", icon: Star },
    { id: "expert", name: "CS Specialist II", desc: "Gained 500+ total XP", unlocked: userXP >= 500, color: "#eab308", icon: Medal },
    { id: "champion", name: "Grand Architect", desc: "Reached 1500+ XP", unlocked: userXP >= 1500, color: "#38bdf8", icon: Trophy },
    { id: "speed", name: "Speed Demon", desc: "Completed Typing Speed game", unlocked: challengeDoneStates.typing, color: "#ec4899", icon: Zap },
    { id: "bug_hunter", name: "Bug Slayer", desc: "Solved a Bug Hunt challenge", unlocked: challengeDoneStates.bughunt, color: "#22c55e", icon: Bug },
  ];

  const gamesPlayed = new Set(gameHistory.map(r => r.gameName)).size;
  const totalXPFromGames = gameHistory.reduce((sum, r) => sum + r.xp, 0);

  const gameIconMap: Record<string, React.ElementType> = {
    "Syntax Speed Race": Keyboard, "CS Fundamentals Quiz": Brain, "Production Bug Hunt": Bug,
    "System Flashcards": BookOpen, "Pattern Matcher": Target, "Algorithm Race": Zap,
    "SQL Query Master": Database, "Regex Master": Type, "Stack Builder": Book, "Code Translator": Globe,
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 pb-16 pt-4 space-y-8 animate-fade font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 border-b border-white/[0.05] pb-6 mt-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#C0506A] font-display">Skill Arena</span>
            <Badge label="Active Training" variant="purple" size="sm" dot={true} />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-none font-display">
            Advanced Simulations
          </h1>
          <p className="text-xs text-zinc-550 mt-2.5 leading-relaxed font-semibold">
            Technical assessments to sharpen your engineering edge.
          </p>
        </div>

        <div className="flex items-stretch gap-4">
          {/* XP Card */}
          <div className="bg-black/45 border border-white/[0.05] rounded-xl px-5 py-4 text-center min-w-[110px]">
            <p className="text-[9px] text-zinc-550 uppercase tracking-widest font-bold font-display mb-1">Total XP</p>
            <p className="text-2xl font-bold font-mono text-white">{userXP.toLocaleString()}</p>
            <p className="text-[9px] text-[#C0506A] font-bold uppercase tracking-widest font-display mt-1">{level}</p>
          </div>
          {/* Level Progress */}
          <div className="bg-black/45 border border-white/[0.05] rounded-xl px-5 py-4 min-w-[150px] flex flex-col justify-between">
            <div>
              <p className="text-[9px] text-zinc-550 uppercase tracking-widest font-bold font-display mb-1">Level Progress</p>
              <div className="flex justify-between text-[10px] font-bold font-mono text-zinc-400 mb-2">
                <span>{level}</span>
                <span>{levelProgress}%</span>
              </div>
              <div className="w-full bg-white/[0.04] h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#6D001A] to-[#C0506A] h-full" style={{ width: `${levelProgress}%` }} />
              </div>
            </div>
            <p className="text-[9px] text-zinc-650 font-bold font-mono mt-2">{nextLevelXP - userXP} XP TO NEXT LEVEL</p>
          </div>
        </div>
      </div>

      {/* ── ACTIVE GAME ── */}
      {activeGame ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-black/45 border border-white/[0.05] rounded-2xl p-6 md:p-8">
            {activeGame === "typing" && <TypingGame onExit={handleExit} onXP={handleXPAdd} />}
            {activeGame === "quiz" && <QuizGame onExit={handleExit} onXP={handleXPAdd} />}
            {activeGame === "bughunt" && <BugHuntGame onExit={handleExit} onXP={handleXPAdd} />}
            {activeGame === "flashcard" && <FlashcardGame onExit={handleExit} onXP={handleXPAdd} />}
            {activeGame === "pattern" && <PatternMatchGame onExit={handleExit} onXP={handleXPAdd} />}
            {activeGame === "algorace" && <AlgoRaceGame onExit={handleExit} onXP={handleXPAdd} />}
            {activeGame === "sql" && <SQLChallengeGame onExit={handleExit} onXP={handleXPAdd} />}
            {activeGame === "regex" && <RegexMasterGame onExit={handleExit} onXP={handleXPAdd} />}
            {activeGame === "stack" && <StackBuilderGame onExit={handleExit} onXP={handleXPAdd} />}
            {activeGame === "translator" && <CodeTranslatorGame onExit={handleExit} onXP={handleXPAdd} />}
          </div>
        </motion.div>
      ) : (
        <>
          {/* ── GAME GRID ── */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6 border-b border-white/[0.05] pb-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-widest font-display flex items-center gap-2">
                <Gamepad2 size={16} className="text-[#C0506A]" />
                Technical Assessments
                <span className="text-[10px] text-zinc-550 font-bold font-mono normal-case">({GAMES.length} simulations available)</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {GAMES.map((g, idx) => {
                const Icon = g.icon;
                const played = gameHistory.some(h => h.gameName === g.title);
                return (
                  <motion.div
                    key={g.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    onClick={() => setActiveGame(g.id)}
                    className="group relative bg-black/45 hover:bg-black/60 border border-white/[0.05] hover:border-[#6D001A]/30 rounded-2xl p-5 cursor-pointer transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Played indicator */}
                      {played && (
                        <div className="absolute top-3.5 right-3.5">
                          <CheckCircle size={14} className="text-emerald-400" />
                        </div>
                      )}

                      {/* Icon */}
                      <div className="w-10 h-10 rounded-xl bg-[#6D001A]/10 border border-[#6D001A]/20 flex items-center justify-center text-[#C0506A] mb-4 group-hover:bg-[#6D001A]/25 transition-colors">
                        <Icon size={18} />
                      </div>

                      {/* Badges */}
                      <div className="flex gap-2 mb-3.5 flex-wrap">
                        <Badge label={g.badge} variant="purple" size="sm" />
                        <Badge label={g.difficulty} variant={g.difficulty === "Advanced" ? "red" : "gray"} size="sm" />
                      </div>

                      <h3 className="font-bold text-xs text-white mb-2 tracking-wider font-display uppercase">{g.title}</h3>
                      <p className="text-[11px] text-zinc-450 leading-relaxed mb-5 font-semibold">{g.desc}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.04] mt-auto">
                      <span className="text-[9px] text-zinc-650 font-bold uppercase tracking-widest font-mono">{g.xpRange}</span>
                      <span className="flex items-center gap-1.5 text-[10px] text-[#C0506A] font-bold uppercase tracking-widest font-display group-hover:gap-2.5 transition-all">
                        Play <ChevronRight size={12} />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ── STATS + HISTORY ROW ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 lg:col-span-1">
              {[
                { label: "Games Played", val: gameHistory.length, icon: Play, color: "#cbd5e1" },
                { label: "Unique Simulations", val: gamesPlayed, icon: Gamepad2, color: "#C0506A" },
                { label: "XP from Games", val: `${totalXPFromGames}`, icon: Zap, color: "#6D001A" },
                { label: "Completed", val: `${challenges.filter(c => c.done).length}/${challenges.length}`, icon: CheckCircle, color: "#cbd5e1" },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <KPICard
                    key={i}
                    title={stat.label}
                    value={stat.val}
                    icon={<Icon size={16} />}
                    sparklineColor={stat.color}
                    sparklineData={i % 2 === 0 ? [10, 20, 15, 30, 25, 40] : [30, 20, 28, 22, 35, 30]}
                  />
                );
              })}
            </div>

            {/* Recent Performance */}
            <GlassCard className="lg:col-span-2 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5 border-b border-white/[0.05] pb-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest font-display flex items-center gap-2">
                    <Activity size={15} className="text-[#C0506A]" /> Recent Performance
                  </h3>
                  {gameHistory.length > 0 && (
                    <button
                      onClick={() => {
                        localStorage.removeItem("ciq-game-history");
                        setGameHistory([]);
                      }}
                      className="text-[9px] text-[#C0506A] hover:underline font-bold uppercase tracking-widest font-display outline-none"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {gameHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center text-zinc-600">
                    <Gamepad2 size={32} className="mb-3 opacity-40 text-zinc-500" />
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-550 font-display">No simulations run yet</p>
                    <p className="text-[9px] text-zinc-650 mt-1 uppercase font-bold tracking-widest font-mono">Start any game above to track progress</p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 font-sans">
                    {gameHistory.slice(0, 8).map((run) => {
                      const IconComp = gameIconMap[run.gameName] || Gamepad2;
                      return (
                        <div key={run.id} className="flex items-center justify-between py-2.5 px-3.5 rounded-xl border border-white/[0.05] bg-black/45 text-xs">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-[#6D001A]/10 border border-[#6D001A]/20 flex items-center justify-center text-[#C0506A]">
                              <IconComp size={13} />
                            </div>
                            <div>
                              <p className="font-bold text-white font-display uppercase tracking-wider text-[11px]">{run.gameName}</p>
                              <p className="text-[9px] text-zinc-550 font-bold uppercase tracking-widest font-mono mt-0.5">{new Date(run.timestamp).toLocaleDateString()} · {new Date(run.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold font-mono text-white text-sm">{run.score}</p>
                            {run.xp > 0 && <p className="text-[9px] text-emerald-450 font-bold font-mono">+{run.xp} XP</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          {/* ── ACHIEVEMENTS + CHECKLIST ROW ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CS Checklist */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-5 border-b border-white/[0.05] pb-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest font-display flex items-center gap-2">
                  <Trophy size={16} className="text-[#C0506A]" /> CS Checklist
                </h3>
                <span className="text-[9px] bg-white/[0.03] border border-white/[0.08] text-zinc-400 px-2.5 py-1 rounded-full font-bold uppercase tracking-widest font-mono">
                  {challenges.filter(c => c.done).length}/{challenges.length} done
                </span>
              </div>
              <div className="space-y-2.5 font-sans">
                {challenges.map((c, i) => {
                  const Icon = c.icon;
                  return (
                    <div key={i} className={`flex items-center gap-3.5 py-2.5 px-3.5 rounded-xl border transition-colors ${c.done ? "border-emerald-900/30 bg-emerald-950/5 opacity-60" : "border-white/[0.05] bg-black/45"}`}>
                      <div className={`flex-shrink-0 ${c.done ? "text-emerald-400" : "text-zinc-650"}`}>
                        {c.done ? <CheckCircle size={15} /> : <Icon size={15} />}
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className={`text-xs font-bold uppercase tracking-wider font-display truncate ${c.done ? "text-zinc-550 line-through" : "text-zinc-300"}`}>{c.label}</p>
                        <p className="text-[10px] text-zinc-500 font-semibold leading-relaxed mt-0.5">{c.desc}</p>
                      </div>
                      {c.xp > 0 && !c.done && (
                        <span className="text-[10px] text-emerald-450 font-bold flex-shrink-0 font-mono">+{c.xp} XP</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Badges */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-5 border-b border-white/[0.05] pb-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest font-display flex items-center gap-2">
                  <Award size={16} className="text-[#C0506A]" /> Achievements
                </h3>
                <span className="text-[9px] bg-white/[0.03] border border-white/[0.08] text-zinc-400 px-2.5 py-1 rounded-full font-bold uppercase tracking-widest font-mono">
                  {badges.filter(b => b.unlocked).length}/{badges.length} unlocked
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 font-sans">
                {badges.map((b) => {
                  const Icon = b.icon;
                  return (
                    <motion.div
                      key={b.id}
                      whileHover={{ scale: b.unlocked ? 1.02 : 1 }}
                      className={`p-4 rounded-xl border flex flex-col items-center text-center gap-2.5 transition-all ${b.unlocked ? "border-white/[0.08] bg-white/[0.01]" : "border-white/[0.03] bg-black/45 opacity-40"}`}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center border"
                        style={{ background: b.unlocked ? `${b.color}10` : "transparent", borderColor: b.unlocked ? `${b.color}25` : "rgba(255,255,255,0.05)" }}
                      >
                        <Icon size={18} style={{ color: b.unlocked ? b.color : "#52525b" }} />
                      </div>
                      <p className={`text-[10px] font-bold leading-tight uppercase tracking-widest font-display ${b.unlocked ? "text-white" : "text-zinc-600"}`}>{b.name}</p>
                      <p className="text-[9px] text-zinc-550 leading-relaxed font-semibold">{b.desc}</p>
                      {b.unlocked && (
                        <Badge label="Unlocked" variant="green" size="sm" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </GlassCard>
          </div>
        </>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────
//  MAIN EXPORT — Suspense boundary for useSearchParams
// ──────────────────────────────────────────────────
export default function GamificationPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#6D001A] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <GamificationInner />
    </Suspense>
  );
}

