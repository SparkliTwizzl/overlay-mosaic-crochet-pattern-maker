const { app, BrowserWindow } = require('electron')

const createWindow = () => {
    let window = new BrowserWindow({
        show: false,
    });
    window.maximize();
    window.show();

  window.loadFile('index.html')
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
