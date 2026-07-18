import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Send,
  Loader2,
  TrendingUp,
  FolderOpen,
  Github,
  Network,
  Cpu,
  Trash2,
  Terminal,
  HelpCircle,
  Copy,
  Check
} from "lucide-react";
import { Project } from "../types";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface GeminiCopilotConsoleProps {
  activeProject?: Project;
}

export default function GeminiCopilotConsole({ activeProject }: GeminiCopilotConsoleProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("arena_copilot_chat");
    return saved
      ? JSON.parse(saved)
      : [
          {
            role: "assistant",
            content: `### Welcome to Gemini AI Co-Pilot Console! (July 2026 Edition) 🚀

I am your advanced developmental and DevOps co-pilot, designed specifically to assist you in designing, testing, and deploying high-quality software on a **£0.00 budget**.

Select any **Trending Skill** below to load prompt templates or toggle **Active Model Context Protocol (MCP)** servers to feed real-time project details into my system instructions. How can I help you build today?`
          }
        ];
  });

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // MCP Servers State
  const [filesystemMcpActive, setFilesystemMcpActive] = useState(true);
  const [githubMcpActive, setGithubMcpActive] = useState(true);
  const [workspaceMcpActive, setWorkspaceMcpActive] = useState(false);

  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem("arena_copilot_chat", JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle MCP data calculation
  const getMcpInstructions = () => {
    let instructions = "You are a DevOps and Coding Co-Pilot for the Arena.ai Continuous Command Suite. ";
    
    if (filesystemMcpActive) {
      instructions += "\n[FileSystem MCP Server: ACTIVE] Current project files: App.tsx, server.ts, types.ts, data.ts, TasksChatSync.tsx, PerformanceDashboard.tsx, GoogleLoginModal.tsx, package.json. Use this real file structure to guide the user in coding or resolving syntax issues.";
    }
    if (githubMcpActive && activeProject) {
      instructions += `\n[GitHub MCP Server: ACTIVE] Active Project: "${activeProject.name}" (Repo: "${activeProject.repoName}"). Active Branches: ${activeProject.branches.map((b) => b.name).join(", ")}. Active Branch: "${activeProject.activeBranch}". Test status of "auth-refresh": failed. Suggest DevOps fixes incorporating these GitHub facts.`;
    }
    if (workspaceMcpActive) {
      instructions += "\n[Workspace Sync MCP Server: ACTIVE] Connected APIs: Google Tasks API (v1), Google Chat API (v1). Enable low-code users to create automated webhooks or calendar items by explaining step-by-step integrations.";
    }

    instructions += "\nKeep explanations conversational, clean, simple, jargon-free, and focused purely on user-facing functional outcomes. Structure solutions with bulleted steps and elegant Markdown code blocks.";

    return instructions;
  };

  const getSimulatedCopilotResponse = (queryText: string): string => {
    const queryLower = queryText.toLowerCase();
    
    if (queryLower.includes("action") || queryLower.includes("ci/cd") || queryLower.includes("pipeline") || queryLower.includes("workflow")) {
      return `⚠️ **Gemini Co-Pilot (Offline Fallback Mode)**\n\n### 🤖 Automated Continuous Deployment Workflow\n\nSince the active Gemini API server is currently unreachable or unconfigured, I've loaded my local **DevOps Blueprint database** to construct this optimized £0.00 continuous delivery workflow:\n\n1. **GitHub Actions Workflow File** at \`.github/workflows/build-and-deploy.yml\`:\n   \`\`\`yaml\n   name: Arena Continuous Command Deployment\n   on:\n     push:\n       branches: [ main ]\n   jobs:\n     deploy:\n       runs-on: ubuntu-latest\n       steps:\n         - name: Checkout Repository\n           uses: actions/checkout@v4\n           \n         - name: Initialize Node Environment\n           uses: actions/setup-node@v4\n           with:\n             node-version: 18\n             cache: 'npm'\n             \n         - name: Install Project Dependencies\n           run: npm ci\n           \n         - name: Execute DevOps Test Suite\n           run: npm test --if-present\n           \n         - name: Build Application Artifacts\n           run: npm run build\n   \`\`\`\n\n2. **£0.00 Cost Guardrails**: \n   - This workflow executes completely within GitHub Actions' **2,000 free runner minutes per month**!\n   - Ideal for deploying the Arena Continuous Command suite on an absolute-zero budget.`;
    }

    if (queryLower.includes("rule") || queryLower.includes("firestore") || queryLower.includes("security")) {
      return `⚠️ **Gemini Co-Pilot (Offline Fallback Mode)**\n\n### 🔒 Hardened Firestore Security Rules\n\nSince the active Gemini API server is currently unreachable or unconfigured, I've loaded my local **Security Framework** to construct this hardened rules blueprint:\n\n\`\`\`javascript\nrules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    // Sync History logs must be fully structured and authenticated\n    match /sync_history/{logId} {\n      allow read: if request.auth != null;\n      allow write: if request.auth != null \n                    && request.resource.data.timestamp is string\n                    && request.resource.data.type in ['tasks', 'chat', 'devops'];\n    }\n  }\n}\n\`\`\`\n\n#### Key Cost & Security Advantages:\n- **Write Verification**: Ensures only authenticated developers can write logs.\n- **Data Validation**: Enforces exact data types, completely preventing database pollution within the Firebase free tier limit of **20,000 free writes per day**!`;
    }

    if (queryLower.includes("budget") || queryLower.includes("saver") || queryLower.includes("cost") || queryLower.includes("free")) {
      return `⚠️ **Gemini Co-Pilot (Offline Fallback Mode)**\n\n### 💰 Ultimate £0.00 Lifetime Budget Configuration\n\nSince the active Gemini API server is currently unreachable or unconfigured, I've synthesized these **Scale-to-Zero DevOps savings**:\n\n1. **Google Cloud Run (Serverless Container Host)**:\n   - Configure **CPU Allocation** to "Only allocated during request processing".\n   - Set **Min Instances** explicitly to \`0\`. If there is no incoming webhook or user traffic, the container sleeps instantly and costs absolutely **£0.00**!\n\n2. **Firebase (Firestore & Authentication)**:\n   - **Firestore**: Stay under **50,000 reads** and **20,000 writes** daily.\n   - **Authentication**: Zero cost up to **50,000 Monthly Active Users** (MAU).\n\n3. **Google Task & Chat API Integrations**:\n   - Both Developer APIs are fully free for standard integration volumes under standard Google Cloud Console project allotments.`;
    }

    if (queryLower.includes("mcp") || queryLower.includes("model context") || queryLower.includes("filesystem") || queryLower.includes("github")) {
      return `⚠️ **Gemini Co-Pilot (Offline Fallback Mode)**\n\n### 🤖 Model Context Protocol (MCP) Synchronization Guide\n\nSince the active Gemini API server is currently unreachable or unconfigured, I've generated this comprehensive checklist for configuring MCP servers locally:\n\n1. **Filesystem MCP**:\n   - Grants the LLM secure access to read and write code to authorized directories.\n   - Run command: \`npx -y @modelcontextprotocol/server-filesystem /path/to/workspace\`\n\n2. **GitHub MCP**:\n   - Grants the LLM capabilities to search repositories, inspect file histories, and manage commits.\n   - Requires setting a secure personal access token \`GITHUB_PERSONAL_ACCESS_TOKEN\` in your environment variables.\n\n3. **Workspace Sync**:\n   - Integrates Google Workspace Google Tasks & Google Chat payloads back into the LLM context automatically during execution loops.`;
    }

    return `⚠️ **Gemini Co-Pilot (Offline Fallback Mode)**\n\n### ⚡ Continuous Command Co-Pilot (Local Fallback Mode)\n\nI am currently running in **Offline Co-Pilot Fallback Mode** because your cloud Gemini API key is either unconfigured or unreachable. \n\nHowever, your DevOps query has been processed:\n> *"Selected Topic: ${queryText}"*\n\n#### Recommended Next Development Action:\n- Set up your \`GEMINI_API_KEY\` in your \`.env\` or Settings panel to unlock dynamic, contextual AI reasoning.\n- Switch to the **Tasks & Chat** tab to test local simulation webhooks.\n- Create a test bug list using our automated list creator to see telemetry synchronization in real-time!`;
  };

  const handleSendMessage = async (e?: React.FormEvent, promptOverride?: string) => {
    if (e) e.preventDefault();
    const queryText = (promptOverride || input).trim();
    if (!queryText || isLoading) return;

    const userMessage: Message = { role: "user", content: queryText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: queryText,
          history: messages,
          systemInstruction: getMcpInstructions(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.text || "I was unable to synthesize a response." }
        ]);
      } else {
        const fallbackRes = getSimulatedCopilotResponse(queryText);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: fallbackRes }
        ]);
      }
    } catch (err: any) {
      console.error("Gemini copilot chat error:", err);
      const fallbackRes = getSimulatedCopilotResponse(queryText);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: fallbackRes }
      ]);
    } finally {
      setIsLoading(false);
      setActiveSkill(null);
    }
  };

  // Trending Skills templates
  const applySkill = (skillId: string, label: string, template: string) => {
    setActiveSkill(skillId);
    setInput(template);
  };

  const handleClearChat = () => {
    if (window.confirm("Do you want to clear your Gemini chat history?")) {
      setMessages([
        {
          role: "assistant",
          content: "Chat history cleared. Select a Trending Skill or ask any question to start building!"
        }
      ]);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="gemini-copilot-panel">
      {/* Sidebar: Skills & MCP configuration */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Model Context Protocol (MCP) Control Center */}
        <div className="glass-panel p-4.5 rounded-2xl space-y-3.5 border-t border-indigo-500/15">
          <div className="flex items-center gap-1.5 border-b border-zinc-900 pb-2">
            <Network className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Active MCP Toggles
            </span>
          </div>

          <p className="text-[10px] text-zinc-500 leading-relaxed font-sans">
            Feed active workspace telemetry directly to Gemini using the open Model Context Protocol.
          </p>

          <div className="space-y-3 pt-1">
            {/* Filesystem MCP toggle */}
            <label className="flex items-center justify-between cursor-pointer p-1.5 rounded-lg bg-zinc-950/40 hover:bg-zinc-950/80 transition border border-zinc-900">
              <div className="flex items-center gap-2">
                <FolderOpen className={`h-3.5 w-3.5 ${filesystemMcpActive ? "text-indigo-400" : "text-zinc-600"}`} />
                <span className="text-xs font-semibold text-zinc-300">Filesystem MCP</span>
              </div>
              <input
                type="checkbox"
                checked={filesystemMcpActive}
                onChange={(e) => setFilesystemMcpActive(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-zinc-800 text-indigo-600 focus:ring-indigo-500 bg-zinc-950"
              />
            </label>

            {/* GitHub Repo MCP toggle */}
            <label className="flex items-center justify-between cursor-pointer p-1.5 rounded-lg bg-zinc-950/40 hover:bg-zinc-950/80 transition border border-zinc-900">
              <div className="flex items-center gap-2">
                <Github className={`h-3.5 w-3.5 ${githubMcpActive ? "text-indigo-400" : "text-zinc-600"}`} />
                <span className="text-xs font-semibold text-zinc-300">GitHub Repo MCP</span>
              </div>
              <input
                type="checkbox"
                checked={githubMcpActive}
                onChange={(e) => setGithubMcpActive(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-zinc-800 text-indigo-600 focus:ring-indigo-500 bg-zinc-950"
              />
            </label>

            {/* Workspace Sync MCP toggle */}
            <label className="flex items-center justify-between cursor-pointer p-1.5 rounded-lg bg-zinc-950/40 hover:bg-zinc-950/80 transition border border-zinc-900">
              <div className="flex items-center gap-2">
                <Network className={`h-3.5 w-3.5 ${workspaceMcpActive ? "text-indigo-400" : "text-zinc-600"}`} />
                <span className="text-xs font-semibold text-zinc-300">Workspace Sync MCP</span>
              </div>
              <input
                type="checkbox"
                checked={workspaceMcpActive}
                onChange={(e) => setWorkspaceMcpActive(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-zinc-800 text-indigo-600 focus:ring-indigo-500 bg-zinc-950"
              />
            </label>
          </div>
        </div>

        {/* Trending Development Skills shortcuts */}
        <div className="glass-panel p-4.5 rounded-2xl space-y-3">
          <div className="flex items-center gap-1.5 border-b border-zinc-900 pb-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Trending Skills
            </span>
          </div>

          <p className="text-[10px] text-zinc-500 leading-relaxed font-sans">
            Quickly trigger specialized developmental AI models & prompts for low-code project deployment:
          </p>

          <div className="space-y-2 pt-1.5">
            <button
              onClick={() =>
                applySkill(
                  "pipeline",
                  "GitHub Pipeline",
                  "Create a fully automated GitHub Actions CI/CD workflow that tests my typescript branch, builds a debug APK called Arena.apk, and deploys it on a completely £0.00 budget."
                )
              }
              className={`w-full text-left p-2 rounded-xl border text-xs transition flex items-center justify-between ${
                activeSkill === "pipeline"
                  ? "bg-indigo-950/40 border-indigo-500 text-white"
                  : "bg-zinc-950/30 border-zinc-900 hover:border-zinc-800 text-zinc-300"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Cpu className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span className="font-semibold truncate">CI/CD Pipeline Builder</span>
              </div>
              <Sparkles className="h-3 w-3 text-indigo-400 shrink-0" />
            </button>

            <button
              onClick={() =>
                applySkill(
                  "firestore_rules",
                  "Firestore Rules",
                  "Explain how to construct secure Firebase Firestore Security Rules for our team log collections. Ensure public read is restricted, only authenticated project members can write, and log payloads are validated."
                )
              }
              className={`w-full text-left p-2 rounded-xl border text-xs transition flex items-center justify-between ${
                activeSkill === "firestore_rules"
                  ? "bg-indigo-950/40 border-indigo-500 text-white"
                  : "bg-zinc-950/30 border-zinc-900 hover:border-zinc-800 text-zinc-300"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Network className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span className="font-semibold truncate">Firestore Rule Architect</span>
              </div>
              <Sparkles className="h-3 w-3 text-emerald-400 shrink-0" />
            </button>

            <button
              onClick={() =>
                applySkill(
                  "budget_saver",
                  "£0 Planner",
                  "Create an optimized cost plan for deploying my full-stack application on Cloud Run and Firestore using scale-to-zero capabilities to maintain a lifetime budget of £0.00."
                )
              }
              className={`w-full text-left p-2 rounded-xl border text-xs transition flex items-center justify-between ${
                activeSkill === "budget_saver"
                  ? "bg-indigo-950/40 border-indigo-500 text-white"
                  : "bg-zinc-950/30 border-zinc-900 hover:border-zinc-800 text-zinc-300"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Terminal className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span className="font-semibold truncate">£0 Budget Optimizer</span>
              </div>
              <Sparkles className="h-3 w-3 text-amber-400 shrink-0" />
            </button>

            <button
              onClick={() =>
                applySkill(
                  "lowcode",
                  "Low Code",
                  "Generate a simple, lightweight bash automation script that builds a debug android APK called Arena.apk from my branch tests, checks dependencies, and saves build stats."
                )
              }
              className={`w-full text-left p-2 rounded-xl border text-xs transition flex items-center justify-between ${
                activeSkill === "lowcode"
                  ? "bg-indigo-950/40 border-indigo-500 text-white"
                  : "bg-zinc-950/30 border-zinc-900 hover:border-zinc-800 text-zinc-300"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <HelpCircle className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                <span className="font-semibold truncate">Low-Code APK Builder</span>
              </div>
              <Sparkles className="h-3 w-3 text-sky-400 shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Terminal Chat Panel */}
      <div className="lg:col-span-3 glass-panel rounded-2xl flex flex-col h-[520px] overflow-hidden relative">
        {/* Terminal Header */}
        <div className="bg-zinc-950 px-4 py-3 flex justify-between items-center border-b border-zinc-900 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 shrink-0">
              <span className="h-2.5 w-2.5 bg-red-500 rounded-full"></span>
              <span className="h-2.5 w-2.5 bg-yellow-500 rounded-full"></span>
              <span className="h-2.5 w-2.5 bg-green-500 rounded-full"></span>
            </div>
            <span className="h-4 w-px bg-zinc-800"></span>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
              <Terminal className="h-3.5 w-3.5 text-zinc-500" />
              <span>gemini-2.5-flash@arena-copilot:~</span>
            </div>
          </div>

          <button
            onClick={handleClearChat}
            className="p-1 text-zinc-500 hover:text-red-400 transition"
            title="Clear Chat History"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Chat Stream Viewport */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-zinc-950/30">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 text-xs max-w-4xl ${
                msg.role === "user" ? "justify-end ml-12" : "justify-start mr-12"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="h-7 w-7 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                </div>
              )}

              <div className="relative group min-w-0">
                {/* Message Speech bubble */}
                <div
                  className={`p-3.5 rounded-2xl relative ${
                    msg.role === "user"
                      ? "bg-indigo-600/15 border border-indigo-500/20 text-zinc-100 rounded-tr-none"
                      : "bg-zinc-900/60 border border-zinc-850 text-zinc-300 rounded-tl-none whitespace-pre-wrap leading-relaxed"
                  }`}
                >
                  {/* Handle formatting for lists and headings in code */}
                  {msg.role === "assistant" ? (
                    <div className="space-y-2">
                      {msg.content.split("\n").map((line, lIdx) => {
                        // Very basic markdown translation to render nicely
                        if (line.startsWith("### ")) {
                          return <h4 key={lIdx} className="text-sm font-bold text-white font-display pt-1">{line.replace("### ", "")}</h4>;
                        }
                        if (line.startsWith("## ")) {
                          return <h3 key={lIdx} className="text-base font-bold text-white font-display pt-1.5">{line.replace("## ", "")}</h3>;
                        }
                        if (line.startsWith("- ") || line.startsWith("* ")) {
                          return <li key={lIdx} className="ml-3 list-disc pl-1 text-[11px] text-zinc-300">{line.substring(2)}</li>;
                        }
                        if (line.includes("`") && !line.startsWith("```")) {
                          // Simple inline code highlighting helper
                          const parts = line.split("`");
                          return (
                            <p key={lIdx} className="text-[11px] text-zinc-300">
                              {parts.map((part, pIdx) =>
                                pIdx % 2 === 1 ? (
                                  <code key={pIdx} className="px-1 py-0.5 bg-zinc-950 border border-zinc-800 rounded text-indigo-300 font-mono text-[10px]">
                                    {part}
                                  </code>
                                ) : (
                                  part
                                )
                              )}
                            </p>
                          );
                        }
                        return <p key={lIdx} className="text-[11px] text-zinc-300">{line}</p>;
                      })}
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>

                {/* Copy helper */}
                {msg.role === "assistant" && (
                  <button
                    onClick={() => copyToClipboard(msg.content, index)}
                    className="absolute top-2 right-2 p-1.5 rounded-md bg-zinc-950/60 border border-zinc-800/80 text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition duration-150"
                    title="Copy response to clipboard"
                  >
                    {copiedIndex === index ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Form area */}
        <form
          onSubmit={(e) => handleSendMessage(e)}
          className="bg-zinc-950 p-3 border-t border-zinc-900 flex gap-2 shrink-0"
        >
          <input
            type="text"
            required
            disabled={isLoading}
            placeholder={
              isLoading
                ? "Synthesizing response via Gemini AI..."
                : "Ask anything (e.g. Generate £0 Cloud Run deploy script)..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-900 text-white rounded-xl transition duration-150 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/10"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
