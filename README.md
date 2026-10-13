# Menged

Menged is a prototype for finding Ethiopian taxi terminals and exploring local connections. Current station and connection records are demonstration data and are not field verified.

## Requirements

- Node.js 20.19+ (Node 24 is supported)
- npm

On Windows PowerShell, call `npm.cmd` if `npm` is blocked by the PowerShell script execution policy. For example, use `npm.cmd --version` and `npm.cmd run dev`.

## Start the project

Open two PowerShell terminals from this folder.

In the first terminal:

```powershell
cd backend
npm.cmd install
npm.cmd run dev
```

If the TypeScript watcher fails to start, use the compiled server instead:

```powershell
npm.cmd run build
npm.cmd start
```

In the second terminal:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Open the Vite address printed in the frontend terminal (usually `http://localhost:5173`). The API runs at `http://localhost:3000`; check `http://localhost:3000/api/health` to confirm it is running.

Route search currently supports the demonstration stations Bole, Mexico, and Megenagna. It does not provide verified taxi routes, fares, or live service information.
