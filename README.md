# IconTree

Animated JSON icon library and API, built with Astro and deployed to Cloudflare Pages. Serves 490+ Lottie animation icons with a searchable library, live preview, and a simple REST API.

## Quick Start

```bash
npm install
npm run build
npm run preview
```

Open `http://localhost:4321` to browse the library.

## Project Structure

```
src/
  pages/
    index.astro          # Icon library page with search + grid
    docs.astro           # API training / integration docs
    icon/
      search.ts          # GET /icon/search?q=
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
3. **Library page (`/`):** Renders a searchable grid. On hover, each card loads and plays its Lottie animation. Click "Copy JSON" to copy the raw animation data.
4. **API:**
   - `GET /icon/search?q=` — fuzzy search across name, tags, and category
   - `GET /icon/use/[name].json` — returns the raw Lottie JSON with long-term cache headers

## Adding a New Icon

1. Drop your `.json` Lottie file into the `/icons` folder.
2. Run `npm run build` (or `npm run dev` — the manifest regenerates automatically).

The filename is used as the icon's display name and slug. The build script strips the `iconsax-` prefix and derives tags/categories automatically from the filename.

## API Reference

### `GET /icon/search?q=<query>&page=<n>`

```json
{
  "query": "arrow",
  "count": 12,
  "results": [
    {
      "name": "arrow-right-bold",
      "tags": ["arrow", "direction", "ui"],
      "category": "navigation",
      "url": "/icon/use/arrow-right-bold.json"
    }
  ]
}
```

### `GET /icon/use/<iconname>.json`

Returns the raw Lottie JSON file. Returns `404` with `{"error":"icon not found","name":"..."}` if the icon doesn't exist.

## Deployment (Cloudflare Pages)

1. Connect your repo to Cloudflare Pages.
2. Build command: `npm run build`
3. Output directory: `dist`
4. No extra environment variables needed.

The `nodejs_compat` compatibility flag is enabled in `astro.config.mjs` so the Pages Functions can use Node.js `fs`/`path` APIs to read icon files at runtime.

## Design

- Light, minimal UI with restrained accent color (`#0066FF`)
- System sans-serif typography (Inter)
- Icons play on hover; copy button appears on hover/focus
- Search calls the API under the hood (debounced)
- Category filter chips above the grid
