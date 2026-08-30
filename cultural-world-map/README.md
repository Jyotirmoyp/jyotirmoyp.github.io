# A Cultural Map of the World

A minimalist, interactive world map. Hover a country to highlight it, click to
zoom in and read about it, then click a city to see a closer look. Pure
HTML/CSS/JS — no build step, so it runs directly on GitHub Pages.

## How it's built

- `index.html` — page structure (map + sidebar)
- `css/style.css` — all styling (white background, low-contrast type)
- `js/main.js` — map rendering and interaction, using [D3.js](https://d3js.org/) for the geographic projection, zoom, and path drawing
- `data/countries.geo.json` — real country border geometry (Natural Earth data via the `world-atlas` dataset), pre-converted so no build tools are needed
- `data/content.js` — your cultural content, plain JavaScript object

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

## Adding a country

Open `data/content.js`. Add an entry keyed by the country's
[ISO 3166-1 alpha-2 code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)
(e.g. `"DE"` for Germany, `"MX"` for Mexico):

```js
DE: {
  name: "Germany",
  description: "A short paragraph about the country's culture.",
  images: [
    { caption: "Caption text", color: "#c9a86a" } // placeholder swatch
  ],
  cities: [
    {
      name: "Berlin",
      coords: [13.405, 52.52], // [longitude, latitude]
      description: "A short paragraph about the city.",
      images: [{ caption: "Caption text", color: "#8a8577" }]
    }
  ]
}
```

Only countries with an entry here become clickable with content — every
other country still highlights on hover, but shows a "no notes yet" message
if clicked, so you can add countries gradually.

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
