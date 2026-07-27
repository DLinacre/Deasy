import React, { useState } from "react";
import {
  Sparkles,
  Search,
  Rocket,
  Copy,
  Check,
  Download,
  Terminal,
  Cpu,
  RefreshCw,
  Bot,
  AlertTriangle,
} from "lucide-react";

const AUDIT_CATEGORIES = [
  "Architecture & Design",
  "Code Quality & Maintainability",
  "Security & Vulnerabilities",
  "Accessibility (WCAG 2.2 AA)",
  "Performance & Optimization",
  "UI/UX & Responsiveness",
  "Backend & API Layer",
  "CI/CD & Automated Testing",
  "State Management",
  "Data Layer & DB Schemas",
  "Cloud & Secrets Management",
  "Mobile & Desktop Packaging",
  "Error Handling & Resilience",
  "Documentation & Architecture Maps",
  "SEO & Metadata",
];

const EXPERT_ROLES = [
  "Principal Software Architect",
  "Staff Security Engineer",
  "Lead Accessibility Auditor (IAAP)",
  "Senior Performance Engineer",
  "Lead UX/UI Designer",
  "DevOps & Infrastructure Lead",
  "Staff Frontend Engineer",
  "Senior Backend Engineer",
  "Mobile App Specialist (Android/iOS)",
  "Desktop Platform Engineer (Electron)",
  "QA & Test Automation Lead",
  "Data Engineer & Analytics Architect",
  "Technical Writer & Docs Lead",
  "AI & Automation Architect",
];

export default function ArenaBuilderTab() {
  const [mode, setMode] = useState<"audit" | "create">("create");
  const [copied, setCopied] = useState(false);

  // App Creation Form State
  const [appTitle, setAppTitle] = useState("Deasy Command Suite");
  const [appVision, setAppVision] = useState(
    "Elite Multi-Platform Branch Orchestrator & Windows 11 Desktop Suite for continuous command, monitoring, and automated deployment."
  );
  const [targetPlatform, setTargetPlatform] = useState("Windows 11 Desktop + Android APK + Web");
  const [techStack, setTechStack] = useState("React 19 + Vite + Tailwind CSS + Electron + Node Express + SQLite");
  const [coreFeatures, setCoreFeatures] = useState(
    "- Real-time OS CPU/RAM Monitoring\n- WinCrypt Hardware Secrets Binding\n- Google Drive AES-256 Encrypted Backups\n- GitHub Actions Branch CI/CD Generator\n- Gemini AI Co-Pilot Diagnostics"
  );
  const [targetAudience, setTargetAudience] = useState("Release Managers, DevOps Engineers, and Power Developers");

  // Audit Form State
  const [auditTargetTitle, setAuditTargetTitle] = useState("Deasy Platform");
  const [auditTargetUrl, setAuditTargetUrl] = useState("https://github.com/DLinacre/Deasy");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(AUDIT_CATEGORIES);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(EXPERT_ROLES.slice(0, 6));

  // Gemini Analysis State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const generatePrompt = () => {
    if (mode === "create") {
      return `SYSTEM DIRECTIVE: ARENA AGENT MODE — APP BUILDING PRD & ARCHITECTURE SPECIFICATION

# 🚀 PRODUCT CREATION SPECIFICATION: ${appTitle.toUpperCase() || "NEW APPLICATION"}

## 1. VISION & EXECUTIVE PITCH
${appVision || "Build a high-performance digital product from first principles."}

## 2. TARGET PLATFORMS & DISTRIBUTION
- Target Platform(s): ${targetPlatform}
- Primary Distribution: Single-click NSIS Windows Installer, Standalone APK, Web App

## 3. TECHNICAL ARCHITECTURE & STACK
- Frontend & UI: React 19, Vite, Tailwind CSS (Modern Glassmorphic Dark UI)
- Desktop Runtime: Electron v30+ with Secure IPC Preload and System Tray Integration
- Backend API: Node.js Express API Server with defensive security headers
- Recommended Stack: ${techStack}

## 4. CORE FEATURE BACKLOG & REQUIREMENTS
${coreFeatures}

## 5. TARGET AUDIENCE & USER PERSONAS
- Primary Audience: ${targetAudience}

## 6. NON-FUNCTIONAL REQUIREMENTS & STANDARDS
- WCAG 2.2 AA Accessibility compliance (4.5:1 text contrast, visible focus indicators).
- Cross-browser compatibility (include -webkit- vendor prefixes for Safari & iOS Safari).
- Defensive error handling, zero unhandled promise rejections, and graceful fallbacks.
- Zero-terminal single-click setup experience for end users.

## 7. EXECUTION INSTRUCTIONS FOR AI AGENT
1. Inspect the existing repository structure and build dependencies.
2. Implement core components, services, and platform bridges according to this specification.
3. Validate build with \`pnpm run build\` and ensure zero diagnostic warnings.
4. Provide a clear summary of all implemented features.`;
    } else {
      return `SYSTEM DIRECTIVE: ARENA AGENT MODE — MULTI-EXPERT PRODUCT AUDIT & IMPROVEMENT SPECIFICATION

# 🔍 COMPREHENSIVE AUDIT BRIEF: ${auditTargetTitle.toUpperCase() || "TARGET PRODUCT"}

## 1. TARGET IDENTIFICATION
- Product Title: ${auditTargetTitle}
- Repository / URL: ${auditTargetUrl}

## 2. ACTIVE EXPERT AUDITOR ROLES (${selectedRoles.length} Roles Assigned)
${selectedRoles.map((r) => `- 👤 ${r}`).join("\n")}

## 3. AUDIT SCOPE & CATEGORIES (${selectedCategories.length} Categories Selected)
${selectedCategories.map((c) => `- 🎯 ${c}`).join("\n")}

## 4. AUDIT METHODOLOGY & DELIVERABLES
For each active category:
1. Conduct a rigorous inspection of the target codebase, configuration, and runtime behavior.
2. Identify technical debt, accessibility defects, performance bottlenecks, and security risks.
3. Provide concrete refactoring recommendations and drop-in code fixes.
4. Execute test build verification to confirm 100% operational success.`;
    }
  };

  const currentPrompt = generatePrompt();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentPrompt], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${mode === "create" ? "app-builder-spec" : "audit-brief"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAnalyzeWithGemini = async () => {
    setAiLoading(true);
    setAiError(null);
    setAiResult(null);

    try {
      const res = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logType: "architecture",
          logText: currentPrompt,
          branch: "main",
          repo: auditTargetTitle,
          targetPlatform: targetPlatform,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to analyze prompt with Gemini API`);
      }

      const data = await res.json();
      setAiResult(data.advice || data.explanation || JSON.stringify(data, null, 2));
    } catch (err: any) {
      setAiError(err.message || "Failed to analyze prompt with Gemini AI server.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider border border-indigo-500/30">
              Arena.ai Creation Suite
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
              Client-Side Engine
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-2 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            Arena Builder · Universal Audit & App Specification Engine
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Generate production-grade audit briefs and complete idea-to-PRD app creation prompts tailored for Arena AI Agent Mode, Claude, and Gemini.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 flex gap-1">
          <button
            onClick={() => setMode("create")}
            className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all flex items-center gap-2 ${
              mode === "create"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Rocket className="w-4 h-4" />
            🚀 Create App
          </button>
          <button
            onClick={() => setMode("audit")}
            className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all flex items-center gap-2 ${
              mode === "audit"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Search className="w-4 h-4" />
            🔍 Audit Existing
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Configuration Form */}
        <div className="lg:col-span-5 space-y-4">
          {mode === "create" ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 backdrop-blur-xl">
              <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                <Rocket className="w-4 h-4" /> App Specification Parameters
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">App Title</label>
                <input
                  type="text"
                  value={appTitle}
                  onChange={(e) => setAppTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                  placeholder="e.g. Deasy Command Suite"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Vision / Pitch</label>
                <textarea
                  rows={3}
                  value={appVision}
                  onChange={(e) => setAppVision(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                  placeholder="What core problem does this app solve?"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Target Platform(s)</label>
                <input
                  type="text"
                  value={targetPlatform}
                  onChange={(e) => setTargetPlatform(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                  placeholder="e.g. Windows 11 Desktop + Android APK + Web"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Tech Stack</label>
                <input
                  type="text"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                  placeholder="e.g. React + Vite + Tailwind + Electron + Express"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Core Feature Backlog</label>
                <textarea
                  rows={4}
                  value={coreFeatures}
                  onChange={(e) => setCoreFeatures(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-mono text-xs"
                  placeholder="- Feature 1..."
                />
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 backdrop-blur-xl">
              <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                <Search className="w-4 h-4" /> Product Audit Parameters
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Product Title</label>
                <input
                  type="text"
                  value={auditTargetTitle}
                  onChange={(e) => setAuditTargetTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Repository / Target URL</label>
                <input
                  type="text"
                  value={auditTargetUrl}
                  onChange={(e) => setAuditTargetUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Audit Categories */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">
                  Audit Categories ({selectedCategories.length}/{AUDIT_CATEGORIES.length})
                </label>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {AUDIT_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`w-full text-left text-xs px-3 py-2 rounded-xl transition-all flex items-center justify-between border ${
                          isSelected
                            ? "bg-indigo-900/30 border-indigo-500/40 text-indigo-200"
                            : "bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        <span>{cat}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Expert Roles */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">
                  Expert Auditor Roles ({selectedRoles.length}/{EXPERT_ROLES.length})
                </label>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {EXPERT_ROLES.map((role) => {
                    const isSelected = selectedRoles.includes(role);
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => toggleRole(role)}
                        className={`w-full text-left text-xs px-3 py-2 rounded-xl transition-all flex items-center justify-between border ${
                          isSelected
                            ? "bg-purple-900/30 border-purple-500/40 text-purple-200"
                            : "bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        <span>{role}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-purple-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Generated Prompt Output */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
            {/* Output Toolbar */}
            <div className="bg-slate-900/90 px-5 py-3 border-b border-slate-800 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-300">
                  {mode === "create" ? "App Building PRD Specification" : "Multi-Expert Audit Brief"}
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                  {currentPrompt.length} chars
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAnalyzeWithGemini}
                  disabled={aiLoading}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-lg shadow-purple-500/20 disabled:opacity-50"
                >
                  <Bot className={`w-3.5 h-3.5 ${aiLoading ? "animate-spin" : ""}`} />
                  {aiLoading ? "Analyzing..." : "Analyze with Gemini AI"}
                </button>

                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Markdown
                </button>

                <button
                  onClick={handleCopy}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    copied
                      ? "bg-emerald-600 text-white"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy for Arena Agent Mode"}
                </button>
              </div>
            </div>

            {/* Markdown Display Box */}
            <div className="p-5 font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto bg-slate-950">
              {currentPrompt}
            </div>
          </div>

          {/* Gemini AI Analysis Results Card */}
          {aiResult && (
            <div className="bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-950 border border-purple-500/30 rounded-2xl p-5 space-y-3 backdrop-blur-xl animate-fadeIn">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-400" />
                  Gemini AI Architectural Analysis Response
                </h4>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-mono border border-purple-500/30">
                  Gemini 3.5 Flash
                </span>
              </div>
              <div className="font-sans text-xs text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-950/80 p-4 rounded-xl border border-slate-800 font-mono">
                {aiResult}
              </div>
            </div>
          )}

          {aiError && (
            <div className="bg-red-950/30 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3 text-red-300 text-xs">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <span className="font-semibold block">Gemini AI Note</span>
                <span>{aiError}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
