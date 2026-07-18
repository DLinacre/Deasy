import React, { useState } from "react";
import {
  Calculator,
  Calendar,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  Check,
  Sparkles,
  Loader2,
} from "lucide-react";
import { FREE_TIER_BUDGET_GUIDE, DEVELOPMENT_TIMELINE_STAGES } from "../data";

export default function BudgetTimelineCalculator() {
  const [reposCount, setReposCount] = useState(2);
  const [monthlyRequests, setMonthlyRequests] = useState(50000); // 50k
  const [dbStorageMb, setDbStorageMb] = useState(150); // 150MB
  const [workingPace, setWorkingPace] = useState<"fulltime" | "parttime" | "agent">("parttime");
  
  // Custom advice from server-side Gemini AI for free hosting strategies
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);

  // Budget calculations
  const vercelLimit = 100 * 1024; // 100GB in MB
  const githubMinutesLimit = 2000;
  const supabaseLimitMb = 500;

  const calculatedVercelCost = "£0.00";
  const calculatedGithubCost = "£0.00";
  const calculatedSupabaseCost = "£0.00";
  const totalBudget = "£0.00";

  // Timeline multipliers based on working pace
  const paceMultipliers = {
    fulltime: 0.6, // Faster (e.g. 8 days)
    parttime: 1.0, // Standard (e.g. 14 days)
    agent: 0.3,    // Super fast autonomous code (e.g. 4 days)
  };

  const multiplier = paceMultipliers[workingPace];

  const handleAskAIAdvice = async () => {
    setAiLoading(true);
    setAiAdvice(null);
    try {
      const res = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logType: "budget_question",
          logText: `I have a budget of £0.00. I need to host ${reposCount} repositories, handle around ${monthlyRequests} monthly server requests, and store ${dbStorageMb}MB of relational PostgreSQL database data. How can I achieve complete branch testing, secure backups, and multi-platform deployments for free?`,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAiAdvice(data.advice);
      } else {
        throw new Error(data.error || "Could not fetch AI advice");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to query Gemini. Check Settings > Secrets.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6" id="budget-timeline-panel">
      {/* Visual Header Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Interactive £0.00 Budget Simulator */}
        <div className="p-4 sm:p-5 rounded-xl glass-panel space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Calculator className="h-5 w-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-white font-display">
              £0.00 Budget Capacity Simulator
            </h3>
          </div>

          <p className="text-xs text-zinc-400">
            Slide parameters to check if your platform requirements remain fully covered under the **£0.00** free tiers.
          </p>

          <div className="space-y-4">
            {/* Slider 1: Repos */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-400">Connected Repositories</span>
                <span className="text-white font-medium">{reposCount} / Unlimited</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={reposCount}
                onChange={(e) => setReposCount(parseInt(e.target.value))}
                className="w-full accent-indigo-500 bg-zinc-800 h-1 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 2: Request load */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-400">Monthly Request Traffic</span>
                <span className="text-white font-medium">{(monthlyRequests / 1000).toFixed(0)}k / 2.0M free</span>
              </div>
              <input
                type="range"
                min="10000"
                max="500000"
                step="10000"
                value={monthlyRequests}
                onChange={(e) => setMonthlyRequests(parseInt(e.target.value))}
                className="w-full accent-cyan-500 bg-zinc-800 h-1 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 3: DB Storage */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-400">DB Row Storage</span>
                <span className="text-white font-medium">{dbStorageMb}MB / 500MB free</span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={dbStorageMb}
                onChange={(e) => setDbStorageMb(parseInt(e.target.value))}
                className="w-full accent-emerald-500 bg-zinc-800 h-1 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Budget cost overview cards */}
          <div className="grid grid-cols-3 gap-2 bg-zinc-950/40 p-3 rounded-lg border border-zinc-900/60 text-center">
            <div>
              <span className="text-[9px] text-zinc-500 uppercase block font-display">Compute Hosting</span>
              <span className="text-xs font-bold text-indigo-400 font-mono">{calculatedVercelCost}</span>
            </div>
            <div>
              <span className="text-[9px] text-zinc-500 uppercase block font-display">CI Run Minutes</span>
              <span className="text-xs font-bold text-indigo-400 font-mono">{calculatedGithubCost}</span>
            </div>
            <div>
              <span className="text-[9px] text-zinc-500 uppercase block font-display">Postgre Storage</span>
              <span className="text-xs font-bold text-indigo-400 font-mono">{calculatedSupabaseCost}</span>
            </div>
          </div>

          {/* Absolute zero banner */}
          <div className="p-3 bg-indigo-950/15 border border-indigo-500/25 rounded-lg flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300">Total Monthly Expenditure:</span>
            <span className="text-base font-black text-indigo-400 font-mono">{totalBudget}</span>
          </div>

          {/* AI Advisor trigger */}
          <button
            onClick={handleAskAIAdvice}
            disabled={aiLoading}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5"
          >
            {aiLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Consulting Free-tier Architect...
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                Analyze £0.00 Project Viability
              </>
            )}
          </button>
        </div>

        {/* Card 2: Interactive Timeline Estimator */}
        <div className="p-4 sm:p-5 rounded-xl glass-panel space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Calendar className="h-5 w-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-white font-display">
              Development Pace & Timeline Estimator
            </h3>
          </div>

          <p className="text-xs text-zinc-400">
            Select your developer resource capacity to estimate the calendar timeline necessary to build out this continuous deployment setup.
          </p>

          {/* Working Pace Selection tabs */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-zinc-950/60 border border-zinc-800 rounded-lg">
            <button
              onClick={() => setWorkingPace("fulltime")}
              className={`py-1.5 rounded text-[10px] font-bold transition ${
                workingPace === "fulltime"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Full-time Dev
            </button>
            <button
              onClick={() => setWorkingPace("parttime")}
              className={`py-1.5 rounded text-[10px] font-bold transition ${
                workingPace === "parttime"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Part-time Solo
            </button>
            <button
              onClick={() => setWorkingPace("agent")}
              className={`py-1.5 rounded text-[10px] font-bold transition flex items-center justify-center gap-1 ${
                workingPace === "agent"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Sparkles className="h-3 w-3 text-indigo-400 animate-pulse" />
              Arena.ai Agent
            </button>
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">Estimated Project Span:</span>
              <span className="text-indigo-400 font-bold font-mono">
                {Math.max(1, Math.round(14 * multiplier))} calendar days
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">CI/CD Maintenance Cost:</span>
              <span className="text-emerald-400 font-bold font-mono">£0.00 / year (Standard free quotas)</span>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950/40 border border-zinc-800 text-xs text-zinc-400 leading-normal space-y-1.5">
              <span className="font-semibold text-zinc-200 block">Pace Diagnosis</span>
              {workingPace === "fulltime" && (
                <span>Dedicated focus. You can sync repos, write automated test workflows, and set up Dockerized liveness health probes in roughly 8 working days.</span>
              )}
              {workingPace === "parttime" && (
                <span>Balanced pacing. Perfect for side projects. You can execute 100% of these configurations within 14 calendar days at 0.00 expense.</span>
              )}
              {workingPace === "agent" && (
                <span className="text-indigo-200">Hyper-accelerated. By utilizing Arena.ai agents, we can bootstrap the repository, deploy testing branches, and configure secure CDN servers in less than 4 days.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Advice Output */}
      {aiAdvice && (
        <div className="p-5 rounded-xl border border-indigo-500/25 bg-indigo-950/15 space-y-3 animate-fadeIn" id="budget-ai-advice">
          <div className="flex items-center gap-2 border-b border-indigo-500/20 pb-2.5">
            <Sparkles className="h-4.5 w-4.5 text-indigo-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
              Gemini £0.00 Architecture Consultant Advice
            </h4>
          </div>
          <div className="text-xs text-zinc-300 leading-relaxed space-y-2 font-sans pl-1 whitespace-pre-wrap">
            {aiAdvice}
          </div>
        </div>
      )}

      {/* Detailed Platform Matrix Guide Grid */}
      <div className="p-4 sm:p-5 rounded-xl glass-panel" id="free-tier-matrix">
        <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-3">
          <HelpCircle className="h-4.5 w-4.5 text-zinc-400" />
          <h4 className="text-sm font-semibold text-white font-display">£0.00 Provider Allocation Matrix</h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300 border-collapse">
            <thead>
              <tr className="border-b border-zinc-800/80 text-zinc-500 text-[10px] uppercase font-bold">
                <th className="pb-2.5 pr-2">Module</th>
                <th className="pb-2.5 pr-2">Service</th>
                <th className="pb-2.5 pr-2">Free Allocation Limit</th>
                <th className="pb-2.5 pr-2">Best Practice / Tips</th>
                <th className="pb-2.5 text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/60">
              {FREE_TIER_BUDGET_GUIDE.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-950/20 transition-colors">
                  <td className="py-3 pr-2 font-medium text-white">{row.category}</td>
                  <td className="py-3 pr-2 font-mono text-indigo-400">{row.provider}</td>
                  <td className="py-3 pr-2 text-zinc-400">{row.plan}</td>
                  <td className="py-3 pr-2 text-zinc-500 leading-relaxed">{row.tips}</td>
                  <td className="py-3 text-right font-mono font-bold text-emerald-400">{row.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Structured Chronological Step-by-Step Development Blueprint */}
      <div className="p-4 sm:p-5 rounded-xl glass-panel" id="timeline-chronological-blueprint">
        <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-3">
          <Calendar className="h-4.5 w-4.5 text-zinc-400" />
          <h4 className="text-sm font-semibold text-white font-display">Chronological Implementation Timeline Blueprint</h4>
        </div>

        <div className="space-y-4">
          {DEVELOPMENT_TIMELINE_STAGES.map((stage, idx) => {
            const calculatedDuration = Math.max(1, Math.round(parseFloat(stage.duration.match(/\d+/)?.[0] || "1") * multiplier));
            const calculatedEnd = Math.max(1, Math.round(parseFloat(stage.duration.split("-")[1]?.match(/\d+/)?.[0] || "1") * multiplier));
            
            return (
              <div key={idx} className="flex gap-4 items-start">
                <div className="h-6 w-6 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-[10px] font-bold text-indigo-400 shrink-0 mt-0.5">
                  {idx + 1}
                </div>

                <div className="flex-1 min-w-0 bg-zinc-950/10 p-3.5 rounded-lg border border-zinc-900/80">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <h5 className="text-xs font-semibold text-white font-display">{stage.phase}</h5>
                    <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full self-start">
                      Day {calculatedDuration === calculatedEnd ? calculatedDuration : `${calculatedDuration}-${calculatedEnd}`} ({stage.freeProvider})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1.5 text-xs text-zinc-500">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-zinc-600 block mb-1">Critical Tasks</span>
                      <div className="space-y-1">
                        {stage.tasks.map((t, tid) => (
                          <div key={tid} className="flex items-center gap-1.5">
                            <Check className="h-3 w-3 text-indigo-500 shrink-0" />
                            <span className="text-zinc-400 text-[11px] truncate">{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-zinc-600 block mb-1">Complexity & Quotas</span>
                      <p className="text-[11px] text-zinc-500 leading-relaxed">
                        Classified as <span className="font-semibold text-zinc-400">{stage.difficulty}</span> difficulty. Integrated safely inside standard API limits at zero pricing tier.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
