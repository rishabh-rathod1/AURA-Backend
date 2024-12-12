const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    fullscreen: true, // Enable fullscreen mode
    autoHideMenuBar: true, // Hide the menu bar
    webPreferences: {
      nodeIntegration: false, // Avoid enabling node integration for security
    },
  });

  // Load the React app
  mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});
