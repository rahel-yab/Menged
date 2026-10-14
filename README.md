# Menged

Menged is a bilingual English and Amharic prototype for discovering taxi terminals and exploring local connections in Ethiopia. The current directory focuses on three Addis Ababa locations and provides a starting point for collecting verified transport information.

> **Prototype data:** Terminal details and map pins are starter records. Route connections are illustrative examples. They have not been verified with taxi operators and must not be treated as current travel, fare, schedule, or safety advice.

## What the project includes

- A responsive React interface with English and Amharic content.
- A terminal directory backed by the API, with approximate map pins.
- Route search between the sample stations, including example transfers.
- An Express API for health checks, station records, and route search.
- OpenStreetMap tiles for the terminal map.

Live vehicle locations, fares, service times, crowd reports, user accounts, and a verified nationwide route dataset are not implemented.

## Technology

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, React Leaflet.
- **Backend:** Node.js, TypeScript, Express.
- **Map:** Leaflet with OpenStreetMap tiles.

## Requirements

- Node.js 20.19 or newer (Node.js 24 is supported).
- npm, included with Node.js.
- An internet connection for installing packages and loading map tiles.

In Windows PowerShell, use `npm.cmd` if the `npm` command is blocked by the PowerShell script execution policy. This project does not require changing that policy.

## Run locally

Open two PowerShell terminals in the repository folder. Start the API first.

**Terminal 1 — API**

```powershell
cd backend
npm.cmd ci
npm.cmd run dev
```

The API listens on `http://localhost:3000`. If the TypeScript watcher fails in your environment, build and run the compiled server:

```powershell
npm.cmd run build
npm.cmd start
```

**Terminal 2 — web app**

```powershell
cd frontend
npm.cmd ci
npm.cmd run dev
```

Open the local Vite URL printed in the terminal, normally `http://localhost:5173`. Vite forwards `/api` requests to the local API.

Check the API at `http://localhost:3000/api/health`.

## Configuration

The API defaults to port `3000` and allows the Vite development origin `http://localhost:5173`.

For a different API port or frontend origin, set these optional variables in `backend/.env`:

```dotenv
PORT=3000
FRONTEND_URL=http://localhost:5173
```

For a deployed frontend, set `VITE_API_URL` to the API's base URL at frontend build time. Leave it unset for local development with the Vite proxy.

## API reference

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Check that the API is running. |
| `GET` | `/api/terminals` | List the terminal directory. |
| `GET` | `/api/terminals/:id` | Read one terminal record. |
| `GET` | `/api/routes/search?from=Bole&to=Mexico` | Search the current example connections. |

Route search accepts the sample names Bole, Mexico, and Megenagna. Responses identify the results as unverified. Add locally confirmed data before expanding these results.

## Project layout

```text
backend/
  src/data/       Starter terminal records
  src/routes/     Health, terminal, and route endpoints
  src/types/      API data types
frontend/
  src/components/ Reusable UI and map components
  src/i18n/       English and Amharic copy
  src/api.ts      Frontend API client and data types
```

## Build

Run these commands from their respective folders:

```powershell
# backend
npm.cmd run build

# frontend
npm.cmd run build
```

## Data and contributions

Before publishing operational information, confirm terminal names, spellings, coordinates, route directions, transfer points, fares, and operating hours with local operators and riders. Record the source and date of each verification, and keep unverified information visibly labelled. Do not infer live crowd or waiting-time estimates from sample values.
