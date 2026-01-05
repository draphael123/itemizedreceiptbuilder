# Receipt Builder Desktop App

This is the desktop version of Receipt Builder, built with Electron. It provides all the same features as the web version but runs locally on your computer.

## Features

- ✅ All web app features included
- ✅ Works offline (uses local SQLite database)
- ✅ Faster performance
- ✅ Native file system access
- ✅ Auto-updates (coming soon)
- ✅ Available for Windows, Mac, and Linux

## Building the App

### Prerequisites

- Node.js 18+ installed
- All dependencies installed (`npm install`)

### Development

To run the app in development mode:

```bash
npm run electron:dev
```

This will:
1. Start the Next.js dev server
2. Launch Electron when the server is ready

### Building for Production

#### Build for Windows:
```bash
npm run electron:build:win
```

#### Build for Mac:
```bash
npm run electron:build:mac
```

#### Build for Linux:
```bash
npm run electron:build:linux
```

#### Build for All Platforms:
```bash
npm run electron:build
```

The built applications will be in the `dist/` directory.

## Installation

### Windows
1. Download `ReceiptBuilder-Setup.exe` from the website
2. Run the installer
3. Follow the installation wizard
4. Launch Receipt Builder from the Start menu

### Mac
1. Download `ReceiptBuilder.dmg` from the website
2. Open the DMG file
3. Drag Receipt Builder to Applications folder
4. Launch from Applications

### Linux
1. Download `ReceiptBuilder.AppImage` from the website
2. Make it executable: `chmod +x ReceiptBuilder.AppImage`
3. Run: `./ReceiptBuilder.AppImage`

## Local Database

The desktop app uses SQLite for local storage. The database file is stored in:
- **Windows**: `%APPDATA%/ReceiptBuilder/dev.db`
- **Mac**: `~/Library/Application Support/ReceiptBuilder/dev.db`
- **Linux**: `~/.config/ReceiptBuilder/dev.db`

## Notes

- The app runs a local Next.js server on port 3000
- All data is stored locally on your computer
- No internet connection required after initial setup
- You can import/export data as needed

