const { app, BrowserWindow, shell, dialog } = require("electron");
const path = require("path");
var url = require("url");
const storage = require("electron-json-storage");

const dataPath = storage.getDataPath();
console.log(dataPath);

const getQuery = (query) => {};

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  //   mainWindow.webContents.openDevTools();
  win.webContents.openDevTools();
  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient("instaminutes", process.execPath, [
        path.resolve(process.argv[1]),
      ]);
    }
  } else {
    app.setAsDefaultProtocolClient("instaminutes");
  }

  storage.get("userInfo", function (error, data) {
    if (error) throw error;
    console.log("inside create window looking for state variables");
    console.log("userInfo", data);
    console.log("name", data.name);
    console.log("code", data.code);
    console.log("workspace", data.workspace);
    console.log("done searching");
  });

  win.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("open-url", (event, deeplinkUrl) => {
  console.log("url for deep-link----" + deeplinkUrl);
  let convertedUrl = url.parse(deeplinkUrl, true);
  //   let convertedSearch = convertedUrl.search;
  //   let convertedPath = convertedUrl.pathname;
  let convertedQuery = convertedUrl.query;
  console.log(`query object`, convertedQuery);
  storage.set("userInfo", convertedQuery);

  //   storage.set("name", convertedQuery.name);
  //   storage.set("code", convertedQuery.code);
  //   storage.set("workspace", convertedQuery.workspace);

  //   console.log("query# " + convertedSearch);
  //   console.log("path# " + convertedPath);

  //instaminutes:///path1/path2/path3?name=akshat&workspace=6789654&code=89764adsfsghjjkk
  //   dialog.showErrorBox(
  //     "Welcome Back",
  //     `You arrived from: ${url} with event ${event}`
  //   );
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
