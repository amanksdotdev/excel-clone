"use strict";

const { app, BrowserWindow } = require("electron");

function createWindow() {
    const win = new BrowserWindow({
        show: false,
    });

    win.loadFile("index.html").then(() => {
        win.removeMenu();
        win.maximize();
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform != "darwin") {
        app.quit();
    }
});
