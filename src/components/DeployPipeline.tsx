import React, { useState, useEffect } from "react";
import {
  Play,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Loader2,
  Sparkles,
  Server,
  Code,
  Copy,
  Terminal,
  ExternalLink,
} from "lucide-react";
import { Project, PipelineStage } from "../types";

interface DeployPipelineProps {
  project: Project;
  onUpdatePlatform: (platform: string) => void;
  onUpdateHealthScore: (score: number) => void;
}

const PLATFORMS_FREE = [
  { name: "Vercel (Free)", description: "Best for Static SPAs, Next.js, or Vite Frontends. Zero config edge hosting.", limit: "100GB Bandwidth / Mo" },
  { name: "Netlify (Free)", description: "Awesome alternative for static frontends. Includes free forms and redirects.", limit: "100GB Bandwidth / Mo" },
  { name: "GitHub Pages (Free)", description: "Pure static client build, powered directly by GitHub actions.", limit: "Unlimited / public repos" },
  { name: "Render (Free)", description: "Dockerized node backends. Scales down on idle (15 min sleep delay).", limit: "512MB RAM / 750 free hrs" },
  { name: "Cloud Run (Free tier)", description: "Scale-to-zero serverless containers. Free tier is generous.", limit: "2 Million request / Mo" },
];

export default function DeployPipeline({
  project,
  onUpdatePlatform,
  onUpdateHealthScore,
}: DeployPipelineProps) {
  const [targetPlatform, setTargetPlatform] = useState(project.targetPlatform);
  const [pipelineState, setPipelineState] = useState<"idle" | "running" | "success" | "failed">("idle");
  const [currentStageIndex, setCurrentStageIndex] = useState(-1);
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [selectedBranch, setSelectedBranch] = useState(project.branches[0]?.name || "main");
  const [aiLoading, setAiLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [aiResult, setAiResult] = useState<{
    explanation: string;
    yaml: string;
    secretsNeeded: string;
  } | null>(null);

  // Initialize pipeline stages
  const initStages = () => {
    return [
      { id: "s1", name: "Source Pull & Git Handshake", status: "idle", duration: "0s", progress: 0, logs: [] },
      { id: "s2", name: "Automated Linter & Tests Check", status: "idle", duration: "0s", progress: 0, logs: [] },
      { id: "s3", name: "Bundler & Asset Compilation", status: "idle", duration: "0s", progress: 0, logs: [] },
      { id: "s4", name: "Target Container Registry Push", status: "idle", duration: "0s", progress: 0, logs: [] },
      { id: "s5", name: "Edge CDN Route & Health Check", status: "idle", duration: "0s", progress: 0, logs: [] },
    ] as PipelineStage[];
  };

  useEffect(() => {
    setStages(initStages());
  }, [project.id]);

  const handlePlatformChange = (pName: string) => {
    setTargetPlatform(pName);
    onUpdatePlatform(pName);
    setAiResult(null); // Clear previous workflow config
  };

  const runDeployment = () => {
    // Reset
    const freshStages = initStages();
    setStages(freshStages);
    setPipelineState("running");
    setCurrentStageIndex(0);
    setAiResult(null);
  };

  // Pipeline runner loop simulation
  useEffect(() => {
    if (pipelineState !== "running" || currentStageIndex === -1 || currentStageIndex >= stages.length) {
      if (currentStageIndex >= stages.length && pipelineState === "running") {
        setPipelineState("success");
        onUpdateHealthScore(Math.min(100, Math.floor(project.healthScore + (100 - project.healthScore) * 0.5)));
      }
      return;
    }

    const stage = stages[currentStageIndex];
    let elapsed = 0;
    
    // Set current stage as running
    setStages((prev) =>
      prev.map((s, idx) =>
        idx === currentStageIndex
          ? {
              ...s,
              status: "running",
              logs: [`[INFO] Initializing pipeline stage: ${s.name}`, `[INFO] Targeting ${targetPlatform} serverless nodes`],
            }
          : s
      )
    );

    const timer = setInterval(() => {
      elapsed += 1;
      setStages((prev) =>
        prev.map((s, idx) => {
          if (idx !== currentStageIndex) return s;
          
          const progress = Math.min(100, elapsed * 20);
          const logs = [...s.logs];
          
          if (elapsed === 1) logs.push(`[EXEC] Validating configuration credentials ... [OK]`);
          if (elapsed === 2) logs.push(`[EXEC] Running subtask compiler ...`);
          if (elapsed === 4) logs.push(`[SUCCESS] Completed subtask logic with zero warnings.`);
          
          return {
            ...s,
            progress,
            duration: `${elapsed}s`,
            status: progress >= 100 ? "success" : "running",
            logs,
          };
        })
      );

      if (elapsed >= 5) {
        clearInterval(timer);
        setCurrentStageIndex((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [pipelineState, currentStageIndex]);

  const handleGenerateWorkflow = async () => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logType: "deploy_config",
          branch: selectedBranch,
          repo: project.repoName,
          targetPlatform: targetPlatform,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAiResult(data);
      } else {
        throw new Error(data.error || "Failed to generate workflow");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Could not generate GitHub actions script with Gemini. Check your API Key.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!aiResult?.yaml) return;
    navigator.clipboard.writeText(aiResult.yaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="deploy-pipeline-panel">
      {/* Top section: Select Target free Platform */}
      <div className="p-4 sm:p-5 rounded-xl glass-panel">
        <h3 className="text-base font-semibold text-white mb-2 font-display flex items-center gap-2">
          <Server className="h-5 w-5 text-indigo-400" />
          Target Deployment Provider (£0.00 Host Configuration)
        </h3>
        <p className="text-xs text-zinc-400 mb-4">
          Select where http://arena.ai/agents will publish your build container. Every listed target operates fully within free-tier limits.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3" id="platform-selectors">
          {PLATFORMS_FREE.map((p) => (
            <button
              key={p.name}
              onClick={() => handlePlatformChange(p.name)}
              className={`p-3 rounded-lg text-left transition flex flex-col justify-between text-xs border ${
                targetPlatform === p.name
                  ? "bg-indigo-600/15 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                  : "bg-zinc-950/40 hover:bg-zinc-900/40 border-zinc-800/60 text-zinc-400"
              }`}
            >
              <div>
                <span className="font-semibold block truncate">{p.name}</span>
                <span className="text-[10px] text-zinc-500 line-clamp-2 mt-1 leading-normal">
                  {p.description}
                </span>
              </div>
              <span className={`text-[9px] font-mono mt-2.5 block ${targetPlatform === p.name ? 'text-indigo-400' : 'text-zinc-600'}`}>
                Limit: {p.limit}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="deploy-pipeline-body">
        {/* Left Column: Stage Pipeline Tracker & Build Trigger */}
        <div className="lg:col-span-2 p-4 sm:p-5 rounded-xl glass-panel space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            <div>
              <h4 className="text-sm font-semibold text-white font-display">CI/CD Automation Pipeline</h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Targeting <span className="font-semibold text-zinc-200">{targetPlatform}</span> via branch{" "}
                <span className="font-mono bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800 text-zinc-300">
                  {selectedBranch}
                </span>
              </p>
            </div>

            <button
              onClick={runDeployment}
              disabled={pipelineState === "running"}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 transition self-start sm:self-center shadow-lg"
            >
              {pipelineState === "running" ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  Trigger Manual Pipeline Deployment
                </>
              )}
            </button>
          </div>

          {/* Render Pipeline Stages */}
          <div className="space-y-4" id="pipeline-stages">
            {stages.map((stage, idx) => (
              <div key={stage.id} className="relative">
                {/* Visual Connector Line */}
                {idx < stages.length - 1 && (
                  <div
                    className={`absolute left-[13px] top-7 bottom-[-15px] w-0.5 ${
                      stage.status === "success"
                        ? "bg-indigo-500/80"
                        : "bg-zinc-800"
                    }`}
                  ></div>
                )}

                <div className="flex items-start gap-4">
                  {/* Stage Icon Status indicator */}
                  <div className="shrink-0 mt-0.5 relative z-10">
                    {stage.status === "success" && (
                      <CheckCircle2 className="h-7 w-7 text-emerald-400 bg-[#0b0c10] rounded-full" />
                    )}
                    {stage.status === "failed" && (
                      <XCircle className="h-7 w-7 text-red-400 bg-[#0b0c10] rounded-full animate-bounce" />
                    )}
                    {stage.status === "running" && (
                      <div className="h-7 w-7 rounded-full bg-indigo-950 border border-indigo-500 flex items-center justify-center animate-spin">
                        <Loader2 className="h-4 w-4 text-indigo-400" />
                      </div>
                    )}
                    {stage.status === "idle" && (
                      <div className="h-7 w-7 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-600 text-[10px] font-bold">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  {/* Stage Info */}
                  <div className="flex-1 min-w-0 bg-zinc-950/20 p-3 rounded-lg border border-zinc-800/40">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h5 className="text-xs font-semibold text-zinc-200 font-display truncate">
                        {stage.name}
                      </h5>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {stage.status === "running" ? "Running" : stage.status === "success" ? `Success (${stage.duration})` : "Queued"}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    {stage.status === "running" && (
                      <div className="w-full bg-zinc-900/60 rounded-full h-1 mb-2">
                        <div
                          className="bg-indigo-500 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${stage.progress}%` }}
                        ></div>
                      </div>
                    )}

                    {/* Logs per Stage */}
                    {stage.status !== "idle" && stage.logs.length > 0 && (
                      <div className="mt-2 text-[10px] font-mono text-zinc-400 space-y-1 bg-zinc-950 p-2 rounded border border-zinc-900/60 max-h-24 overflow-y-auto">
                        {stage.logs.map((log, lidx) => (
                          <div key={lidx}>{log}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Success Summary Banner */}
          {pipelineState === "success" && (
            <div className="p-4 rounded-xl bg-emerald-950/15 border border-emerald-500/30 flex items-center gap-3 text-emerald-300 animate-fadeIn">
              <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
              <div className="flex-1 text-xs">
                <span className="font-semibold block">Build Container Deployed Successfully!</span>
                Active branch deployed on distributed serverless server. Your health score is upgraded!
              </div>
              <a
                href="http://arena.ai/agents"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-emerald-900/40 hover:bg-emerald-800/50 rounded-lg text-xs font-semibold transition shrink-0 flex items-center gap-1"
              >
                Launch App
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>

        {/* Right Column: AI workflow generator for £0.00 continuous pipelines */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-4 sm:p-5 rounded-xl glass-panel space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-20 w-20 bg-indigo-500/5 blur-3xl rounded-full"></div>
            
            <div className="flex items-center gap-1.5 text-indigo-400 font-semibold text-xs">
              <Sparkles className="h-4.5 w-4.5 animate-pulse" />
              <span className="font-display">AI Workflow Architect</span>
            </div>

            <h4 className="text-sm font-semibold text-white font-display">Automate CI/CD Free!</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Query Gemini to draft a free GitHub Actions workflow file that syncs your repo and automatically deploys builds on <span className="text-zinc-200 font-medium">{targetPlatform}</span> on push events.
            </p>

            <button
              onClick={handleGenerateWorkflow}
              disabled={aiLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition shadow flex items-center justify-center gap-1.5"
            >
              {aiLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Generating Actions YAML...
                </>
              ) : (
                <>
                  <Code className="h-3.5 w-3.5" />
                  Generate Free YAML Config
                </>
              )}
            </button>
          </div>

          {/* AI generated YAML display */}
          {aiResult && (
            <div className="p-4 rounded-xl border border-indigo-500/25 bg-indigo-950/20 space-y-4 animate-fadeIn" id="ai-yaml-result">
              <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 font-display">
                  GitHub Actions Config
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 hover:bg-indigo-500/20 rounded transition text-indigo-300 hover:text-white"
                  title="Copy Workflow code"
                >
                  {copied ? (
                    <span className="text-[10px] text-emerald-400">Copied!</span>
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <p className="text-zinc-300 text-[11px]">{aiResult.explanation}</p>

                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-indigo-400 font-mono">
                    .github/workflows/deploy.yml
                  </span>
                  <pre className="p-2 bg-zinc-950 rounded border border-indigo-950 font-mono text-[9px] text-zinc-300 overflow-x-auto max-h-48">
                    {aiResult.yaml}
                  </pre>
                </div>

                <div className="pt-2 bg-indigo-950/25 p-2 rounded-lg border border-indigo-950/40">
                  <span className="font-bold text-white block text-[10px] uppercase tracking-wider mb-1">
                    Required Free Secrets
                  </span>
                  <div className="text-[11px] text-zinc-400 leading-normal pl-1">
                    {aiResult.secretsNeeded.split("\n").map((line, idx) => (
                      <div key={idx} className="mt-1">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
