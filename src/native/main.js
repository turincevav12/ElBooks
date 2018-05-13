const {
    app,
    BrowserWindow,
    globalShortcut,
    ipcMain
} = require('electron');
const { promisify } = require('bluebird');
const { readdir } = require('fs');
const { resolve } = require('path');
const readdirAsync = promisify(readdir);

let win;


app.on('ready', function() {
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: false,
        fullscreen: false,
        title: "ElBook",
        show: false,
        resizable: true,
        movable: true,
    });

    globalShortcut.register('Control + Q', () => {
        app.quit();
    });

    ipcMain.on('front-ready', (event) => {
        readdirAsync(resolve(__dirname, '../books'))
            .then(files => event.sender.send('book-list', files))
            .catch(err => console.error(err));
    })

    ipcMain.on('thisBook',(event, data) => {
        var book = require('../../books/'+data+'.json')
        ipcMain.on('books', function(event) {
            event.sender.send('data', book);
        });
    }); 

    win.loadURL(`file://${__dirname}/index.html`);
    win.once('ready-to-show', () => {
        win.show()
    })

});