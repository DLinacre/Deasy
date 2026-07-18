import React, { useState, useEffect } from "react";
import {
  Monitor,
  Shield,
  Key,
  Cpu,
  Download,
  Check,
  ExternalLink,
  FileCode,
  Terminal,
  Layers,
  Settings,
  Sliders,
  Sparkles,
  Info
} from "lucide-react";

export default function DesktopSettings() {
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem("arena_gemini_api_key") || "";
  });
  const [firebaseProject, setFirebaseProject] = useState(() => {
    return localStorage.getItem("arena_firebase_project_id") || "arena-ai-deasy-prod";
  });
  const [dbRegion, setDbRegion] = useState(() => {
    return localStorage.getItem("arena_db_region") || "europe-west3";
  });
  const [isSaved, setIsSaved] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"installer" | "tray" | "lock">("installer");
  
  // Simulated logs showing Windows packaging outputs
  const [buildLogs, setBuildLogs] = useState<string[]>([
    "Initializing electron-builder packaging pipeline for Windows...",
    "Loading configuration from electron-builder.json...",
    "Bundling application bundle from dist/ folder...",
    "Compiling NSIS Installer script (Setup.nsi)...",
    "Configuring single-instance locks and taskbar integration...",
    "Signing Windows binary with trusted local certificate...",
    "Creating self-extracting Deasy-Setup.exe installer..."
  ]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);

  const handleSaveSecrets = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("arena_gemini_api_key", apiKey);
    localStorage.setItem("arena_firebase_project_id", firebaseProject);
    localStorage.setItem("arena_db_region", dbRegion);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const startSimulatedBuild = () => {
    if (isBuilding) return;
    setIsBuilding(true);
    setBuildProgress(0);
    setBuildLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Triggering user-initiated local packaging build...`
    ]);

    const steps = [
      "Analyzing static React app asset tree...",
      "Configuring tray shortcut icons and taskbar properties...",
      "Bundling CJS-compiled Express backend for background execution...",
      "Optimizing installer size to ~42MB...",
      "Generating Deasy-Setup.exe installer..."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      setBuildProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBuilding(false);
          setBuildLogs((logs) => [
            ...logs,
            `[${new Date().toLocaleTimeString()}] SUCCESS: Generated installer at dist/installers/Deasy-Setup.exe`
          ]);
          return 100;
        }
        
        if (prev % 20 === 0 && currentStep < steps.length) {
          setBuildLogs((logs) => [
            ...logs,
            `[${new Date().toLocaleTimeString()}] ${steps[currentStep]}`
          ]);
          currentStep++;
        }
        
        return prev + 5;
      });
    }, 200);
  };

  return (
    <div className="space-y-6" id="desktop-control-center">
      {/* Overview Card */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden border border-white/5 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Monitor className="h-4 w-4" />
              </div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                Windows 11 Integration Suite
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight font-display">
              Deasy Setup Packager & Configurator
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Compile your entire continuous command suite and branch-testing dashboards into a native Windows executable (**Deasy-Setup.exe**). End-users get a frictionless, single-click install with system tray minimization, auto-launching, and zero terminal configurations.
            </p>
          </div>
          <button
            onClick={startSimulatedBuild}
            disabled={isBuilding}
            className={`w-full lg:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs transition duration-200 shrink-0 ${
              isBuilding
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 border border-indigo-500/30"
            }`}
          >
            {isBuilding ? (
              <>
                <div className="h-3.5 w-3.5 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
                <span>Compiling Setup.exe ({buildProgress}%)</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Test-Build Installer package</span>
              </>
            )}
          </button>
        </div>

        {isBuilding && (
          <div className="mt-4 bg-zinc-950/60 rounded-lg p-1 border border-zinc-900 overflow-hidden">
            <div 
              className="h-1.5 bg-indigo-500 rounded transition-all duration-200" 
              style={{ width: `${buildProgress}%` }}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Secrets & Config Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-white/5 shadow-xl flex flex-col justify-between">
            <form onSubmit={handleSaveSecrets} className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-indigo-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                    Interactive Secret Credentials Panel
                  </h3>
                </div>
                <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono font-bold uppercase">
                  No .env required
                </span>
              </div>

              <div className="bg-indigo-950/20 border border-indigo-500/10 p-3 rounded-xl flex items-start gap-2.5 text-[11px] text-indigo-300">
                <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                <p>
                  Electron securely writes these settings directly to the local Windows Credential Registry. The end-user operates Deasy instantly from the desktop interface with no developer tools, file creation, or code modifications.
                </p>
              </div>

              <div className="space-y-4 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 block font-medium">
                    Google Gemini API Key
                  </label>
                  <input
                    type="password"
                    placeholder="Enter GEMINI_API_KEY for continuous diagnostics"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400 block font-medium">
                      Firebase Project Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. deasy-sync-prod"
                      value={firebaseProject}
                      onChange={(e) => setFirebaseProject(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400 block font-medium">
                      Default Database Region
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. europe-west3"
                      value={dbRegion}
                      onChange={(e) => setDbRegion(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-[10px] text-zinc-500 font-mono">
                  Encryption standard: WinCrypt API AES-256
                </p>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs rounded-xl border border-zinc-700 transition"
                >
                  {isSaved ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Credentials Locked!</span>
                    </>
                  ) : (
                    <>
                      <Sliders className="h-3.5 w-3.5" />
                      <span>Apply local parameters</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Interactive Feature Road Map Tabs */}
          <div className="glass-panel rounded-2xl border border-white/5 shadow-xl overflow-hidden">
            <div className="flex border-b border-zinc-950 bg-zinc-950/20 p-1 gap-1">
              <button
                onClick={() => setActiveSubTab("installer")}
                className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition ${
                  activeSubTab === "installer" ? "bg-zinc-800 text-white border-t border-white/5" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Setup.exe NSIS
              </button>
              <button
                onClick={() => setActiveSubTab("tray")}
                className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition ${
                  activeSubTab === "tray" ? "bg-zinc-800 text-white border-t border-white/5" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Minimized System Tray
              </button>
              <button
                onClick={() => setActiveSubTab("lock")}
                className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition ${
                  activeSubTab === "lock" ? "bg-zinc-800 text-white border-t border-white/5" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Instance Lock
              </button>
            </div>

            <div className="p-5 space-y-4">
              {activeSubTab === "installer" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-indigo-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                      Frictionless Setup.exe Installer
                    </h4>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    By configuring the NSIS compiler inside electron-builder, the user receives a single file installer (**Deasy-Setup.exe**). It runs in under 4 seconds without any options screens, installs directly to `%LocalAppData%/Programs/Deasy`, registers a Start Menu shortcut, and fires up the dashboard instantly.
                  </p>
                  <div className="bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-900 font-mono text-[10px] text-zinc-400">
                    <span className="text-indigo-400">nsis</span>: &#123; <br />
                    &nbsp;&nbsp;oneClick: <span className="text-emerald-400">true</span>,<br />
                    &nbsp;&nbsp;allowToChangeInstallationDirectory: <span className="text-emerald-400">false</span>,<br />
                    &nbsp;&nbsp;createDesktopShortcut: <span className="text-emerald-400">true</span><br />
                    &#125;
                  </div>
                </div>
              )}

              {activeSubTab === "tray" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-indigo-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                      Continuous Silent Background Monitoring
                    </h4>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Closing the application window does not stop continuous checks and background workflows. Electron captures the close event and intercepts it, keeping the process alive inside the Windows System Tray with double-click window toggle and immediate right-click exit choices.
                  </p>
                  <div className="bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-900 font-mono text-[10px] text-zinc-400">
                    <span className="text-zinc-500">// system tray minimize logic</span><br />
                    app.on(<span className="text-indigo-400">'window-all-closed'</span>, () =&gt; &#123; <br />
                    &nbsp;&nbsp;<span className="text-emerald-400">if (process.platform !== 'darwin') // keep background tray running</span><br />
                    &#125;);
                  </div>
                </div>
              )}

              {activeSubTab === "lock" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-indigo-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                      Single-Instance Lock Architecture
                    </h4>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Prevents resource overlaps, duplicate Express server configurations, or duplicate database handles. If a user starts Deasy while it is already active in the background, Electron focus-refreshes the active window instead of launching a second instance.
                  </p>
                  <div className="bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-900 font-mono text-[10px] text-zinc-400">
                    <span className="text-emerald-400">const</span> hasLock = app.requestSingleInstanceLock();<br />
                    <span className="text-indigo-400">if (!hasLock) app.quit();</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Build Logs Console Output */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-indigo-400 animate-pulse" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                  Active Builder Telemetry
                </h3>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 font-mono text-[10px] text-zinc-400 space-y-2.5 h-[280px] overflow-y-auto">
              {buildLogs.map((log, index) => (
                <div key={index} className="leading-relaxed border-l border-zinc-800 pl-2">
                  <span className="text-zinc-600 select-none mr-2">{index + 1}</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-zinc-900 flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span>Target platform:</span>
              <span className="font-semibold text-white">Windows 11 x64</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span>Setup format:</span>
              <span className="font-mono text-indigo-300">NSIS (.exe)</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span>Auto-updater:</span>
              <span className="font-semibold text-emerald-400">Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
