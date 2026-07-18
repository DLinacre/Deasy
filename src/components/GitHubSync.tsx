import React, { useState } from "react";
import {
  Github,
  GitBranch,
  Play,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Loader2,
  Sparkles,
  RefreshCw,
  Terminal,
  ShieldCheck,
  Code,
} from "lucide-react";
import { Project, Branch } from "../types";

interface GitHubSyncProps {
  project: Project;
  onRunTest: (branchName: string) => void;
}

export default function GitHubSync({ project, onRunTest }: GitHubSyncProps) {
  const [selectedBranch, setSelectedBranch] = useState<string>(project.branches[0]?.name || "main");
  const [isRunning, setIsRunning] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{
    errorType: string;
    explanation: string;
    solution: string;
    configSuggestion: string;
  } | null>(null);

  const activeBranchObj = project.branches.find((b) => b.name === selectedBranch) || project.branches[0];

  const handleSyncGit = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1500);
  };

  const handleRunTests = () => {
    setIsRunning(true);
    setAiResult(null);
    setTimeout(() => {
      setIsRunning(false);
      onRunTest(selectedBranch);
    }, 2000);
  };

  const handleAnalyzeWithGemini = async () => {
    if (!activeBranchObj.testLogs) return;
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logType: "ci_fail",
          logText: activeBranchObj.testLogs,
          branch: selectedBranch,
          repo: project.repoName,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAiResult(data);
      } else {
        throw new Error(data.error || "Failed to analyze");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Could not analyze the log with Gemini. Make sure your GEMINI_API_KEY is configured in Settings.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6" id="github-sync-panel">
      {/* Top Section - Connected Repo status */}
      <div className="p-4 sm:p-5 rounded-xl glass-panel flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700 shrink-0">
            <Github className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white font-display">GitHub Synchronization</h3>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Active Sync
              </span>
            </div>
            <p className="font-mono text-xs text-zinc-400 mt-1">{project.repoName}</p>
          </div>
        </div>

        <button
          onClick={handleSyncGit}
          disabled={isSyncing}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 transition text-white font-medium text-xs rounded-lg border border-zinc-700 flex items-center gap-2"
        >
          {isSyncing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          Force Repository Resync
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="git-branches-grid">
        {/* Left Column: Branch Selector list */}
        <div className="lg:col-span-1 p-4 rounded-xl glass-panel space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 mb-2">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-display">Repository Branches</h4>
            <span className="text-xs text-zinc-500">{project.branches.length} branches</span>
          </div>

          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {project.branches.map((b) => (
              <button
                key={b.name}
                onClick={() => {
                  setSelectedBranch(b.name);
                  setAiResult(null);
                }}
                className={`w-full p-2.5 rounded-lg text-left transition flex items-center justify-between text-xs ${
                  selectedBranch === b.name
                    ? "bg-indigo-600/20 border border-indigo-500/40 text-white"
                    : "bg-zinc-950/20 hover:bg-zinc-900/40 border border-transparent text-zinc-400"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <GitBranch className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate font-mono">{b.name}</span>
                </div>
                {b.testStatus === "passed" && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                )}
                {b.testStatus === "failed" && (
                  <XCircle className="h-3.5 w-3.5 text-red-400 shrink-0 animate-pulse" />
                )}
                {b.testStatus === "idle" && (
                  <HelpCircle className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                )}
                {b.testStatus === "running" && (
                  <Loader2 className="h-3.5 w-3.5 text-indigo-400 animate-spin shrink-0" />
                )}
              </button>
            ))}
          </div>

          <div className="p-3 bg-indigo-950/15 border border-indigo-500/20 rounded-lg text-[11px] text-indigo-300">
            <span className="font-semibold text-white block mb-1">Branch-Level Testing Matrix</span>
            Arena.ai monitors every branch and triggers test suites autonomously upon receiving Git pushes.
          </div>
        </div>

        {/* Right Columns: Active branch details, logs, testing triggers & AI diagnostics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-4 sm:p-5 rounded-xl glass-panel space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-bold font-display">Active Working Branch</span>
                <h4 className="text-base font-semibold text-white font-mono mt-0.5 flex items-center gap-1.5">
                  <GitBranch className="h-4 w-4 text-indigo-400 shrink-0" />
                  {activeBranchObj.name}
                </h4>
              </div>

              <button
                onClick={handleRunTests}
                disabled={isRunning}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 self-start sm:self-center transition shadow-md"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" />
                    Run Branch Test Suite
                  </>
                )}
              </button>
            </div>

            {/* Commit Detail */}
            <div className="p-3 bg-zinc-950/40 rounded-lg border border-zinc-800/60 text-xs">
              <div className="flex justify-between text-zinc-500 mb-1.5 text-[10px] uppercase font-bold">
                <span>Latest Commit</span>
                <span>By {activeBranchObj.author}</span>
              </div>
              <p className="text-zinc-200 font-mono truncate">{activeBranchObj.commitMsg}</p>
              <span className="text-zinc-500 text-[10px] mt-2 block">Pushed on {activeBranchObj.updatedAt}</span>
            </div>

            {/* Testing metrics panel */}
            {activeBranchObj.testMetrics && (
              <div className="grid grid-cols-4 gap-3 bg-zinc-950/40 p-3 rounded-lg border border-zinc-800/60 text-center">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block font-display">Passed</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    {activeBranchObj.testMetrics.passed}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block font-display">Failed</span>
                  <span className={`text-sm font-bold font-mono ${activeBranchObj.testMetrics.failed > 0 ? "text-red-400" : "text-zinc-400"}`}>
                    {activeBranchObj.testMetrics.failed}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block font-display">Skipped</span>
                  <span className="text-sm font-bold text-zinc-400 font-mono">
                    {activeBranchObj.testMetrics.skipped}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block font-display">Duration</span>
                  <span className="text-sm font-bold text-cyan-400 font-mono">
                    {activeBranchObj.testMetrics.duration}
                  </span>
                </div>
              </div>
            )}

            {/* Logs console */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5 font-semibold text-zinc-300 font-display">
                  <Terminal className="h-4 w-4 text-zinc-400" />
                  Automated Runner Console Logs
                </span>
                {activeBranchObj.testLogs && (
                  <span className="font-mono text-[10px] text-zinc-500">ReadOnly Buffer</span>
                )}
              </div>

              {activeBranchObj.testLogs ? (
                <pre className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg font-mono text-[11px] leading-relaxed text-zinc-300 max-h-56 overflow-y-auto whitespace-pre-wrap">
                  {activeBranchObj.testLogs}
                </pre>
              ) : (
                <div className="p-8 text-center bg-zinc-950/20 border border-dashed border-zinc-800 rounded-lg text-xs text-zinc-500">
                  No automated tests have been executed for this branch in this session.
                  Click "Run Branch Test Suite" to verify reliability.
                </div>
              )}
            </div>

            {/* AI Diagnostics trigger */}
            {activeBranchObj.testStatus === "failed" && activeBranchObj.testLogs && (
              <div className="p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-950/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-semibold text-indigo-400 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                    AI Diagnostics Available
                  </span>
                  <p className="text-xs text-zinc-300">
                    Let our server-side Gemini Assistant analyze these testing errors and code stacktraces.
                  </p>
                </div>
                <button
                  onClick={handleAnalyzeWithGemini}
                  disabled={aiLoading}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition shrink-0 flex items-center gap-1.5 shadow"
                >
                  {aiLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      Diagnose Error
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* AI Analysis Result Display */}
          {aiResult && (
            <div className="p-5 rounded-xl border border-indigo-500/30 bg-indigo-950/20 space-y-4 animate-fadeIn" id="ai-diagnostics-result">
              <div className="flex items-center gap-2 border-b border-indigo-500/20 pb-3">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                <h4 className="text-sm font-semibold text-white font-display">Gemini Co-Pilot Diagnostician</h4>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-indigo-500/30 text-indigo-200 ml-auto">
                  {aiResult.errorType}
                </span>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-zinc-300">
                <div>
                  <span className="font-bold text-white block mb-1 text-[11px] uppercase tracking-wider text-indigo-300">Root Cause Explanation</span>
                  <p>{aiResult.explanation}</p>
                </div>

                <div className="pt-2">
                  <span className="font-bold text-white block mb-1.5 text-[11px] uppercase tracking-wider text-indigo-300">Step-by-Step Resolution Strategy</span>
                  <div className="text-zinc-300 space-y-1 pl-1">
                    {aiResult.solution.split("\n").map((line, idx) => (
                      <div key={idx} className="flex gap-2">
                        <span className="text-indigo-400 shrink-0">•</span>
                        <span>{line.replace(/^[•\s-\d.]+\s*/, "")}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {aiResult.configSuggestion && (
                  <div className="pt-3">
                    <span className="font-bold text-white block mb-2 text-[11px] uppercase tracking-wider text-indigo-300 flex items-center gap-1">
                      <Code className="h-3.5 w-3.5" />
                      Recommended Configuration Adjustment
                    </span>
                    <pre className="p-3 bg-zinc-950 rounded-lg border border-indigo-950 font-mono text-[11px] text-indigo-200 overflow-x-auto">
                      {aiResult.configSuggestion}
                    </pre>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-indigo-400/80 pt-2 border-t border-indigo-500/10">
                <ShieldCheck className="h-4 w-4" />
                <span>Zero-risk server analysis. Code changes should be performed in the http://arena.ai/agents editor workspace.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
