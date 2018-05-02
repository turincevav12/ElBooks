const electron = require('electron');
const path = require('path');

const app = electron.app;
const globalShortcut = electron.globalShortcut;
const BrowserWindow = electron.BrowserWindow;

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        width: 550,
        height: 400,
        frame: false,
        fullscreen: true,
        show: false
    });

    globalShortcut.register('Control + Q', () => {
        app.quit();
    });

    mainWindow.loadURL('http://localhost:3000');
    mainWindow.show();    

});