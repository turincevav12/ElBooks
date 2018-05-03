const electron = require('electron')
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const ipc = require('electron');
const enableLiveReload = require('electron-compile');

const path = require('path');
const globalShortcut = electron.globalShortcut;

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        width: 550,
        height: 400,
        frame: false,
        fullscreen: true,
        title: "ElBook",
        show: false
    });

    globalShortcut.register('Control + Q', () => {
        app.quit();
    });

    //mainWindow.loadURL(`file://${__dirname}/public/index.html`);
    mainWindow.loadURL(`http://localhost:3000/`);
    mainWindow.show();    

});