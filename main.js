'use strict';

async function main() {
  const { app, BrowserWindow, ipcMain } = require('electron');
  const isDevelopment = require('electron-is-dev');

  async function createMainWindow() {
    const window = new BrowserWindow({ width: 800, height: 600 });
    await new Promise((resolve, reject) => {
      window.webContents.once('did-finish-load', resolve);
      window.once('closed', () => reject(new Error('Window closed prematurely.')));
      window.loadFile(`${__dirname}/index.html`);
    });
    return window;
  }

  await new Promise(resolve => app.once('ready', resolve));
  const terminationPromise = new Promise(resolve => app.once('window-all-closed', resolve));
  const rendererPromise = new Promise(resolve => ipcMain.once('rendererReady', resolve));
  const mainWindowPromise = createMainWindow();

  await Promise.race([
    Promise.all([rendererPromise, mainWindowPromise]),
    terminationPromise.finally(() => {
        throw new Error('All windows closed prematurely.');
    })
  ]);

  const mainWindow = await mainWindowPromise;
  mainWindow.webContents.send("mainReady");

  if (isDevelopment) {
    mainWindow.webContents.openDevTools()
  }

  await terminationPromise;
  app.exit(0);
}

main().catch(error => {
  console.log(error);
  process.exit(1);
});
