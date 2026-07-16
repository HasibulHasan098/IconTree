# IconTree

> Animated Lottie icon library with a searchable web UI, live hover previews, one-click JSON copy, and a simple REST API.

IconTree is a static-first icon browser built with [Astro](https://astro.build) and deployed to Cloudflare. It ships **900+ animated Lottie icons** you can search, preview, and copy — or fetch programmatically via the API.

- 🔎 **Instant search** across name, tags, and category
- ▶️ **Live preview** — icons animate on hover/focus
- 📋 **Copy JSON** — grab the raw Lottie data in one click
- ♾️ **Infinite scroll** — the first 100 icons load on page load, then more stream in as you scroll
- 🧩 **Category filters** — quick chips to narrow the library
- 🌐 **REST API** — search and fetch raw JSON for any framework

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:4321` to browse the library locally.

To build and preview the production bundle:

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
  pages/
    index.astro          # Icon library page (search, filters, infinite-scroll grid)
    docs.astro           # API & integration docs
    icon/
      search.ts          # GET /icon/search?q=&category=&page=&pageSize=
      use/
        [iconname].json.ts  # GET /icon/use/[name].json
  components/
    IconCard.astro       # Card with Lottie hover preview + Copy JSON
    IconPlayer.astro     # Lazy Lottie player (loads on hover)
    SearchBar.astro      # Debounced search input
    FilterChips.astro    # Category filter chips
  layouts/
    Layout.astro         # Shared layout shell
  lib/
    manifest.ts          # Manifest reader + search utilities
    generate-manifest.ts # Build script: scans /icons, generates manifest.json, copies to public/
  styles/
    global.css           # Design tokens + component styles
icons/                    # Drop Lottie .json files here (source of truth)
public/
  favicon.svg
  _headers                # Cache-Control headers for Cloudflare Pages
```

## How It Works

1. **Source of truth:** Drop `.json` Lottie files into `/icons`.
2. **Build step:** `npm run build` runs `generate-manifest.ts`, which:
   - Scans `/icons/*.json`
   - Derives name, slug, tags, and category from each filename
   - Generates `src/lib/manifest.json`
   - Copies all icons to `public/icons/` for static serving
3. **Library page (`/`):**
   - Renders the **first 100 icons** on load.
   - An `IntersectionObserver` watches a sentinel element at the bottom of the grid. As you scroll, the next batch (100 at a time) is appended until the full library is shown.
   - Search and category filters recompute the result set and reset pagination to page one.
   - On hover/focus, each card lazily loads and plays its Lottie animation. Click **Copy JSON** to copy the raw animation data.
4. **API:**
   - `GET /icon/search?q=&category=&page=&pageSize=` — search across name, tags, and category
   - `GET /icon/use/[name].json` — returns the raw Lottie JSON with long-term cache headers

## Adding a New Icon

1. Drop your `.json` Lottie file into the `/icons` folder.
2. Run `npm run build` (or `npm run dev` — the manifest regenerates automatically).

The filename is used as the icon's display name and slug. The build script strips the `iconsax-` prefix and derives tags/categories automatically from the filename.

## API Reference

### `GET /icon/search?q=<query>&category=<cat>&page=<n>&pageSize=<size>`

```json
{
  "query": "arrow",
  "category": "",
  "count": 12,
  "results": [
    {
      "name": "arrow-right-bold",
      "slug": "arrow-right-bold",
      "filename": "arrow-right-bold.json",
      "tags": ["arrow", "direction", "ui"],
      "category": "navigation",
      "size": 1583,
      "url": "/icon/use/arrow-right-bold.json"
    }
  ]
}
```

| Param      | Description                              | Default |
| ---------- | ---------------------------------------- | ------- |
| `q`        | Search text (name / tags / category)     | `""`    |
| `category` | Optional category filter                 | `""`    |
| `page`     | Page number (1-based)                    | `1`     |
| `pageSize` | Batch size. Use `20` for scrolling UIs.  | `20`    |

### `GET /icon/use/<iconname>.json`

Returns the raw Lottie JSON file. Returns `404` with `{"error":"icon not found","name":"..."}` if the icon doesn't exist.

## Docs

Full integration guides (Android, JavaScript, React, Node.js, Python, curl) live at the in-app **[Docs](/docs)** page.

## Deployment (Cloudflare Pages)

1. Connect your repo to Cloudflare Pages.
2. Build command: `npm run build`
3. Output directory: `dist`
4. No extra environment variables needed.

The `nodejs_compat` compatibility flag is enabled in `astro.config.mjs` so the Pages Functions can use Node.js `fs`/`path` APIs to read icon files at runtime.

## Repository

GitHub: [https://github.com/HasibulHasan098/IconTree](https://github.com/HasibulHasan098/IconTree)

## Design

- Light, minimal UI with restrained accent color (`#0066FF`)
- System sans-serif typography (Inter)
- Icons play on hover; copy button appears on hover/focus
- Search calls the API under the hood (debounced)
- Category filter chips above the grid
- First 100 icons load immediately; the rest stream in on scroll (infinite scroll)
