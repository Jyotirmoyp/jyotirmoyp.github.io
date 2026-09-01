# Raga Web

An interactive network map of Hindustani (North Indian) classical music,
built with plain HTML/CSS/JS + D3. No build step, no dependencies to
install — just files.

## Running it

This version uses real ES module `import`/`export` statements across
`data/`, so it must be served over `http://`, not opened directly as a
`file://` path (that's a browser security restriction on modules, not
something specific to this project). From this folder, run one of:

```
python3 -m http.server 8000
```
then open http://localhost:8000 in your browser.

Or, if you have Node:
```
npx serve .
```

## Folder structure

```
raga-web/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── graph.js      — D3 force simulation, expand/collapse, click-to-focus
│   ├── panel.js       — right-hand description panel
│   └── main.js         — entry point: wires buttons, starts the app
└── data/
    ├── index.js          — root: imports the 4 genres
    ├── kheyal/
    │   ├── index.js         — imports its gharanas
    │   ├── agra-gharana/
    │   │   ├── index.js        — imports its musicians
    │   │   ├── faiyaz-khan.js
    │   │   ├── lalith-rao.js
    │   │   └── ...
    │   ├── jaipur-atrauli-gharana/
    │   ├── kirana-gharana/
    │   ├── gwalior-gharana/
    │   ├── patiala-gharana/
    │   └── rampur-sahaswan-gharana/
    ├── dhrupad/
    │   ├── dagarvani-dagar-bani/
    │   ├── darbhanga-gharana/
    │   └── bettiah-gharana/
    ├── instrumental/
    │   ├── sitar/, sarod/, santoor/, bansuri-flute/, sarangi/
    └── baj/
        ├── imdadkhani-baj-etawah-gharana/
        ├── senia-maihar-baj/
        └── senia-gharana/
```

## Adding a musician

1. Create a new file next to their gharana's siblings, e.g.
   `data/kheyal/agra-gharana/some-new-name.js`:

   ```js
   export default {
     name: "Some New Name",
     description: "A sentence or two about them.",
   };
   ```

2. Open that gharana's `index.js` and add an import + list entry:

   ```js
   import someNewName from './some-new-name.js';
   // ...
   children: [ faiyazKhan, lalithRao, ..., someNewName ]
   ```

## Adding a relationship (guru, family, duet partner, etc.)

Give both people an `id`, then add a `relations` array to each side
pointing at the other's `id`:

```js
// teacher.js
export default {
  id: "teacherId",
  name: "...",
  relations: [ { type: "disciple", targetId: "studentId" } ],
};

// student.js
export default {
  id: "studentId",
  name: "...",
  relations: [ { type: "guru", targetId: "teacherId" } ],
};
```

These draw as dashed lines on the graph once both nodes are visible,
and show up as clickable chips in the description panel regardless.

## Adding a whole new gharana or genre

Same pattern one level up: make a folder with its own `index.js` that
imports its children, then import that folder's `index.js` from its
parent and add it to the parent's `children` array.
