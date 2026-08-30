# A Cultural Map of the World

A minimalist, interactive world map. Hover a country to highlight it, click to
zoom in and read about it, then click a city to see a closer look. Pure
HTML/CSS/JS — no build step, so it runs directly on GitHub Pages.

## How it's built

- `index.html` — page structure (map + sidebar)
- `css/style.css` — all styling (white background, low-contrast type)
- `js/main.js` — map rendering and interaction, using [D3.js](https://d3js.org/) for the geographic projection, zoom, and path drawing. Loaded as an ES module (`<script type="module">`), so it can `import` the content files directly — no build step needed.
- `data/countries.geo.json` — real country border geometry (Natural Earth data via the `world-atlas` dataset), pre-converted so no build tools are needed
- `data/index.js` — the top-level manifest that imports every country and maps it to its ISO code
- `data/countries/<iso-code>/` — one folder per country:
  - `country.js` — country-level name, description, images
  - `cities/<city>.js` — one file per city: overview, travel plan, cultural aspects, folk culture, music, images
  - `index.js` — combines `country.js` with its `cities/*.js` files into one object

This keeps each place's content in its own small file instead of one large
file, while still needing zero build tools — native browser ES modules
handle the imports directly, both locally and on GitHub Pages.

## Publish it on GitHub Pages

1. Create a new repository on GitHub and push these files to it (the whole
   `site` folder's contents should sit at the repo root, so `index.html` is
   at the top level).
   ```bash
   git init
   git add .
   git commit -m "Initial cultural map"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
2. On GitHub: **Settings → Pages → Source → Deploy from a branch**, pick
   `main` and `/ (root)`, save.
3. Your site will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO/`
   within a minute or two.

No server, database, or build process required — it's fully static.

### Testing locally before you push

Because the site uses ES modules and `fetch()` for the map data, opening
`index.html` directly from disk (`file://...`) won't work — browsers block
module imports and fetches over `file://` for security reasons. Run a tiny
local server from the project folder instead, then visit the printed URL:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Adding a country

Use the [ISO 3166-1 alpha-2 code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)
for the country (e.g. `de` for Germany) as the folder name, lowercase.

1. Create `data/countries/de/country.js`:
   ```js
   export default {
     name: "Germany",
     description: "A short paragraph about the country's culture.",
     images: [
       { caption: "Caption text", color: "#c9a86a" } // placeholder swatch
     ]
   };
   ```
2. Create one file per city in `data/countries/de/cities/`, e.g. `berlin.js`:
   ```js
   export default {
     name: "Berlin",
     coords: [13.405, 52.52], // [longitude, latitude]
     overview: "A short paragraph about the city.",
     travelPlan: [
       { day: "Day 1", plan: "What to do on day one." },
       { day: "Day 2", plan: "What to do on day two." }
     ],
     culturalAspects: "A paragraph on the city's cultural character.",
     folkCulture: "A paragraph on folk traditions, crafts, or festivals.",
     music: "A paragraph on local or traditional music.",
     images: [{ caption: "Caption text", color: "#8a8577" }]
   };
   ```
3. Create `data/countries/de/index.js` to combine them:
   ```js
   import country from "./country.js";
   import berlin from "./cities/berlin.js";

   export default { ...country, cities: [berlin] };
   ```
4. Register it in `data/index.js`:
   ```js
   import de from "./countries/de/index.js";
   // ...
   const CONTENT = {
     // ...existing entries
     DE: de
   };
   ```

Only countries registered in `data/index.js` become clickable with content
— every other country still highlights on hover, but shows a "no notes yet"
message if clicked, so you can add countries gradually.

Any field left out (e.g. no `music` yet) is simply skipped in the sidebar —
you don't need to fill in every section before publishing a city.

## Using real photos instead of color placeholders

Right now each image is a flat color swatch (`color: "#hex"`) so the demo
works with zero assets. To use a real photo, put the image file in an
`images/` folder and swap the property:

```js
{ caption: "Fushimi Inari torii path", src: "images/kyoto-fushimi-inari.jpg" }
```

The renderer checks for `src` first, so mixing swatches and real photos
while you gather images is fine.

## Notes on the map data

`data/countries.geo.json` is a simplified (110m resolution) GeoJSON export
of `world-atlas`'s country topology, with names attached via the
`i18n-iso-countries` package. It's intentionally low-resolution to keep the
file small and load fast — good enough for a country-level cultural map. If
you want finer coastlines, swap in `world-atlas`'s `countries-50m.json` and
re-run the same conversion (see the comment at the top of the file's source
generation, or ask for the conversion script).
