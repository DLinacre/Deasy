import React, { useState, useEffect } from "react";
import {
  ListTodo,
  MessageSquare,
  Chrome,
  LogOut,
  RefreshCw,
  Plus,
  Send,
  CheckCircle,
  AlertTriangle,
  Bell,
  Check,
  ChevronRight,
  ShieldAlert,
  HelpCircle,
  Clock,
  Loader2
} from "lucide-react";
import { auth, googleSignIn, googleSignOut } from "../lib/firebase";
import { collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../lib/firebase";
import { User } from "firebase/auth";

interface TaskList {
  id: string;
  title: string;
  updated: string;
}

interface TaskItem {
  id: string;
  title: string;
  notes?: string;
  status: "needsAction" | "completed";
  due?: string;
}

interface ChatSpace {
  name: string; // e.g., "spaces/ABC"
  displayName: string;
  type: string;
}

interface SyncHistoryLog {
  id?: string;
  timestamp: string;
  type: "tasks" | "chat";
  action: string;
  details: string;
  status: "success" | "failed";
}

export default function TasksChatSync() {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);

  // API State
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [selectedListId, setSelectedListId] = useState<string>("");
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  const [chatSpaces, setChatSpaces] = useState<ChatSpace[]>([]);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>("");
  const [isLoadingSpaces, setIsLoadingSpaces] = useState(false);

  // New item states
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskNotes, setNewTaskNotes] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const [chatMessageText, setChatMessageText] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Automation / Alert Settings State
  const [autoSyncOnFail, setAutoSyncOnFail] = useState(() => {
    return localStorage.getItem("arena_auto_sync_fail") === "true";
  });
  const [autoPostOnFail, setAutoPostOnFail] = useState(() => {
    return localStorage.getItem("arena_auto_post_fail") === "true";
  });

  // Firestore Sync History
  const [syncHistory, setSyncHistory] = useState<SyncHistoryLog[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Track Auth state on mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!isSimulated) {
        setCurrentUser(user);
        if (!user) {
          setAccessToken(null);
          setTaskLists([]);
          setTasks([]);
          setChatSpaces([]);
        }
      }
    });
    return () => unsubscribe();
  }, [isSimulated]);

  // Fetch data when credentials or simulated status are ready
  useEffect(() => {
    if (accessToken || isSimulated) {
      fetchTaskLists();
      fetchChatSpaces();
      fetchFirestoreHistory();
    }
  }, [accessToken, isSimulated]);

  // Keep alert settings in local storage
  useEffect(() => {
    localStorage.setItem("arena_auto_sync_fail", String(autoSyncOnFail));
  }, [autoSyncOnFail]);

  useEffect(() => {
    localStorage.setItem("arena_auto_post_fail", String(autoPostOnFail));
  }, [autoPostOnFail]);

  // Launch Simulated Developer Environment Fallback
  const handleStartSimulation = () => {
    setIsSimulated(true);
    setAccessToken("simulated-access-token-12345");
    setCurrentUser({
      displayName: "Simulated Developer",
      email: "arena-simulation@gmail.com",
      photoURL: "https://api.dicebear.com/7.x/bottts/svg?seed=SimulatedDev",
      uid: "simulated-user-123"
    });
  };

  // Auth Functions
  const handleConnect = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setIsSimulated(false);
        setAccessToken(result.accessToken);
        setCurrentUser(result.user);
      }
    } catch (error: any) {
      console.error("Google login failed:", error);
      const confirmSim = window.confirm(
        `OAuth connection handshake failed:\n${error?.message || "Popup was blocked or Google OAuth credentials aren't configured yet."}\n\nWould you like to load the interactive Offline Integration Simulator to test Google Tasks and Google Chat features with mock telemetry?`
      );
      if (confirmSim) {
        handleStartSimulation();
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleDisconnect = async () => {
    if (isSimulated) {
      setIsSimulated(false);
      setAccessToken(null);
      setCurrentUser(null);
      setTaskLists([]);
      setTasks([]);
      setChatSpaces([]);
      return;
    }
    await googleSignOut();
    setAccessToken(null);
    setCurrentUser(null);
  };

  // Google Tasks API calls
  const fetchTaskLists = async () => {
    if (isSimulated) {
      const simLists = [
        { id: "sim-list-1", title: "🎯 Major Releases v1.0.0", updated: new Date().toISOString() },
        { id: "sim-list-2", title: "🐞 High Priority Bug Backlog", updated: new Date().toISOString() }
      ];
      setTaskLists(simLists);
      setSelectedListId("sim-list-1");
      return;
    }

    if (!accessToken) return;
    try {
      const res = await fetch("https://tasks.googleapis.com/tasks/v1/users/@me/lists", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTaskLists(data.items || []);
        if (data.items && data.items.length > 0) {
          setSelectedListId(data.items[0].id);
        }
      } else {
        console.error("Failed to fetch task lists:", await res.text());
      }
    } catch (e) {
      console.error("Error fetching task lists:", e);
    }
  };

  const fetchTasksInList = async (listId: string) => {
    if (isSimulated) {
      setIsLoadingTasks(true);
      setTimeout(() => {
        const storedSimTasks = localStorage.getItem(`sim_tasks_${listId}`);
        if (storedSimTasks) {
          setTasks(JSON.parse(storedSimTasks));
        } else {
          const defaultTasks: TaskItem[] = listId === "sim-list-1" ? [
            { id: "sim-task-1", title: "Verify £0.00 scale-to-zero settings in firebase.json", notes: "Ensure the platform stays within the free tier budget", status: "completed", due: "2026-07-18" },
            { id: "sim-task-2", title: "Test branch auth-refresh continuous integration APK build", notes: "Check that the debug build outputs correctly", status: "needsAction", due: "2026-07-20" }
          ] : [
            { id: "sim-task-3", title: "Fix auth-refresh memory leak in production containers", notes: "High priority memory footprint fix", status: "needsAction" }
          ];
          localStorage.setItem(`sim_tasks_${listId}`, JSON.stringify(defaultTasks));
          setTasks(defaultTasks);
        }
        setIsLoadingTasks(false);
      }, 300);
      return;
    }

    if (!accessToken || !listId) return;
    setIsLoadingTasks(true);
    try {
      const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data.items || []);
      } else {
        console.error("Failed to fetch tasks:", await res.text());
      }
    } catch (e) {
      console.error("Error fetching tasks:", e);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  useEffect(() => {
    if (selectedListId) {
      fetchTasksInList(selectedListId);
    }
  }, [selectedListId, accessToken, isSimulated]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    // Critical Guideline: Present explicit confirmation dialog for mutating data
    const confirmed = window.confirm(
      `Confirm Workspace Action:\n\nDo you want to create the task "${newTaskTitle}" in your Google Tasks account?`
    );
    if (!confirmed) return;

    if (isSimulated) {
      setIsCreatingTask(true);
      setTimeout(async () => {
        const newTask: TaskItem = {
          id: `sim-task-${Date.now()}`,
          title: newTaskTitle,
          notes: newTaskNotes || undefined,
          status: "needsAction",
          due: newTaskDueDate || undefined
        };
        const updatedTasks = [newTask, ...tasks];
        setTasks(updatedTasks);
        localStorage.setItem(`sim_tasks_${selectedListId}`, JSON.stringify(updatedTasks));
        
        setNewTaskTitle("");
        setNewTaskNotes("");
        setNewTaskDueDate("");
        setIsCreatingTask(false);

        await logToFirestore({
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
          type: "tasks",
          action: "Task Created (Simulated)",
          details: `Created simulated task "${newTask.title}"`,
          status: "success",
        });
      }, 300);
      return;
    }

    if (!accessToken || !selectedListId) return;
    setIsCreatingTask(true);
    try {
      const taskBody: any = {
        title: newTaskTitle,
        notes: newTaskNotes || undefined,
      };
      if (newTaskDueDate) {
        taskBody.due = new Date(newTaskDueDate).toISOString();
      }

      const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${selectedListId}/tasks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskBody),
      });

      if (res.ok) {
        const created = await res.json();
        setTasks((prev) => [created, ...prev]);
        setNewTaskTitle("");
        setNewTaskNotes("");
        setNewTaskDueDate("");

        // Log to Firestore sync history
        await logToFirestore({
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
          type: "tasks",
          action: "Task Created",
          details: `Created task "${taskBody.title}"`,
          status: "success",
        });
      } else {
        alert("Failed to create task in Google Tasks. Check permissions.");
      }
    } catch (err) {
      console.error("Error creating task:", err);
    } finally {
      setIsCreatingTask(false);
    }
  };

  const handleToggleTaskStatus = async (task: TaskItem) => {
    const nextStatus = task.status === "completed" ? "needsAction" : "completed";
    const statusLabel = nextStatus === "completed" ? "Complete" : "Re-open";

    // Critical Guideline: Present explicit confirmation dialog for mutating data
    const confirmed = window.confirm(
      `Confirm Workspace Action:\n\nDo you want to mark the Google Task "${task.title}" as ${statusLabel}?`
    );
    if (!confirmed) return;

    if (isSimulated) {
      const updatedTasks = tasks.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t));
      setTasks(updatedTasks);
      localStorage.setItem(`sim_tasks_${selectedListId}`, JSON.stringify(updatedTasks));

      await logToFirestore({
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
        type: "tasks",
        action: "Task Status (Simulated)",
        details: `Marked simulated "${task.title}" as ${statusLabel.toLowerCase()}`,
        status: "success",
      });
      return;
    }

    if (!accessToken || !selectedListId) return;
    try {
      const res = await fetch(
        `https://tasks.googleapis.com/tasks/v1/lists/${selectedListId}/tasks/${task.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: nextStatus,
            completed: nextStatus === "completed" ? new Date().toISOString() : null,
          }),
        }
      );

      if (res.ok) {
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t))
        );

        // Log to Firestore sync history
        await logToFirestore({
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
          type: "tasks",
          action: "Task Updated",
          details: `Marked "${task.title}" as ${statusLabel.toLowerCase()}`,
          status: "success",
        });
      } else {
        alert("Failed to update task status in Google Tasks.");
      }
    } catch (err) {
      console.error("Error toggling task status:", err);
    }
  };

  // Google Chat API calls
  const fetchChatSpaces = async () => {
    if (isSimulated) {
      setChatSpaces([
        { name: "spaces/sim-space-1", displayName: "📣 #devops-alerts", type: "ROOM" },
        { name: "spaces/sim-space-2", displayName: "🤖 #mcp-filesystem-notifications", type: "ROOM" }
      ]);
      setSelectedSpaceId("spaces/sim-space-1");
      return;
    }

    if (!accessToken) return;
    setIsLoadingSpaces(true);
    try {
      const res = await fetch("https://chat.googleapis.com/v1/spaces", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setChatSpaces(data.spaces || []);
        if (data.spaces && data.spaces.length > 0) {
          setSelectedSpaceId(data.spaces[0].name);
        }
      } else {
        console.error("Failed to fetch chat spaces:", await res.text());
      }
    } catch (e) {
      console.error("Error fetching chat spaces:", e);
    } finally {
      setIsLoadingSpaces(false);
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageText.trim()) return;

    const targetSpace = chatSpaces.find((s) => s.name === selectedSpaceId);
    const spaceLabel = targetSpace ? targetSpace.displayName : "selected Chat space";

    // Critical Guideline: Present explicit confirmation dialog for sending messages
    const confirmed = window.confirm(
      `Confirm Workspace Action:\n\nDo you want to post this message to Google Chat inside the "${spaceLabel}" space?`
    );
    if (!confirmed) return;

    if (isSimulated) {
      setIsSendingMessage(true);
      setTimeout(async () => {
        setIsSendingMessage(false);
        setChatMessageText("");
        alert(`[SIMULATED DISPATCH] Message successfully dispatched to Google Chat channel "${spaceLabel}"!\n\nPayload:\n"${chatMessageText}"`);

        await logToFirestore({
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
          type: "chat",
          action: "Message Sent (Simulated)",
          details: `Sent notification to Chat Space "${spaceLabel}"`,
          status: "success",
        });
      }, 300);
      return;
    }

    if (!accessToken || !selectedSpaceId) return;
    setIsSendingMessage(true);
    try {
      const res = await fetch(`https://chat.googleapis.com/v1/${selectedSpaceId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: chatMessageText,
        }),
      });

      if (res.ok) {
        setChatMessageText("");
        alert("Message successfully sent to Google Chat!");

        // Log to Firestore sync history
        await logToFirestore({
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
          type: "chat",
          action: "Message Sent",
          details: `Sent notification to Chat Space "${spaceLabel}"`,
          status: "success",
        });
      } else {
        const errMsg = await res.text();
        console.error("Failed to send chat message:", errMsg);
        alert(`Failed to post message to Google Chat: ${res.statusText}`);
      }
    } catch (err) {
      console.error("Error sending chat message:", err);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Firestore persistent log helper with local fallback
  const logToFirestore = async (log: SyncHistoryLog) => {
    // Add local backup first to ensure persistence
    setSyncHistory((prev) => {
      const updatedLog = [log, ...prev.slice(0, 9)];
      localStorage.setItem("arena_sync_history", JSON.stringify(updatedLog));
      return updatedLog;
    });

    try {
      const docRef = await addDoc(collection(db, "sync_history"), log);
      // Update with Firestore generated doc ID if successful
      setSyncHistory((prev) =>
        prev.map((item, idx) => (idx === 0 ? { ...item, id: docRef.id } : item))
      );
    } catch (err) {
      console.warn("Could not save to Firestore, using client-side fallback storage:", err);
    }
  };

  const fetchFirestoreHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const q = query(collection(db, "sync_history"), orderBy("timestamp", "desc"), limit(10));
      const querySnapshot = await getDocs(q);
      const items: SyncHistoryLog[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as SyncHistoryLog);
      });
      setSyncHistory(items);
      localStorage.setItem("arena_sync_history", JSON.stringify(items));
    } catch (err) {
      console.warn("Could not load history from Firestore, falling back to local history storage:", err);
      const cached = localStorage.getItem("arena_sync_history");
      if (cached) {
        setSyncHistory(JSON.parse(cached));
      }
    } finally {
      setIsLoadingHistory(false);
    }
  };

  return (
    <div className="space-y-6" id="tasks-chat-sync-view">
      {/* Real-time sync hub status banner */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400">
            <RefreshCw className="h-4 w-4 animate-spin-slow" />
            <span className="text-xs uppercase font-mono tracking-wider font-bold">Google Workspace & Firebase Hub</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight font-display">
            Tasks & Chat Synchronizer
          </h2>
          <p className="text-xs text-zinc-400 font-sans">
            Connect your continuous delivery cycle directly with personal Google Tasks lists and Google Chat channels.
          </p>
        </div>

        <div>
          {currentUser ? (
            <div className="flex items-center gap-3 bg-zinc-950/60 p-2 rounded-xl border border-zinc-800">
              <img
                src={currentUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.email}`}
                alt={currentUser.displayName || ""}
                className="h-8 w-8 rounded-full border border-indigo-500/40 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="text-left">
                <span className="text-xs font-bold text-white block leading-tight flex items-center gap-1.5">
                  {currentUser.displayName || "Google Workspace User"}
                  {isSimulated && (
                    <span className="px-1.5 py-0.5 bg-indigo-500/25 border border-indigo-500/40 text-indigo-300 font-mono text-[8px] rounded uppercase font-bold tracking-wider">
                      Simulated
                    </span>
                  )}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono block truncate max-w-[150px]">
                  {currentUser.email}
                </span>
              </div>
              <button
                onClick={handleDisconnect}
                className="p-1.5 bg-zinc-900 hover:bg-zinc-850 hover:text-red-400 text-zinc-400 rounded-lg transition"
                title="Disconnect Account"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleStartSimulation}
                className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 text-xs font-semibold rounded-xl transition"
                title="Launch simulated testing environment without authentication"
              >
                Simulate Hub
              </button>
              <button
                onClick={handleConnect}
                disabled={isLoggingIn}
                className="flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg border border-indigo-500/30 transition duration-200"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Authorizing...</span>
                  </>
                ) : (
                  <>
                    <Chrome className="h-4 w-4" />
                    <span>Connect Google Account</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {!currentUser ? (
        /* Not connected state info panel */
        <div className="glass-panel p-8 rounded-2xl text-center space-y-4 max-w-xl mx-auto">
          <div className="h-12 w-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-white font-display">Authentication Required</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Sign in with your Google account above to enable active integrations with Google Tasks and Google Chat APIs. 
              This allows the command suite to sync bug lists and post build notifications on your behalf with complete security permissions.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={handleConnect}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-md"
            >
              <Chrome className="h-4 w-4" />
              <span>Connect Now</span>
            </button>
            <button
              onClick={handleStartSimulation}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 hover:border-zinc-750 font-bold text-xs rounded-xl transition"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Launch Simulator</span>
            </button>
          </div>
        </div>
      ) : (
        /* Connected Layout - Two Column Hub */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Column 1: Google Tasks Integration */}
          <div className="glass-panel p-5 rounded-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <ListTodo className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-display">Google Tasks</h3>
                  <p className="text-[10px] text-zinc-500 font-sans">Manage development tasks & issues</p>
                </div>
              </div>

              {/* Task list selection */}
              {taskLists.length > 0 && (
                <div className="relative">
                  <select
                    value={selectedListId}
                    onChange={(e) => setSelectedListId(e.target.value)}
                    className="text-[11px] bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 max-w-[140px]"
                  >
                    {taskLists.map((list) => (
                      <option key={list.id} value={list.id}>
                        {list.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Tasks listing list */}
            <div className="space-y-2.5">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Active Tasks</span>
              
              {isLoadingTasks ? (
                <div className="py-8 flex flex-col items-center justify-center text-zinc-500 gap-1.5">
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
                  <span className="text-[10px] font-mono">GET /tasks/v1/lists...</span>
                </div>
              ) : tasks.length === 0 ? (
                <div className="bg-zinc-950/40 rounded-xl p-6 text-center border border-zinc-900 border-dashed text-zinc-500 text-xs">
                  No active tasks found in this list. Create one below!
                </div>
              ) : (
                <div className="max-h-[180px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTaskStatus(task)}
                      className={`p-2.5 rounded-xl border transition flex items-center justify-between cursor-pointer group ${
                        task.status === "completed"
                          ? "bg-emerald-950/5 border-emerald-900/20 opacity-50"
                          : "bg-zinc-950/40 border-zinc-900 hover:border-zinc-800"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center transition ${
                          task.status === "completed"
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "border-zinc-700 group-hover:border-indigo-500"
                        }`}>
                          {task.status === "completed" && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <div className="min-w-0">
                          <span className={`text-xs font-medium block truncate ${task.status === "completed" ? "line-through text-zinc-500" : "text-zinc-200"}`}>
                            {task.title}
                          </span>
                          {task.notes && (
                            <span className="text-[10px] text-zinc-500 block truncate max-w-[280px]">
                              {task.notes}
                            </span>
                          )}
                        </div>
                      </div>

                      {task.due && (
                        <span className="text-[9px] font-mono bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-400">
                          Due {new Date(task.due).toLocaleDateString([], { month: "short", day: "numeric" })}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Create Google Task Form */}
            <form onSubmit={handleAddTask} className="border-t border-zinc-900 pt-4 space-y-3">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Add Development Task</span>
              <div className="space-y-2">
                <input
                  type="text"
                  required
                  placeholder="Task title (e.g. Test auth-refresh JWT module)..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Notes/details..."
                    value={newTaskNotes}
                    onChange={(e) => setNewTaskNotes(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                  />
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isCreatingTask || !selectedListId}
                className="w-full py-2 bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/20 text-indigo-300 hover:text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
              >
                {isCreatingTask ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Plus className="h-3.5 w-3.5" />
                )}
                <span>Add Task with Google Sync</span>
              </button>
            </form>
          </div>

          {/* Column 2: Google Chat Integration */}
          <div className="glass-panel p-5 rounded-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-display">Google Chat</h3>
                  <p className="text-[10px] text-zinc-500 font-sans">Dispatch deploy notifications & logs</p>
                </div>
              </div>

              {/* Chat Spaces Dropdown */}
              {chatSpaces.length > 0 && (
                <div className="relative">
                  <select
                    value={selectedSpaceId}
                    onChange={(e) => setSelectedSpaceId(e.target.value)}
                    className="text-[11px] bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 max-w-[140px]"
                  >
                    {chatSpaces.map((space) => (
                      <option key={space.name} value={space.name}>
                        {space.displayName || space.name.replace("spaces/", "")}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Notification Automation Panel */}
            <div className="bg-zinc-950/40 rounded-xl p-3.5 border border-zinc-900 space-y-3">
              <div className="flex items-center gap-1.5">
                <Bell className="h-3.5 w-3.5 text-indigo-400" />
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Failure Event Automation</span>
              </div>
              
              <div className="space-y-2.5">
                <label className="flex items-center justify-between p-1 cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-zinc-300 block">Auto-Sync failed build as Google Task</span>
                    <span className="text-[9px] text-zinc-500 block leading-normal">Creates a task automatically when branch checks fail</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoSyncOnFail}
                    onChange={(e) => setAutoSyncOnFail(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-800 text-indigo-600 focus:ring-indigo-500 bg-zinc-950"
                  />
                </label>

                <label className="flex items-center justify-between p-1 cursor-pointer border-t border-zinc-900 pt-2">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-zinc-300 block">Auto-Post fail analysis to Google Chat</span>
                    <span className="text-[9px] text-zinc-500 block leading-normal">Sends Gemini DevOps recommendations to chat rooms</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoPostOnFail}
                    onChange={(e) => setAutoPostOnFail(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-800 text-indigo-600 focus:ring-indigo-500 bg-zinc-950"
                  />
                </label>
              </div>
            </div>

            {/* Direct message dispatch form */}
            <form onSubmit={handleSendChatMessage} className="space-y-3">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block mb-1">Direct Chat Dispatcher</span>
              <textarea
                required
                rows={3}
                placeholder="Compose build alert or commit log broadcast to space..."
                value={chatMessageText}
                onChange={(e) => setChatMessageText(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans resize-none"
              ></textarea>
              <button
                type="submit"
                disabled={isSendingMessage || !selectedSpaceId || !chatMessageText.trim()}
                className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
              >
                {isSendingMessage ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                <span>Send to Google Chat Room</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Persistent Firestore Sync Log Panel */}
      {currentUser && (
        <div className="glass-panel p-5 rounded-2xl space-y-3">
          <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <Clock className="h-3.5 w-3.5 text-indigo-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Durable Firestore Sync Log</h3>
            </div>
            <button
              onClick={fetchFirestoreHistory}
              className="text-[10px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reload Log</span>
            </button>
          </div>

          {isLoadingHistory ? (
            <div className="py-4 flex justify-center text-zinc-600 font-mono text-[10px]">
              Retrieving from firestore database...
            </div>
          ) : syncHistory.length === 0 ? (
            <div className="text-center py-4 text-zinc-600 font-sans text-xs">
              No synced items recorded. Sync operations are securely stored in Cloud Firestore.
            </div>
          ) : (
            <div className="space-y-1.5">
              {syncHistory.map((log, idx) => (
                <div key={log.id || idx} className="flex items-center justify-between text-xs py-1.5 px-2 bg-zinc-950/30 rounded border border-zinc-900 font-mono">
                  <div className="flex items-center gap-2">
                    <span className={`px-1 rounded text-[9px] font-bold ${log.type === "tasks" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"}`}>
                      {log.type.toUpperCase()}
                    </span>
                    <span className="text-zinc-300 font-semibold">{log.action}:</span>
                    <span className="text-zinc-500 text-[11px] truncate max-w-[300px] sm:max-w-[450px]">
                      {log.details}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-zinc-600 font-mono">{log.timestamp}</span>
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
