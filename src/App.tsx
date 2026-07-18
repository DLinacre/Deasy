import React, { useState, useEffect } from "react";
import {
  FolderGit2,
  Github,
  Cpu,
  Users,
  Lock,
  Calculator,
  Clock,
  Sparkles,
  Smartphone,
  ChevronDown,
  Activity,
  Server,
  Heart,
  Chrome,
  LogOut,
  Check,
  ListTodo,
  GitBranch,
  Globe,
  Monitor,
} from "lucide-react";
import { Project, TeamMember, BackupLog, GoogleProfile } from "./types";
import {
  INITIAL_PROJECTS,
  INITIAL_TEAM,
  INITIAL_BACKUPS,
} from "./data";

import WorkspaceHome from "./components/WorkspaceHome";
import GitHubSync from "./components/GitHubSync";
import DeployPipeline from "./components/DeployPipeline";
import PerformanceDashboard from "./components/PerformanceDashboard";
import TeamBackupManager from "./components/TeamBackupManager";
import BudgetTimelineCalculator from "./components/BudgetTimelineCalculator";
import GoogleLoginModal from "./components/GoogleLoginModal";
import TasksChatSync from "./components/TasksChatSync";
import GeminiCopilotConsole from "./components/GeminiCopilotConsole";
import DesktopSettings from "./components/DesktopSettings";

type TabId =
  | "workspaces"
  | "github"
  | "cicd"
  | "monitor"
  | "team"
  | "budget"
  | "tasks_chat"
  | "gemini_copilot"
  | "desktop";

export default function App() {
  // State load / persistence from LocalStorage
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem("arena_projects");
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    const saved = localStorage.getItem("arena_active_project_id");
    return saved ? saved : (INITIAL_PROJECTS[0]?.id || "");
  });

  const [team, setTeam] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem("arena_team");
    return saved ? JSON.parse(saved) : INITIAL_TEAM;
  });

  const [backups, setBackups] = useState<BackupLog[]>(() => {
    const saved = localStorage.getItem("arena_backups");
    return saved ? JSON.parse(saved) : INITIAL_BACKUPS;
  });

  const [activeTab, setActiveTab] = useState<TabId>("workspaces");
  const [currentTime, setCurrentTime] = useState("");

  // Google OAuth User Profile States
  const [googleUser, setGoogleUser] = useState<GoogleProfile | null>(() => {
    const saved = localStorage.getItem("arena_google_profile");
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Aggregated live performance metrics for each project
  const [projectMetrics, setProjectMetrics] = useState<Record<string, { cpu: number; memory: number; latency: number; requests: number }>>(() => {
    return {
      "proj-1": { cpu: 42, memory: 65, latency: 124, requests: 12 },
      "proj-2": { cpu: 31, memory: 58, latency: 98, requests: 6 }
    };
  });

  // Telemetry real-time update engine for all projects
  useEffect(() => {
    const interval = setInterval(() => {
      setProjectMetrics((prev) => {
        const next: Record<string, { cpu: number; memory: number; latency: number; requests: number }> = {};
        projects.forEach((p) => {
          const baseCpu = p.id === "proj-1" ? 42 : 31;
          const baseMemory = p.id === "proj-1" ? 64 : 58;
          const baseLatency = p.id === "proj-1" ? 122 : 96;
          const baseRequests = p.id === "proj-1" ? 13 : 7;

          next[p.id] = {
            cpu: Math.min(100, Math.max(5, Math.floor(baseCpu + (Math.random() * 16 - 8)))),
            memory: Math.min(100, Math.max(5, Math.floor(baseMemory + (Math.random() * 4 - 2)))),
            latency: Math.max(10, Math.floor(baseLatency + (Math.random() * 40 - 20))),
            requests: Math.max(0, Math.floor(baseRequests + (Math.random() * 6 - 3)))
          };
        });
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [projects]);

  // Compute aggregated system load and metrics
  const metricsArray = Object.values(projectMetrics) as Array<{ cpu: number; memory: number; latency: number; requests: number }>;
  const avgCpu = metricsArray.length > 0 ? Math.round(metricsArray.reduce((sum: number, m) => sum + m.cpu, 0) / metricsArray.length) : 36;
  const avgMemory = metricsArray.length > 0 ? Math.round(metricsArray.reduce((sum: number, m) => sum + m.memory, 0) / metricsArray.length) : 61;
  const avgLatency = metricsArray.length > 0 ? Math.round(metricsArray.reduce((sum: number, m) => sum + m.latency, 0) / metricsArray.length) : 109;
  const totalRequests = metricsArray.reduce((sum: number, m) => sum + m.requests, 0);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem("arena_projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("arena_active_project_id", activeProjectId);
  }, [activeProjectId]);

  useEffect(() => {
    localStorage.setItem("arena_team", JSON.stringify(team));
  }, [team]);

  useEffect(() => {
    localStorage.setItem("arena_backups", JSON.stringify(backups));
  }, [backups]);

  useEffect(() => {
    if (googleUser) {
      localStorage.setItem("arena_google_profile", JSON.stringify(googleUser));
    } else {
      localStorage.removeItem("arena_google_profile");
    }
  }, [googleUser]);

  // Real-time clock tick
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  // Callbacks to manipulate local state safely
  const handleSelectProject = (id: string) => {
    setActiveProjectId(id);
  };

  const handleAddProject = (newProj: Project) => {
    setProjects((prev) => [newProj, ...prev]);
    setActiveProjectId(newProj.id);
  };

  const handleUpdatePlatform = (pName: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === activeProjectId ? { ...p, targetPlatform: pName } : p))
    );
  };

  const handleUpdateHealthScore = (score: number) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === activeProjectId ? { ...p, healthScore: score } : p))
    );
  };

  const handleUpdateThresholds = (cpu: number, ram: number) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProjectId ? { ...p, cpuThreshold: cpu, memoryThreshold: ram } : p
      )
    );
  };

  const handleAddTeammate = (newMember: TeamMember) => {
    setTeam((prev) => [newMember, ...prev]);
  };

  const handleRemoveTeammate = (id: string) => {
    setTeam((prev) => prev.filter((m) => m.id !== id));
  };

  const handleTriggerBackup = (newBackup: BackupLog) => {
    setBackups((prev) => [newBackup, ...prev]);
  };

  const handleRunTestOnBranch = (branchName: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== activeProjectId) return p;
        const updatedBranches = p.branches.map((b) => {
          if (b.name !== branchName) return b;
          
          // Determine status: feature/auth-refresh always fails initially, dev passes, etc.
          let nextStatus: "passed" | "failed" = "passed";
          let logs = "PASS  src/tests/router.test.ts\nPASS  src/tests/auth.test.ts\nPASS  src/tests/database.test.ts\n\nTest Suites: 3 passed, 3 total\nTests:       48 passed, 48 total\nTime:        12.1s";
          let metrics = { passed: 48, failed: 0, skipped: 2, duration: "12.1s" };

          if (branchName.includes("auth-refresh")) {
            nextStatus = "failed";
            metrics = { passed: 32, failed: 4, skipped: 12, duration: "8.7s" };
            logs = `FAIL  src/tests/auth.test.ts\n  ● Authentication Service › verifySession() should rotate expired JWT secure tokens\n\n    TypeError: Cannot read properties of undefined (reading 'split')\n\n      at Object.verifySession (src/services/auth.ts:143:35)\n      at Object.<anonymous> (src/tests/auth.test.ts:42:24)\n\nTest Suites: 1 failed, 2 passed, 3 total\nTests:       4 failed, 32 passed, 12 skipped, 48 total\nTime:        8.7s`;
          } else if (branchName.includes("backups")) {
            nextStatus = "failed";
            metrics = { passed: 8, failed: 2, skipped: 5, duration: "6.2s" };
            logs = `FAIL  src/tests/backup.test.tsx\n  ● Encrypted Backup Engine › triggerBackupZip() should encrypt schema database entries\n\n    Error: crypto.subtle is undefined in non-secure local environment contexts\n\n      at EncryptedBackupEngine.encrypt (src/utils/crypto.ts:18:24)\n\nTest Suites: 1 failed, 1 passed, 2 total\nTests:       2 failed, 8 passed, 5 skipped, 15 total\nTime:        6.2s`;
          }

          return {
            ...b,
            testStatus: nextStatus,
            testLogs: logs,
            testMetrics: metrics,
            updatedAt: new Date().toISOString().replace("T", " ").slice(0, 16),
          };
        });
        return { ...p, branches: updatedBranches };
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#07080b] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.12),rgba(255,255,255,0))] text-zinc-100 selection:bg-indigo-500/30 selection:text-white flex flex-col items-center p-3 sm:p-6">
      
      {/* Device container: Frameless web dashboard styled with high-end dark glassmorphism */}
      <div className="w-full max-w-7xl flex flex-col flex-1 space-y-6" id="console-device-frame">
        
        {/* Top Operational Status Bar */}
        <header className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl relative overflow-hidden">
          {/* Subtle neon decor line */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.15)] shrink-0 animate-pulse">
              <Smartphone className="h-5 w-5 text-indigo-400" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight font-display">
                  Deasy by Linacre
                </h1>
                <span className="px-2 py-0.5 text-[9px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full">
                  v1.1.0
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 font-sans">
                Continuous Command Suite & Branch Desktop Manager (www.Linacre.site)
              </p>
            </div>
          </div>

          {/* Telemetry metadata block */}
          <div className="flex items-center flex-wrap gap-4 text-xs">
            {/* Google Authentication Control */}
            {googleUser ? (
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-950/60 border border-zinc-800/80 text-zinc-300">
                <img
                  src={googleUser.picture}
                  alt={googleUser.name}
                  className="h-5 w-5 rounded-full border border-emerald-500/50 bg-zinc-800"
                  referrerPolicy="no-referrer"
                />
                <div className="hidden sm:block text-left text-[10px]">
                  <span className="font-semibold block leading-tight text-white">{googleUser.name}</span>
                  <span className="text-[8px] text-emerald-400 block font-mono leading-none flex items-center gap-0.5">
                    <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse"></span>
                    Google Connected
                  </span>
                </div>
                <button
                  onClick={() => setGoogleUser(null)}
                  title="Disconnect Google Account"
                  className="p-1 hover:bg-zinc-900 rounded text-zinc-500 hover:text-red-400 transition ml-1"
                >
                  <LogOut className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-[11px] shadow-lg shadow-indigo-500/15 border border-indigo-500/30 transition duration-200"
              >
                <Chrome className="h-3.5 w-3.5" />
                <span>Google Sign-In</span>
              </button>
            )}

            {/* Clock */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-950/60 border border-zinc-900/60 font-mono text-zinc-300 text-[11px]">
              <Clock className="h-3.5 w-3.5 text-zinc-500" />
              <span>{currentTime || "10:20:54"}</span>
            </div>

            {/* Active Project Dropdown */}
            {activeProject && (
              <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/25 border border-indigo-500/20 font-sans text-[11px] text-indigo-300">
                <span className="font-semibold uppercase tracking-wider text-[9px] text-indigo-400">Project:</span>
                <span className="font-medium max-w-[120px] truncate">{activeProject.name}</span>
                <select
                  value={activeProjectId}
                  onChange={(e) => handleSelectProject(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id} className="bg-zinc-950 text-white text-xs">
                      {p.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-3 w-3 text-indigo-400 shrink-0" />
              </div>
            )}
          </div>
        </header>

        {/* Aggregated Real-Time Console Telemetry Hub */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="aggregated-telemetry-hub">
          {/* Column 1: Active Deployments */}
          <div className="glass-panel p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between border-t border-white/5 shadow-lg group hover:border-indigo-500/30 transition duration-300">
            {/* Ambient subtle gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />
            
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider font-sans block">
                  Active Services & Deployments
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-display text-white">
                    {projects.filter(p => p.gitSynced).length} / {projects.length} Live
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    100% Up
                  </span>
                </div>
              </div>
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Globe className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-3.5 pt-3 border-t border-zinc-900/60 flex flex-col gap-1.5 text-[11px]">
              <div className="flex items-center justify-between text-zinc-400">
                <span>Total Project Workspaces</span>
                <span className="font-semibold text-zinc-200">{projects.length} loaded</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Targets</span>
                <span className="font-mono text-[10px] text-indigo-300 max-w-[150px] truncate">
                  {Array.from(new Set(projects.map(p => p.targetPlatform.split(' ')[0]))).join(', ')}
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Branch & Testing Status */}
          <div className="glass-panel p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between border-t border-white/5 shadow-lg group hover:border-indigo-500/30 transition duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />
            
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider font-sans block">
                  GitHub Branch Suite Status
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-display text-white">
                    {projects.reduce((sum, p) => sum + p.branches.filter(b => b.testStatus === 'passed').length, 0)} / {projects.reduce((sum, p) => sum + p.branches.length, 0)} Passing
                  </span>
                  {projects.reduce((sum, p) => sum + p.branches.filter(b => b.testStatus === 'failed').length, 0) > 0 ? (
                    <span className="text-[10px] px-1.5 py-0.5 bg-red-500/10 text-red-400 border border-red-500/25 rounded font-mono font-bold uppercase animate-pulse">
                      {projects.reduce((sum, p) => sum + p.branches.filter(b => b.testStatus === 'failed').length, 0)} Fails
                    </span>
                  ) : (
                    <span className="text-[11px] text-emerald-400 font-mono font-medium">All Clean</span>
                  )}
                </div>
              </div>
              <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <GitBranch className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-3.5 pt-3 border-t border-zinc-900/60 flex flex-col gap-1.5 text-[11px]">
              {projects.slice(0, 3).map((p) => {
                const activeB = p.branches.find(b => b.name === p.activeBranch) || p.branches[0];
                const isPassed = activeB?.testStatus === 'passed';
                const isFailed = activeB?.testStatus === 'failed';
                return (
                  <div key={p.id} className="flex items-center justify-between gap-2 text-zinc-400">
                    <span className="truncate max-w-[150px]" title={p.name}>{p.name}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-mono text-[10px] text-zinc-500 bg-zinc-950/60 px-1 py-0.5 rounded border border-zinc-900">
                        {p.activeBranch}
                      </span>
                      {isPassed && <span className="h-2 w-2 rounded-full bg-emerald-500" title="Tests passed" />}
                      {isFailed && <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" title="Tests failed" />}
                      {!isPassed && !isFailed && <span className="h-2 w-2 rounded-full bg-zinc-500" title="Idle/No metrics" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 3: Aggregated Resource Metrics */}
          <div className="glass-panel p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between border-t border-white/5 shadow-lg group hover:border-indigo-500/30 transition duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />
            
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider font-sans block">
                  Aggregated Cloud Cluster Load
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-display text-white">
                    {avgCpu}% <span className="text-xs font-normal text-zinc-500">avg CPU</span>
                  </span>
                  <span className="text-xs text-zinc-500">|</span>
                  <span className="text-xl font-bold font-display text-indigo-300">
                    {avgMemory}% <span className="text-xs font-normal text-zinc-500">avg RAM</span>
                  </span>
                </div>
              </div>
              <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Cpu className="h-4 w-4 animate-pulse" />
              </div>
            </div>

            <div className="mt-3.5 pt-3 border-t border-zinc-900/60 grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex flex-col">
                <span className="text-zinc-500 font-sans uppercase text-[8px] font-bold tracking-wider">Avg Latency</span>
                <span className="font-mono text-zinc-200 mt-0.5">{avgLatency} ms</span>
              </div>
              <div className="flex flex-col">
                <span className="text-zinc-500 font-sans uppercase text-[8px] font-bold tracking-wider">Total Request Rate</span>
                <span className="font-mono text-emerald-400 mt-0.5">{totalRequests} req/s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Nav Tabs - Scrollable on mobile & tablet viewports */}
        <nav className="glass-panel p-1 rounded-2xl flex overflow-x-auto scrollbar-none snap-x lg:flex-wrap gap-1 shadow-lg" id="console-tabs-navigation">
          <button
            onClick={() => setActiveTab("workspaces")}
            className={`flex-1 min-w-[100px] py-2.5 px-3 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === "workspaces"
                ? "bg-zinc-800 text-white shadow-md border-t border-white/5"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <FolderGit2 className="h-3.5 w-3.5" />
            <span>Workspaces</span>
          </button>

          <button
            onClick={() => setActiveTab("github")}
            className={`flex-1 min-w-[100px] py-2.5 px-3 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === "github"
                ? "bg-zinc-800 text-white shadow-md border-t border-white/5"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Github className="h-3.5 w-3.5" />
            <span>Branch Tests</span>
          </button>

          <button
            onClick={() => setActiveTab("cicd")}
            className={`flex-1 min-w-[100px] py-2.5 px-3 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === "cicd"
                ? "bg-zinc-800 text-white shadow-md border-t border-white/5"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Server className="h-3.5 w-3.5" />
            <span>Pipelines</span>
          </button>

          <button
            onClick={() => setActiveTab("monitor")}
            className={`flex-1 min-w-[100px] py-2.5 px-3 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === "monitor"
                ? "bg-zinc-800 text-white shadow-md border-t border-white/5"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Monitor</span>
          </button>

          <button
            onClick={() => setActiveTab("team")}
            className={`flex-1 min-w-[100px] py-2.5 px-3 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === "team"
                ? "bg-zinc-800 text-white shadow-md border-t border-white/5"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Access & Backups</span>
          </button>

          <button
            onClick={() => setActiveTab("budget")}
            className={`flex-1 min-w-[100px] py-2.5 px-3 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === "budget"
                ? "bg-zinc-800 text-white shadow-md border-t border-white/5"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Calculator className="h-3.5 w-3.5" />
            <span>£0 Planner</span>
          </button>

          <button
            onClick={() => setActiveTab("tasks_chat")}
            className={`flex-1 min-w-[100px] py-2.5 px-3 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === "tasks_chat"
                ? "bg-zinc-800 text-white shadow-md border-t border-white/5"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <ListTodo className="h-3.5 w-3.5" />
            <span>Tasks & Chat</span>
          </button>

          <button
            onClick={() => setActiveTab("gemini_copilot")}
            className={`flex-1 min-w-[100px] py-2.5 px-3 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === "gemini_copilot"
                ? "bg-zinc-800 text-white shadow-md border-t border-white/5"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>AI Co-Pilot</span>
          </button>

          <button
            onClick={() => setActiveTab("desktop")}
            className={`flex-1 min-w-[100px] py-2.5 px-3 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === "desktop"
                ? "bg-zinc-800 text-white shadow-md border-t border-white/5"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Monitor className="h-3.5 w-3.5 text-indigo-400" />
            <span>Desktop Setup</span>
          </button>
        </nav>

        {/* Tab Render Area */}
        <main className="flex-1 min-h-[500px]" id="console-main-rendering-viewport">
          {activeTab === "workspaces" && (
            <WorkspaceHome
              projects={projects}
              activeProjectId={activeProjectId}
              onSelectProject={handleSelectProject}
              onAddProject={handleAddProject}
            />
          )}

          {activeTab === "github" && activeProject && (
            <GitHubSync project={activeProject} onRunTest={handleRunTestOnBranch} />
          )}

          {activeTab === "cicd" && activeProject && (
            <DeployPipeline
              project={activeProject}
              onUpdatePlatform={handleUpdatePlatform}
              onUpdateHealthScore={handleUpdateHealthScore}
            />
          )}

          {activeTab === "monitor" && activeProject && (
            <PerformanceDashboard
              project={activeProject}
              onUpdateThresholds={handleUpdateThresholds}
            />
          )}

          {activeTab === "team" && (
            <TeamBackupManager
              team={team}
              backups={backups}
              onAddTeammate={handleAddTeammate}
              onRemoveTeammate={handleRemoveTeammate}
              onTriggerBackup={handleTriggerBackup}
            />
          )}

          {activeTab === "budget" && (
            <BudgetTimelineCalculator />
          )}

          {activeTab === "tasks_chat" && (
            <TasksChatSync />
          )}

          {activeTab === "gemini_copilot" && (
            <GeminiCopilotConsole activeProject={activeProject} />
          )}

          {activeTab === "desktop" && (
            <DesktopSettings />
          )}
        </main>

        {/* Footer info brand */}
        <footer className="pt-6 border-t border-zinc-900/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-3" id="applet-console-footer">
          <div className="flex items-center gap-1.5">
            <span>Built with</span>
            <Heart className="h-3 w-3 text-red-500 fill-red-500" />
            <span>for</span>
            <a
              href="https://linacre.site/projects"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition underline decoration-indigo-500/30"
              title="Visit Linacre Projects Portfolio"
            >
              www.Linacre.site/projects
            </a>
          </div>
          <div>
            <span>Arena.ai/agents Continuous Command Suite (http://arena.ai/agents) © 2026</span>
          </div>
        </footer>
      </div>

      {/* Google Sign-In Simulation Popup */}
      <GoogleLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={(profile) => {
          setGoogleUser(profile);
          setIsLoginModalOpen(false);
        }}
        defaultEmail="www.Linacre.site"
      />
    </div>
  );
}
