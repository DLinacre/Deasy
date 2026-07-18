/**
 * Deasy - Windows 11 Desktop Integration Entry Point
 * Electron Main Process script (CJS to support standard node environment bindings)
 */

const { app, BrowserWindow, Menu, Tray, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow = null;
let tray = null;
let backendProcess = null;
const PORT = 3000;

// Enforce single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
  process.exit(0);
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // If user tries to open a second instance, focus the active window
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

// Start the packaged CJS Express server
function startLocalBackend() {
  const backendPath = path.join(__dirname, 'dist', 'server.cjs');
  
  // Set environment parameters from secure storage if present
  const env = {
    ...process.env,
    NODE_ENV: 'production',
    PORT: PORT.toString(),
    ELECTRON_RUN_AS_NODE: '1'
  };

  try {
    // Start backend server silently using Electron's own bundled runtime
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

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1000,
    minHeight: 650,
    title: 'Deasy - Continuous Command Suite',
    icon: path.join(__dirname, 'assets', 'icon.ico'), // high-res Windows icon
    frame: true, // Native frames for stable Windows 11 border-shadow compliance
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js') // optional preload script
    }
  });

  // Load the Express server address
  mainWindow.loadURL(`http://localhost:${PORT}`);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('close', (event) => {
    // Override default close to minimize to System Tray instead of quitting
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });
}

function createSystemTray() {
  // Create system tray icon for seamless background activity
  const trayIconPath = path.join(__dirname, 'assets', 'icon.ico');
  try {
    tray = new Tray(trayIconPath);
    const contextMenu = Menu.buildFromTemplate([
      { 
        label: 'Show Dashboard', 
        click: () => {
          if (mainWindow) {
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
          mainWindow.show();
          mainWindow.focus();
        }
      }
    });
  } catch (err) {
    console.warn('System Tray creation failed or running headless.');
  }
}

app.whenReady().then(() => {
  // Boot the integrated Express API & static server
  startLocalBackend();
  
  // Launch the window
  createMainWindow();
  
  // Set up tray minimization
  createSystemTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('will-quit', () => {
  // Clean up server background process
  if (backendProcess) {
    backendProcess.kill();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // Kept alive for system tray background execution
  }
});
