const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let mainWindow;
let expoProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, "assets", "icon.png"), // For window icon, if you have it
  });

  mainWindow.loadFile("index.html");
  // mainWindow.webContents.openDevTools(); // Uncomment for debugging

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  startExpoServer();
}

function startExpoServer() {
  // Paths to bundled resources
  // process.resourcesPath points to the 'app.asar' parent directory in production
  // In development, it's usually the project root or ./resources
  const resourcesBaseDir = app.isPackaged ? process.resourcesPath : __dirname;
  const nodeExecutableDir = path.join(resourcesBaseDir, "app", "node");
  const nodeExecutable =
    process.platform === "win32"
      ? path.join(nodeExecutableDir, "node.exe")
      : path.join(nodeExecutableDir, "bin", "node"); // Adjust for Linux/macOS if needed

  const expoCliDir = path.join(resourcesBaseDir, "app", "expo_modules");
  const expoCliScript = path.join(expoCliDir, "expo-cli", "bin", "expo.js");

  // The CWD should be where the user runs ChronaFlowServer.exe,
  // which we assume is their Expo project root.
  const expoProjectDir = process.cwd();

  mainWindow.webContents.send(
    "server-output",
    `Resources Base: ${resourcesBaseDir}`
  );
  mainWindow.webContents.send(
    "server-output",
    `Node Executable Path: ${nodeExecutable}`
  );
  mainWindow.webContents.send(
    "server-output",
    `Expo CLI Script Path: ${expoCliScript}`
  );
  mainWindow.webContents.send(
    "server-output",
    `Expo Project Directory (CWD): ${expoProjectDir}`
  );
  mainWindow.webContents.send(
    "server-output",
    `Starting Expo server in ${expoProjectDir}...`
  );

  // Check if files exist (for debugging)
  // const fs = require('fs');
  // if (!fs.existsSync(nodeExecutable)) {
  //     mainWindow.webContents.send('server-error', `Node executable not found at: ${nodeExecutable}`);
  //     return;
  // }
  // if (!fs.existsSync(expoCliScript)) {
  //     mainWindow.webContents.send('server-error', `Expo CLI script not found at: ${expoCliScript}`);
  //     return;
  // }

  expoProcess = spawn(
    nodeExecutable,
    [expoCliScript, "start", "--non-interactive"], // Added --non-interactive
    {
      cwd: expoProjectDir, // Run from the user's Expo project directory
      shell: false, // Important to directly execute node
      env: { ...process.env, NODE_ENV: "development" }, // Or production, depending on needs
    }
  );

  expoProcess.stdout.on("data", (data) => {
    console.log(`Expo stdout: ${data}`);
    mainWindow.webContents.send("server-output", data.toString());
  });

  expoProcess.stderr.on("data", (data) => {
    console.error(`Expo stderr: ${data}`);
    mainWindow.webContents.send("server-error", data.toString());
  });

  expoProcess.on("close", (code) => {
    console.log(`Expo process exited with code ${code}`);
    mainWindow.webContents.send("server-exit", code);
    expoProcess = null;
  });

  expoProcess.on("error", (err) => {
    console.error("Failed to start Expo process:", err);
    mainWindow.webContents.send(
      "server-error",
      `Failed to start Expo process: ${err.message}`
    );
    expoProcess = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (expoProcess) {
      expoProcess.kill();
    }
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on("will-quit", () => {
  if (expoProcess) {
    expoProcess.kill(); // Ensure Expo server is killed when app quits
  }
});
