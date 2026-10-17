# Menged

Menged is a bilingual English and Amharic route finder for Addis Ababa's mapped minibus network.

> **Data limits:** Route suggestions use a static AddisMapTransit GTFS snapshot. They are not live taxi locations or seat availability, and routes, service frequency, and stop names can change. Confirm the boarding point with a driver before travelling. Fares are not included.

## What the project includes

- A responsive React interface with English and Amharic content.
- A directory of 953 mapped minibus stops with map pins.
- Route search for direct trips and one-transfer journeys, with selectable alternatives, stop-by-stop details, and mapped line geometry.
- An Express API for health checks, station records, and route search.
- OpenStreetMap tiles for the terminal map.

Live vehicle locations, seat availability, fares, user accounts, and routes outside the Addis Ababa feed are not implemented. The feed includes frequency values, but they are only displayed as source data and are not live arrival predictions.

## Technology

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, React Leaflet.
- **Backend:** Node.js, TypeScript, Express.
- **Map:** Leaflet with OpenStreetMap tiles.

## Requirements

- Node.js 20.19 or newer (Node.js 24 is supported).
- npm, included with Node.js.

## Run locally

Open two PowerShell terminals in the repository folder. Start the API first.

**Terminal 1 — API**

```powershell
cd backend
npm.cmd ci
npm.cmd run dev
```

The API listens on `http://localhost:3000`.

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

## Route data

The minibus GTFS snapshot is stored in `backend/data/gtfs` and attributed to OpenStreetMap contributors and AddisMapTransit under ODbL. See that directory's README for source details and limitations. Route suggestions are calculated from the feed's stop sequences; the app does not report which taxis are currently at a stop.


## Project layout

```text
backend/
  src/data/       GTFS-backed stop and route data loader
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
