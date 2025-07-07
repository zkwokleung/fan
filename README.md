# Interactive 3D Fan

A web-based 3D desk-fan built with [Three.js](https://threejs.org/) and bundled by [Vite](https://vitejs.dev/).

Spin it up locally and you can:

* turn the fan **on / off**
* change its **speed** (slow breeze ➜ turbo)
* tilt / swivel the fan head (**direction**)
* raise or lower the stand (**height**)
* resize the whole model (**scale**)

Everything is controlled through an intuitive panel in the bottom-right corner of the page.

---

## Quick Start

```bash
npm install      # grab dependencies
npm run dev      # launch local dev server (hot-reload)
```

Production build & preview:

```bash
npm run build    # output to dist/
npm run serve    # preview the production build on http://localhost:5000
```

---

## Model Attribution

The animated fan model used in this project was downloaded from Sketchfab:

➡️  [Fan Animation – 3DHaupt](https://sketchfab.com/3d-models/fan-animation-1757576875664d9ab891168a4c01b521)  
Licensed under **CC Attribution-NonCommercial**. Please respect the creator's license if you re-use the asset.

---

## File Structure

```
fan/
├─ public/
│  ├─ models/           # fan.gltf + buffers + textures
│  └─ …
├─ src/
│  ├─ main.js           # Three.js scene + controls
│  └─ style.css         # Global styles
├─ index.html           # Entry HTML
└─ vite.config.js       # Vite configuration
```

---
