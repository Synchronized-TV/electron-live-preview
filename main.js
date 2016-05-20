process.env.NODE_ENV = 'development';

require('electron-debug')();

const path = require('path');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const crashReporter = electron.crashReporter;
const shell = electron.shell;
const ipcMain = electron.ipcMain;
let menu;
let template;
let currentWindow = null;
let windows = {};

crashReporter.start();

const createServer = require('./server');

createServer(onMessage);

ipcMain.on('action', function(event, action) {
  //const focusedWindow = BrowserWindow.getFocusedWindow();
  //const currentWindow = event.sender;

  switch(action) {
    case 'pin':
      const onTop = !currentWindow.isAlwaysOnTop();
      currentWindow.setAlwaysOnTop(onTop);
      //currentWindow.send('action', { pin: onTop });
      break;
    case 'bug':
      if (!currentWindow.isDevToolsOpened()) {
        currentWindow.webContents.openDevTools({ detach: true });
      }
      else {
        currentWindow.webContents.closeDevTools();
      }
      break;
    case 'reload':
      currentWindow.reload();
      break;
    case 'close':
      currentWindow.close();
      break;
    case 'minimize':
      currentWindow.minimize();
      break;
  }
});

function getWindowByName(name) {
  for (var i in windows) {
    if (i === name) {
      return windows[i];
    }
  }
}

function hideWindows() {
  for (var i in windows) {
    if (!windows[i].isDevToolsFocused()) {
      windows[i].hide();
    }
  }
}

function onMessage(viewPath) {
  if (viewPath.match(/live-preview\.js$/)) {
    if (!windows[viewPath]) {
      hideWindows();

      const newWindow = new BrowserWindow({
        width: 450,
        height: 200,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        fullscreenable: false,
        acceptFirstMouse: true, // Whether the web view accepts a single mouse-down event that simultaneously activates the window. Default is false.
        hasShadow: false,
        title: viewPath.replace(path.resolve('.') + '/', '')
      });

      newWindow.loadURL(`file://${__dirname}/app/app.html?p=${viewPath}`);

      newWindow.on('closed', () => {
        delete windows[viewPath];
      });

      //newWindow.webContents.openDevTools({ detach: true });
      //newWindow.closeDevTools();

      // newWindow.on('devtools-closed', () => {
      //   windows[viewPath].send('action', { devtools: false });
      // });

      windows[viewPath] = currentWindow = newWindow;
    }
    else if (currentWindow) {
      hideWindows();
      currentWindow = windows[viewPath];
      currentWindow.showInactive();
    }
  }
}
/*
function onMessage(message) {
  console.log('message: ', message);
  if (!message) {
    return;
  }

  const split = message.split(":");
  const action = split[0];
  const viewPath = split[1];
console.log('action: ', action, 'viewPath: ', viewPath);
  if (action === 'deactivate') {
    const foundWindow = getWindowByName(viewPath);
    
    if (foundWindow && !foundWindow.isFocused() && !foundWindow.isDevToolsFocused()) {
      foundWindow.hide();
    }
  }
  else if (action === 'activate' && viewPath.match(/live-preview\.js$/)) {
    if (!windows[viewPath]) {
      hideWindows();

      const newWindow = new BrowserWindow({
        width: 450,
        height: 200,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        fullscreenable: false,
        acceptFirstMouse: true, // Whether the web view accepts a single mouse-down event that simultaneously activates the window. Default is false.
        hasShadow: false,
        title: viewPath.replace(path.resolve('.') + '/', '')
      });

      newWindow.loadURL(`file://${__dirname}/app/app.html?p=${viewPath}`);

      newWindow.on('closed', () => {
        windows[viewPath] = null;
      });

      //newWindow.webContents.openDevTools({ detach: true });
      //newWindow.closeDevTools();

      newWindow.on('devtools-closed', () => {
        windows[viewPath].send('action', { devtools: false });
      });

      windows[viewPath] = currentWindow = newWindow;
    }
    else {
      hideWindows();
      currentWindow = windows[viewPath];
      currentWindow.showInactive();
    }
  }
  else {
    hideWindows();
  }
}
*/