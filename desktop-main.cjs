/**
 * Deasy - Windows 11 Desktop Integration Entry Point
 * Electron Main Process script (CJS to support standard node environment bindings)
 */

const { app, BrowserWindow, Menu, Tray, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

let mainWindow = null;
let tray = null;
let backendProcess = null;
let PORT = 3000;

// Enforce single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
  process.exit(0);
} else {
  app.on('second-instance', () => {
    // If user tries to open a second instance, focus the active window
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      if (!mainWindow.isVisible()) mainWindow.show();
      mainWindow.focus();
    }
  });
}

// Check if Express backend is accepting connections
function waitForBackend(url, timeoutMs = 15000) {
  const start = Date.now();
  return new Promise((resolve) => {
    const check = () => {
      http.get(url, (res) => {
        resolve(true);
      }).on('error', () => {
        if (Date.now() - start > timeoutMs) {
          resolve(false);
        } else {
          setTimeout(check, 250);
        }
      });
    };
    check();
  });
}

// Start the packaged CJS Express server
function startLocalBackend() {
  const backendPath = path.join(__dirname, 'dist', 'server.cjs');
  
  const env = {
    ...process.env,
    NODE_ENV: 'production',
    PORT: PORT.toString(),
    ELECTRON_RUN_AS_NODE: '1'
  };

  try {
    // Spawn server process
    backendProcess = spawn(process.execPath, [backendPath], {
      env: env,
      cwd: __dirname,
      stdio: 'pipe'
    });

    backendProcess.stdout.on('data', (data) => {
      console.log(`[Backend Service]: ${data}`);
    });

    backendProcess.stderr.on('data', (data) => {
      console.error(`[Backend Error]: ${data}`);
    });
  } catch (error) {
    console.error('Failed to spawn Express backend service:', error);
  }
}

async function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1000,
    minHeight: 650,
    title: 'Deasy - Continuous Command & Creation Suite',
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    frame: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Wait for local backend server to become ready
  const serverReady = await waitForBackend(`http://localhost:${PORT}`);
  if (serverReady) {
    mainWindow.loadURL(`http://localhost:${PORT}`);
  } else {
    // Fallback error page if backend port failed to open
    mainWindow.loadURL(`data:text/html,<html><body style="background:%230b0f14;color:%23fff;font-family:sans-serif;text-align:center;padding:50px;"><h2>⚠️ Deasy Server Starting...</h2><p>Click Refresh or restart Deasy if the server takes longer than expected.</p><button onclick="location.reload()" style="padding:10px 20px;border-radius:8px;background:%236366f1;color:%23fff;border:none;cursor:pointer;">Refresh Page</button></body></html>`);
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });
}

function createSystemTray() {
  const trayIconPath = path.join(__dirname, 'assets', 'icon.ico');
  try {
    tray = new Tray(trayIconPath);
    const contextMenu = Menu.buildFromTemplate([
      { 
        label: 'Show Deasy Dashboard', 
        click: () => {
          if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.show();
            mainWindow.focus();
          }
        } 
      },
      { type: 'separator' },
      { 
        label: 'Exit Deasy', 
        click: () => {
          app.isQuitting = true;
          app.quit();
        } 
      }
    ]);

    tray.setToolTip('Deasy - Continuous Command Suite');
    tray.setContextMenu(contextMenu);

    tray.on('double-click', () => {
      if (mainWindow) {
        if (mainWindow.isVisible()) {
          mainWindow.hide();
        } else {
          if (mainWindow.isMinimized()) mainWindow.restore();
          mainWindow.show();
          mainWindow.focus();
        }
      }
    });
  } catch (err) {
    console.warn('System Tray creation note:', err.message);
  }
}

app.whenReady().then(async () => {
  startLocalBackend();
  await createMainWindow();
  createSystemTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('will-quit', () => {
  if (backendProcess) {
    try { backendProcess.kill(); } catch { /* process exited */ }
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // Kept alive for system tray background execution
  }
});
