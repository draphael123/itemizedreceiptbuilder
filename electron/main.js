const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const fs = require('fs')

let mainWindow = null
let nextServer = null
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../public/icon.png'),
    titleBarStyle: 'default',
    backgroundColor: '#ffffff',
  })

  // Load the app
  if (isDev) {
    // In development, connect to Next.js dev server
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools()
  } else {
    // In production, start Next.js server and load it
    startNextServer()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
    if (nextServer) {
      nextServer.kill()
      nextServer = null
    }
  })
}

function startNextServer() {
  const appPath = app.isPackaged ? path.dirname(process.execPath) : app.getAppPath()
  const nextPath = path.join(appPath, '.next/standalone')
  const serverPath = path.join(nextPath, 'server.js')
  
  // Try standalone first
  if (fs.existsSync(serverPath)) {
    nextServer = spawn('node', [serverPath], {
      cwd: nextPath,
      env: {
        ...process.env,
        PORT: '3000',
        NODE_ENV: 'production',
        DATABASE_URL: getDatabasePath(),
      },
    })

    nextServer.stdout.on('data', (data) => {
      console.log(`Next.js: ${data}`)
    })

    nextServer.stderr.on('data', (data) => {
      console.error(`Next.js error: ${data}`)
    })

    // Wait for server to start
    setTimeout(() => {
      mainWindow.loadURL('http://localhost:3000')
    }, 3000)
  } else {
    // Fallback: try to start Next.js from package.json
    const packagePath = path.join(appPath, 'package.json')
    if (fs.existsSync(packagePath)) {
      nextServer = spawn('npm', ['start'], {
        cwd: appPath,
        env: {
          ...process.env,
          PORT: '3000',
          DATABASE_URL: getDatabasePath(),
        },
      })
      setTimeout(() => {
        mainWindow.loadURL('http://localhost:3000')
      }, 5000)
    } else {
      mainWindow.loadFile(path.join(appPath, 'out/index.html'))
    }
  }
}

function getDatabasePath() {
  const userDataPath = app.getPath('userData')
  const dbPath = path.join(userDataPath, 'dev.db')
  
  // Ensure directory exists
  if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath, { recursive: true })
  }
  
  return `file:${dbPath}`
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (nextServer) {
      nextServer.kill()
    }
    app.quit()
  }
})

// Handle file operations
ipcMain.handle('save-file', async (event, data, filename) => {
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    defaultPath: filename,
    filters: [
      { name: 'PDF Files', extensions: ['pdf'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  })

  if (!canceled && filePath) {
    fs.writeFileSync(filePath, Buffer.from(data))
    return { success: true, path: filePath }
  }
  return { success: false }
})

ipcMain.handle('open-file', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Excel Files', extensions: ['xlsx', 'xls'] },
      { name: 'CSV Files', extensions: ['csv'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  })

  if (!canceled && filePaths.length > 0) {
    return { success: true, path: filePaths[0] }
  }
  return { success: false }
})

