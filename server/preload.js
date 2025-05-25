const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  onServerOutput: (callback) =>
    ipcRenderer.on("server-output", (_event, value) => callback(value)),
  onServerError: (callback) =>
    ipcRenderer.on("server-error", (_event, value) => callback(value)),
  onServerExit: (callback) =>
    ipcRenderer.on("server-exit", (_event, code) => callback(code)),
});
