/* 
 * Property of 0.tk
 * Preload Security Bridge
 */
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // This is where we will eventually add the keyboard simulation commands
  version: process.versions.electron
});