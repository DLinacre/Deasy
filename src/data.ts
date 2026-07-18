import { Project, TeamMember, BackupLog, MetricPoint } from "./types";

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "Arena Agent Core API",
    repoName: "arena-ai/agent-core-api",
    description: "Primary microservice for orchestration, custom routing, and database scaling.",
    gitSynced: true,
    activeBranch: "main",
    targetPlatform: "Vercel (Free)",
    healthScore: 98,
    cpuThreshold: 80,
    memoryThreshold: 85,
    branches: [
      {
        name: "main",
        commitMsg: "feat: release core engine and dynamic cluster routing v2.4.0",
        author: "www.Linacre.site",
        updatedAt: "2026-07-18 10:15",
        testStatus: "passed",
        testMetrics: { passed: 48, failed: 0, skipped: 2, duration: "12.4s" },
        testLogs: "PASS  src/tests/router.test.ts\nPASS  src/tests/auth.test.ts\nPASS  src/tests/database.test.ts\n\nTest Suites: 3 passed, 3 total\nTests:       48 passed, 48 total\nSnapshots:   0 total\nTime:        12.4s\nRan all test suites."
      },
      {
        name: "dev",
        commitMsg: "refactor: optimize response payload parsing, add request caching layer",
        author: "www.Linacre.site",
        updatedAt: "2026-07-18 09:30",
        testStatus: "passed",
        testMetrics: { passed: 48, failed: 0, skipped: 2, duration: "13.1s" },
        testLogs: "PASS  src/tests/router.test.ts\nPASS  src/tests/auth.test.ts\nPASS  src/tests/database.test.ts\n\nTest Suites: 3 passed, 3 total\nTests:       48 passed, 48 total\nSnapshots:   0 total\nTime:        13.1s\nRan all test suites."
      },
      {
        name: "feature/auth-refresh",
        commitMsg: "feat: add secure secure JWT rotative tokens and session refresh API",
        author: "dev-assistant@arena.ai",
        updatedAt: "2026-07-17 18:40",
        testStatus: "failed",
        testMetrics: { passed: 32, failed: 4, skipped: 12, duration: "8.7s" },
        testLogs: `FAIL  src/tests/auth.test.ts
  ● Authentication Service › verifySession() should rotate expired JWT secure tokens

    TypeError: Cannot read properties of undefined (reading 'split')

      at Object.verifySession (src/services/auth.ts:143:35)
      at Object.<anonymous> (src/tests/auth.test.ts:42:24)

  ● Authentication Service › generateBackups() should encrypt payload with AES-256

    AssertionError: expected 'raw-payload' to equal 'U2FsdGVkX19D...'

      at Object.<anonymous> (src/tests/auth.test.ts:75:18)

Test Suites: 1 failed, 2 passed, 3 total
Tests:       4 failed, 32 passed, 12 skipped, 48 total
Snapshots:   0 total
Time:        8.7s
Ran only authentication suites.`
      },
      {
        name: "hotfix/port-clash",
        commitMsg: "fix: bypass hardcoded node PORT and fallback to process.env.PORT",
        author: "www.Linacre.site",
        updatedAt: "2026-07-18 10:05",
        testStatus: "idle",
        testLogs: ""
      }
    ]
  },
  {
    id: "proj-2",
    name: "Arena Glass UI Console",
    repoName: "arena-ai/glass-ui-console",
    description: "Sleek dark glassmorphic react mobile dashboard with dynamic layouts.",
    gitSynced: true,
    activeBranch: "dev",
    targetPlatform: "GitHub Pages (Free)",
    healthScore: 100,
    cpuThreshold: 75,
    memoryThreshold: 80,
    branches: [
      {
        name: "main",
        commitMsg: "chore: compile stable responsive layout & icon pairings",
        author: "www.Linacre.site",
        updatedAt: "2026-07-16 11:20",
        testStatus: "passed",
        testMetrics: { passed: 15, failed: 0, skipped: 0, duration: "4.1s" },
        testLogs: "PASS  src/tests/render.test.tsx\n\nTest Suites: 1 passed, 1 total\nTests:       15 passed, 15 total\nTime:        4.1s"
      },
      {
        name: "dev",
        commitMsg: "feat: add real-time responsive canvas charts for monitor logs",
        author: "www.Linacre.site",
        updatedAt: "2026-07-18 09:12",
        testStatus: "passed",
        testMetrics: { passed: 15, failed: 0, skipped: 0, duration: "4.3s" },
        testLogs: "PASS  src/tests/render.test.tsx\n\nTest Suites: 1 passed, 1 total\nTests:       15 passed, 15 total\nTime:        4.3s"
      },
      {
        name: "feature/encrypted-backups",
        commitMsg: "feat: secure client-side encrypted backup trigger zip packaging",
        author: "dev-assistant@arena.ai",
        updatedAt: "2026-07-17 22:15",
        testStatus: "failed",
        testMetrics: { passed: 8, failed: 2, skipped: 5, duration: "6.2s" },
        testLogs: `FAIL  src/tests/backup.test.tsx
  ● Encrypted Backup Engine › triggerBackupZip() should encrypt schema database entries

    Error: crypto.subtle is undefined in non-secure local environment contexts

      at EncryptedBackupEngine.encrypt (src/utils/crypto.ts:18:24)
      at Object.<anonymous> (src/tests/backup.test.tsx:55:30)

Test Suites: 1 failed, 1 passed, 2 total
Tests:       2 failed, 8 passed, 5 skipped, 15 total
Time:        6.2s`
      }
    ]
  }
];

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: "t-1",
    email: "www.Linacre.site",
    role: "Owner",
    joinedAt: "2026-06-01",
    permissions: { canDeploy: true, canSync: true, canRunTests: true, canManageBackups: true }
  },
  {
    id: "t-2",
    email: "ci-bot@arena.ai",
    role: "Maintainer",
    joinedAt: "2026-06-15",
    permissions: { canDeploy: true, canSync: true, canRunTests: true, canManageBackups: false }
  },
  {
    id: "t-3",
    email: "assistant-agent@arena.ai",
    role: "Analyst",
    joinedAt: "2026-07-10",
    permissions: { canDeploy: false, canSync: true, canRunTests: true, canManageBackups: false }
  }
];

export const INITIAL_BACKUPS: BackupLog[] = [
  {
    id: "b-1",
    timestamp: "2026-07-18 04:00",
    fileName: "arena-agent-core-api-main-20260718.aes",
    fileSize: "14.2 MB",
    checksum: "sha256:d8a2bc49...f8c",
    type: "Automated",
    status: "completed"
  },
  {
    id: "b-2",
    timestamp: "2026-07-17 04:00",
    fileName: "arena-agent-core-api-main-20260717.aes",
    fileSize: "14.1 MB",
    checksum: "sha256:a4f9b28c...d3e",
    type: "Automated",
    status: "completed"
  },
  {
    id: "b-3",
    timestamp: "2026-07-17 12:45",
    fileName: "arena-agent-core-api-manual-v2.3.aes",
    fileSize: "13.9 MB",
    checksum: "sha256:8b22c8a1...ff3",
    type: "Manual",
    status: "completed"
  }
];

export const GENERATE_MOCK_METRICS = (): MetricPoint[] => {
  const points: MetricPoint[] = [];
  const baseTime = new Date();
  for (let i = 12; i >= 0; i--) {
    const t = new Date(baseTime.getTime() - i * 5000);
    const minStr = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    points.push({
      time: minStr,
      cpu: Math.floor(Math.random() * 25) + 30, // 30-55%
      memory: Math.floor(Math.random() * 10) + 60, // 60-70%
      latency: Math.floor(Math.random() * 40) + 110, // 110-150ms
      requests: Math.floor(Math.random() * 15) + 5 // 5-20 req/s
    });
  }
  return points;
};

// £0.00 Free-tier budget details
export const FREE_TIER_BUDGET_GUIDE = [
  {
    category: "Source & Sync",
    provider: "GitHub",
    plan: "Free Developer Plan",
    benefits: "Unlimited public & private repositories, unlimited collaborators.",
    cost: "£0.00",
    tips: "Ensure branch protection is enabled on 'main' to block untested code."
  },
  {
    category: "CI/CD & Tests",
    provider: "GitHub Actions",
    plan: "Free Tier Workflow",
    benefits: "2,000 free runner-minutes/month for private repos. Public is unlimited.",
    cost: "£0.00",
    tips: "Set path triggers so builds only run when relevant source files change."
  },
  {
    category: "Frontend Hosting",
    provider: "Vercel / Netlify",
    plan: "Hobby/Free Tier",
    benefits: "High-performance CDN, automated branch previews, free SSL.",
    cost: "£0.00",
    tips: "Utilize branch previews to test feature branches in live-like frames."
  },
  {
    category: "Serverless Compute",
    provider: "Render / Fly.io",
    plan: "Free Tier",
    benefits: "Hosting for custom Node/Docker containers (spin-down on idle).",
    cost: "£0.00",
    tips: "Set up a lightweight heartbeat ping every 14 mins to avoid cold starts."
  },
  {
    category: "Persistent Database",
    provider: "Supabase / Neon",
    plan: "Free Project Tier",
    benefits: "Fully managed PostgreSQL, 500MB storage, Auth, and Edge functions.",
    cost: "£0.00",
    tips: "Turn off tables you aren't using to keep active connections optimized."
  },
  {
    category: "Secure Backups",
    provider: "GitHub Releases / AWS S3",
    plan: "S3 Free Tier (5GB)",
    benefits: "Encrypted daily cron exports. Standard encryption is free.",
    cost: "£0.00",
    tips: "Write a 5-line bash pipeline to compress, AES-encrypt, and upload."
  }
];

// Timeline estimation tool config
export const DEVELOPMENT_TIMELINE_STAGES = [
  {
    phase: "Phase 1: Local Sync & Workspaces",
    duration: "Days 1-3",
    tasks: ["Git config integration", "SSH agent handshakes", "Arena.ai/agents workspace bootstrapping"],
    difficulty: "Medium",
    freeProvider: "GitHub API"
  },
  {
    phase: "Phase 2: Automated Test Pipelines",
    duration: "Days 4-6",
    tasks: ["Jest/Tsc workspace orchestration", "GitHub Actions trigger config", "Branch reporting hooks"],
    difficulty: "High",
    freeProvider: "GitHub Actions Runners"
  },
  {
    phase: "Phase 3: Deployment Targets",
    duration: "Days 7-9",
    tasks: ["Multi-platform token synchronization", "Vercel Hobby API hooks", "Liveness testing routines"],
    difficulty: "Medium",
    freeProvider: "Vercel / Netlify API"
  },
  {
    phase: "Phase 4: Metrics & Alerts",
    duration: "Days 10-12",
    tasks: ["Sinks setup for CPU/Memory logs", "Recharts visual logging", "Slack/Email free webhook alerts"],
    difficulty: "Easy",
    freeProvider: "In-Memory buffer + Slack Webhooks"
  },
  {
    phase: "Phase 5: Secure Roles & Encrypted Backups",
    duration: "Days 13-14",
    tasks: ["Crypto.subtle secure backup packaging", "Team invitation engine", "Final deployment checks"],
    difficulty: "Medium",
    freeProvider: "Web Crypto API + AWS S3 Free"
  }
];
