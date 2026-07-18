import React, { useState } from "react";
import {
  FolderGit2,
  Plus,
  Compass,
  LayoutGrid,
  TrendingUp,
  Activity,
  GitPullRequest,
  CheckCircle2,
  AlertTriangle,
  Server,
  PlusCircle,
} from "lucide-react";
import { Project, Branch } from "../types";

interface WorkspaceHomeProps {
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onAddProject: (project: Project) => void;
}

export default function WorkspaceHome({
  projects,
  activeProjectId,
  onSelectProject,
  onAddProject,
}: WorkspaceHomeProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRepo, setNewRepo] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPlatform, setNewPlatform] = useState("Vercel (Free)");

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newRepo) {
      alert("Please provide a project name and repository path.");
      return;
    }

    const defaultBranches: Branch[] = [
      {
        name: "main",
        commitMsg: "feat: initial commit with http://arena.ai/agents workspace configs",
        author: "www.Linacre.site",
        updatedAt: new Date().toISOString().replace("T", " ").slice(0, 16),
        testStatus: "idle",
      },
      {
        name: "dev",
        commitMsg: "chore: bootstrap dev environmental parameters",
        author: "www.Linacre.site",
        updatedAt: new Date().toISOString().replace("T", " ").slice(0, 16),
        testStatus: "idle",
      },
    ];

    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: newName,
      repoName: newRepo,
      description: newDesc || "Custom http://arena.ai/agents deployment instance.",
      gitSynced: true,
      branches: defaultBranches,
      activeBranch: "main",
      targetPlatform: newPlatform,
      healthScore: 100,
      cpuThreshold: 80,
      memoryThreshold: 85,
    };

    onAddProject(newProj);
    
    // Reset form
    setNewName("");
    setNewRepo("");
    setNewDesc("");
    setShowAddForm(false);
  };

  // Statistics
  const totalProjects = projects.length;
  const activeSyncedCount = projects.filter((p) => p.gitSynced).length;
  const avgHealth = Math.round(
    projects.reduce((sum, p) => sum + p.healthScore, 0) / totalProjects
  );

  return (
    <div className="space-y-6" id="workspace-home-panel">
      {/* Dynamic Statistics Hub */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="stats-grid">
        {/* Stat 1 */}
        <div className="p-4 rounded-xl glass-panel relative overflow-hidden flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase font-bold block font-display">
              Arena Projects
            </span>
            <span className="text-2xl font-bold font-display text-white mt-1 block">
              {totalProjects}
            </span>
            <span className="text-[10px] text-zinc-500 block mt-0.5">Connected targets</span>
          </div>
          <LayoutGrid className="h-8 w-8 text-indigo-500/40 shrink-0" />
        </div>

        {/* Stat 2 */}
        <div className="p-4 rounded-xl glass-panel relative overflow-hidden flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase font-bold block font-display">
              Git Synchronized
            </span>
            <span className="text-2xl font-bold font-display text-emerald-400 mt-1 block">
              {activeSyncedCount}
            </span>
            <span className="text-[10px] text-zinc-500 block mt-0.5">Automated webhooks active</span>
          </div>
          <GitPullRequest className="h-8 w-8 text-emerald-500/40 shrink-0" />
        </div>

        {/* Stat 3 */}
        <div className="p-4 rounded-xl glass-panel relative overflow-hidden flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase font-bold block font-display">
              Avg Health Score
            </span>
            <span className="text-2xl font-bold font-display text-cyan-400 mt-1 block">
              {avgHealth}%
            </span>
            <span className="text-[10px] text-zinc-500 block mt-0.5">Optimal performance</span>
          </div>
          <TrendingUp className="h-8 w-8 text-cyan-500/40 shrink-0" />
        </div>

        {/* Stat 4 */}
        <div className="p-4 rounded-xl glass-panel relative overflow-hidden flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase font-bold block font-display">
              Deployment Pricing
            </span>
            <span className="text-2xl font-bold font-display text-emerald-400 mt-1 block font-mono">
              £0.00
            </span>
            <span className="text-[10px] text-zinc-500 block mt-0.5">Guaranteed free tiers</span>
          </div>
          <Activity className="h-8 w-8 text-emerald-500/40 shrink-0" />
        </div>
      </div>

      {/* Main Grid: Projects cards and Onboarding */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="projects-main-layout">
        {/* Left column: Projects list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold text-white font-display flex items-center gap-1.5">
              <FolderGit2 className="h-5 w-5 text-indigo-400" />
              Connected Project Workspaces
            </h3>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 transition text-white font-semibold text-xs rounded-lg flex items-center gap-1 shadow"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              Connect Project
            </button>
          </div>

          {/* Add project form */}
          {showAddForm && (
            <form
              onSubmit={handleCreateProject}
              className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20 space-y-4 animate-fadeIn"
              id="add-project-form"
            >
              <h4 className="text-xs font-bold text-indigo-300 uppercase font-display">
                Onboard New Arena.ai (http://arena.ai/agents) Project
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-semibold uppercase font-display">
                    Project Display Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., E-Commerce Gateway"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg glass-input focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-semibold uppercase font-display">
                    GitHub Slug
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="username/repository"
                    value={newRepo}
                    onChange={(e) => setNewRepo(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg glass-input focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 font-semibold uppercase font-display">
                  Project Description
                </label>
                <textarea
                  placeholder="Summarize what this Arena.ai project does..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg glass-input focus:ring-1 focus:ring-indigo-500 h-16 resize-none"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-2">
                  <label className="text-[10px] text-zinc-400 font-semibold uppercase font-display shrink-0">
                    Host:
                  </label>
                  <select
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                    className="px-2 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Vercel (Free)">Vercel (Free)</option>
                    <option value="Netlify (Free)">Netlify (Free)</option>
                    <option value="GitHub Pages (Free)">GitHub Pages (Free)</option>
                    <option value="Render (Free)">Render (Free)</option>
                    <option value="Cloud Run (Free tier)">Cloud Run (Free tier)</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 hover:bg-zinc-800 rounded-lg text-xs font-semibold text-zinc-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition shadow"
                  >
                    Confirm Connection
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Project Cards List */}
          <div className="space-y-4" id="project-cards-list">
            {projects.map((p) => {
              const isActive = p.id === activeProjectId;
              const passingBranchesCount = p.branches.filter((b) => b.testStatus === "passed").length;
              
              return (
                <div
                  key={p.id}
                  onClick={() => onSelectProject(p.id)}
                  className={`p-4 sm:p-5 rounded-xl glass-panel glass-panel-hover text-left cursor-pointer transition relative overflow-hidden border ${
                    isActive
                      ? "border-indigo-500/60 shadow-[0_0_20px_rgba(99,102,241,0.15)] bg-zinc-900/50"
                      : "border-zinc-800/60"
                  }`}
                >
                  {/* Active highlight side band */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-white font-display">
                          {p.name}
                        </h4>
                        <span className="px-2 py-0.5 text-[9px] font-semibold rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/60 font-mono">
                          {p.targetPlatform}
                        </span>
                      </div>
                      <p className="font-mono text-[10px] text-zinc-500 mt-1">{p.repoName}</p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {/* Health Score Pill */}
                      <div className="text-right">
                        <span className="text-[10px] text-zinc-500 block uppercase font-display font-semibold">Health Score</span>
                        <span className={`text-sm font-bold font-mono ${p.healthScore >= 95 ? "text-emerald-400" : "text-amber-400"}`}>
                          {p.healthScore}%
                        </span>
                      </div>

                      {/* Passing indicator */}
                      <div className="text-right">
                        <span className="text-[10px] text-zinc-500 block uppercase font-display font-semibold">Branch Test Quota</span>
                        <span className="text-xs font-mono text-zinc-300 font-semibold">
                          {passingBranchesCount} / {p.branches.length} passed
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 mt-3.5 leading-relaxed line-clamp-2">
                    {p.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 mt-4 border-t border-zinc-800/80 text-[10px] text-zinc-500">
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Continuous Integration Webhook Live
                    </span>
                    <span className="font-mono uppercase font-semibold text-[9px] bg-zinc-950/60 border border-zinc-800/80 px-2 py-0.5 rounded">
                      Configured for free
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Arena.ai integration onboarding & checklist */}
        <div className="lg:col-span-1 p-4 sm:p-5 rounded-xl glass-panel space-y-4">
          <div className="flex items-center gap-1.5 text-indigo-400 font-semibold text-xs border-b border-zinc-800 pb-3">
            <Compass className="h-4.5 w-4.5" />
            <span className="font-display">Arena.ai Advisor (http://arena.ai/agents)</span>
          </div>

          <h4 className="text-sm font-semibold text-white font-display">Onboarding Integration Checklist</h4>
          <p className="text-xs text-zinc-400 leading-normal">
            Bootstrap full deployment permissions in production environments with zero expenditure by completing these five core configuration actions:
          </p>

          <div className="space-y-3 pt-1">
            <div className="flex gap-3 text-xs">
              <span className="h-5 w-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                ✓
              </span>
              <div>
                <span className="font-semibold text-zinc-200 block">Link Arena.ai to GitHub</span>
                <span className="text-zinc-500 text-[11px]">Install Arena sync webhook inside repository settings.</span>
              </div>
            </div>

            <div className="flex gap-3 text-xs">
              <span className="h-5 w-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                ✓
              </span>
              <div>
                <span className="font-semibold text-zinc-200 block">Deploy Automated Testing Suite</span>
                <span className="text-zinc-500 text-[11px]">Integrate Jest, Playwright, or Mocha tests inside branch actions.</span>
              </div>
            </div>

            <div className="flex gap-3 text-xs">
              <span className="h-5 w-5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                3
              </span>
              <div>
                <span className="font-semibold text-zinc-200 block">Configure Deployment Secret Keys</span>
                <span className="text-zinc-500 text-[11px]">Securely save Vercel/Render tokens inside GitHub repository secrets.</span>
              </div>
            </div>

            <div className="flex gap-3 text-xs">
              <span className="h-5 w-5 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-500 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                4
              </span>
              <div>
                <span className="font-semibold text-zinc-200 block">Set Up Performance Dashboards</span>
                <span className="text-zinc-500 text-[11px]">Siphon container system logs directly into standard charting metrics.</span>
              </div>
            </div>

            <div className="flex gap-3 text-xs">
              <span className="h-5 w-5 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-500 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                5
              </span>
              <div>
                <span className="font-semibold text-zinc-200 block">Compile Secure Local Backup Routines</span>
                <span className="text-zinc-500 text-[11px]">Set automated daily cron procedures to pack encrypted files.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
