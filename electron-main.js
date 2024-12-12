const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const { spawn } = require('child_process');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    fullscreen: false, // Optional fullscreen, can be toggled
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false, // Improved security
      contextIsolation: true, // Enhanced security
      enableRemoteModule: false, // Disable remote module for security
      preload: path.join(__dirname, 'preload.js') // Recommended preload script
    }
  });

  // Load the React app
  mainWindow.loadURL(
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, 'build', 'index.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  // Optional: Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Python script launching logic
  setupPythonScriptHandler();
}

function setupPythonScriptHandler() {
  ipcMain.on('run-python-script', (event, { scriptPath, mode }) => {
    try {
      const pythonProcess = spawn('python', [scriptPath, mode], {
        cwd: path.dirname(scriptPath),
        stdio: ['ignore', 'pipe', 'pipe']
      });

      pythonProcess.stdout.on('data', (data) => {
        console.log(`Python Output: ${data}`);
        event.reply('python-script-stdout', data.toString());
      });

      pythonProcess.stderr.on('data', (data) => {
        console.error(`Python Error: ${data}`);
        event.reply('python-script-stderr', data.toString());
      });

      pythonProcess.on('close', (code) => {
        event.reply('python-script-response', {
          success: code === 0,
          code: code
        });
      });
    } catch (error) {
      event.reply('python-script-response', {
        success: false,
        error: error.message
      });
    }
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});