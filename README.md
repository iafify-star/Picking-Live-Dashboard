# Picking Live Dashboard · noon minutes

A real-time picking productivity dashboard that reads directly from a Google Sheet and displays hourly performance per picker.

![noon minutes](assets/noon-minutes-logo.png)

---

## Features

- 📊 **Hourly matrix** — one row per picker, one column per hour, with quantity & distinct SKU count in each cell
- 🔥 **Heat map coloring** — empty → low → medium → busiest hour
- 📅 **Date range filter** — select any range or tap a day chip
- 🔍 **Live search** — filter by username or employee name
- 📈 **KPI cards** — total qty, SKU count, active pickers, last active hour
- 📥 **Excel export** — download the current view as `.xls`
- 🔄 **Auto-refresh** — every 60 seconds

---

## Running Locally (Windows — no Node.js needed)

The project includes a built-in PowerShell web server.

### 1. Clone or download the project

```
git clone https://github.com/your-org/picking-live-dashboard.git
cd "pick dash"
```

### 2. Start the dashboard

Double-click **`start.bat`** — or run in PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File server.ps1
```

The server starts on **http://127.0.0.1:5500** and opens automatically in your browser.

### What the local server does

| Script | Purpose |
|---|---|
| `server.ps1` | HTTP server on port 5500, serves static files and `/api/data` |
| `refresh-data.ps1` | Pulls the picking CSV from Google Sheets and writes `cache/data.json` |
| `refresh-names.ps1` | Pulls HR attendance sheets and writes `cache/names.json` (refreshes every 30 min) |
| `start.bat` | One-click launcher for `server.ps1` |

---

## Deploying to Vercel

The serverless function at `api/data.js` fetches and aggregates data on every request — no cache needed on Vercel (Vercel handles edge caching).

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

> **Note:** The Google Sheets must be either public or shared with anyone who has the link. No API key is required — the dashboard uses the CSV export URL.

---

## Project Structure

```
pick dash/
├── index.html            Main dashboard page
├── styles.css            All styles
├── app.js                Frontend logic (fetch, filter, render, export)
├── package.json          Minimal Node config for Vercel
├── vercel.json           Vercel function settings & CORS headers
├── server.ps1            Local PowerShell HTTP server
├── refresh-data.ps1      Picking data refresh script
├── refresh-names.ps1     HR names refresh script
├── start.bat             One-click launcher
├── .env.example          Environment variable reference
├── api/
│   └── data.js           Vercel serverless function (fetches & aggregates CSV)
├── assets/
│   └── noon-minutes-logo.png
└── cache/                Auto-generated (gitignored)
    ├── data.json
    └── names.json
```

---

## Data Sources

| Source | What it provides |
|---|---|
| Picking Sheet (`PICK_SHEET_ID`) | Raw picks: `username`, `sku`, `picked_at`, `line_status` |
| HR Attendance Sheet (`NAMES_SHEET_ID`) | Maps employee ID → full name (25 hub tabs) |

---

## Designed by Ibrahim Afify
