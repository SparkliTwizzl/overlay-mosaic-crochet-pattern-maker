'use strict';

async function main() {
  const { ipcRenderer, remote } = require('electron');
  const isDevelopment = require('electron-is-dev');

  console.log(process.env);
  if (isDevelopment) {
    const debuggerAttachDelay = 1000;
    await new Promise(r => setTimeout(r, debuggerAttachDelay));
  }

  debugger;

  await new Promise(resolve =>
    document.readyState === 'loading' ?
      document.addEventListener('DOMContentLoaded', resolve) :
      resolve()
    );
  ipcRenderer.send('rendererReady', null);
  await new Promise(resolve => ipcRenderer.once('mainReady', resolve));
  statusElement.innerHTML = 'Main and Renderer are ready.';
}

main().catch(function (error) {
  console.log(error);
  alert(error);
});
