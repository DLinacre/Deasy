export interface Branch {
  name: string;
  commitMsg: string;
  author: string;
  updatedAt: string;
  testStatus: "idle" | "running" | "passed" | "failed";
  testLogs?: string;
  testMetrics?: {
    passed: number;
    failed: number;
    skipped: number;
    duration: string;
  };
}

export interface Project {
  id: string;
  name: string;
  repoName: string;
  description: string;
  gitSynced: boolean;
  branches: Branch[];
  activeBranch: string;
  targetPlatform: string;
  healthScore: number;
  cpuThreshold: number;
  memoryThreshold: number;
}

export interface MetricPoint {
  time: string;
  cpu: number;
  memory: number;
  latency: number;
  requests: number;
}

export interface TeamMember {
  id: string;
  email: string;
  role: "Owner" | "Maintainer" | "Analyst" | "Viewer";
  joinedAt: string;
  permissions: {
    canDeploy: boolean;
    canSync: boolean;
    canRunTests: boolean;
    canManageBackups: boolean;
  };
}

export interface GoogleProfile {
  email: string;
  name: string;
  picture: string;
  connectedAt: string;
  scopes: string[];
}

export interface BackupLog {
  id: string;
  timestamp: string;
  fileName: string;
  fileSize: string;
  checksum: string;
  type: "Automated" | "Manual";
  status: "completed" | "failed";
  driveSynced?: boolean;
}

export interface PipelineStage {
  id: string;
  name: string;
  status: "idle" | "running" | "success" | "failed";
  duration: string;
  progress: number;
  logs: string[];
}
