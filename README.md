# IP Neighbors — C-Segment Network Scanner

Enter any IPv4 address, scan all 256 neighbors in the same /24 subnet, and visualize them on a map.

> Data source: Meituan's internal IP geolocation database. Reveals how Chinese apps associate foreign IPs with domestic locations — the same mechanism behind VPN IP leaks.


[中文说明](https://github.com/m2dumpling/ip-neighbors/blob/master/README.zh.md) | [Live Demo](https://m2dumpling.github.io/ip-neighbors/)


## Quick Start

Visit **https://m2dumpling.github.io/ip-neighbors/**

Enter an IPv4 address (e.g. `54.70.174.10`) and click scan. All 256 IPs in the C-segment are queried against Meituan's geolocation API and displayed on a map.

## Features

- 🔍 **C-Segment scan** — scan all 256 IPs in a /24 subnet in ~3 seconds
- 🗺️ **Map visualization** — markers on an interactive Leaflet map with zoom
- 📊 **16×16 grid** — at-a-glance view of which IPs have location data; click to focus map
- 📍 **Detail drill-down** — click any IP to see precise address data (down to building level, e.g. "Sun Yat-sen University South Campus")
- 👤 **Visitor IP detection** — automatically detects your public IP on page load for quick copy-paste
- 📱 **Responsive** — works on desktop and mobile

## How It Works

```
Browser ──── 6 batch requests ────▶ Cloudflare Worker ──── 50 concurrent ────▶ Meituan API
                    ▲                       ▲
                    │ CORS headers          │ No CORS issue
                    │                       │ (server-to-server)
```

1. **Frontend** — pure static HTML/CSS/JS, hosted on GitHub Pages
2. **Proxy** — Cloudflare Worker adds CORS headers and batches requests
3. **Data** — Two Meituan APIs are combined:
   - `locate/v2/ip/loc` — IP → city, province, coordinates
   - `city/latlng` — coordinates → detailed address

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML/CSS/JS, zero dependencies |
| Map | Leaflet + OpenStreetMap |
| Proxy | Cloudflare Workers (free tier) |
| Hosting | GitHub Pages |
| Data | Meituan geolocation API |

## Local Development

```bash
# Deploy _worker.js to Cloudflare Workers first
# Update WORKER constant in index.html with your Worker URL
python -m http.server 8080
# Open http://localhost:8080
```
