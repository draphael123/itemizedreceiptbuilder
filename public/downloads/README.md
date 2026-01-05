# Download Files

This directory contains the downloadable installers for the Receipt Builder desktop app.

## Building the App

To build the desktop app installers, run:

```bash
# For Windows
npm run electron:build:win

# For Mac
npm run electron:build:mac

# For Linux
npm run electron:build:linux
```

The built installers will be in the `dist/` directory. Copy them here for users to download.

## File Names

- Windows: `ReceiptBuilder-Setup.exe`
- Mac: `ReceiptBuilder.dmg`
- Linux: `ReceiptBuilder.AppImage`

## Notes

- Make sure to build the Next.js app first (`npm run build`)
- The Electron app will bundle the Next.js standalone build
- Users will need Node.js installed (or the app needs to bundle it)
- The app uses local SQLite database stored in user's app data directory

