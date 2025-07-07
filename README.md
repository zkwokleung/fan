# 🌀 Fan-tastic 3D Fan

> When the summer sun decided my apartment should double as a sauna, I did the only logical thing a dev could do: **built a WebGL fan instead of buying a real one**. Now you can spin it too — and hopefully cool down your CPU while you're at it.

## Why Does This Exist?
Because heat makes us do weird things. Some people buy air-cons, others invent ice-cream soup. **I cracked open Three.js and Vite to summon a digital desk fan**. It might not drop the temperature, but it *does* look cool, has whirring blades, and gives you full power over its destiny.

## Features (a.k.a. Wind Modes)
- 🌀 **Real-time 3D fan** powered by Three.js & GLTF.
- 🛞 Built-in animation — watch those blades spin like your favorite coffee after 6 espressos.
- 🎛️ GUI sliders & buttons to tweak speed, rotation, height, and scale.
- 🌈 Texture-rich model (no bland plastic here).
- 🚀 Deploy-ready with Vite + GitHub Pages.

## Quick Start (blow some air in < 1 min)
```bash
# 1. Clone the coolness
git clone https://github.com/<your-fork>/fan.git
cd fan

# 2. Install propellers
npm install

# 3. Fire up the breeze
npm run dev
```
Open <http://localhost:5174> and bask in the virtual wind.

## Live Demo
Wanna skip the setup and chill right now? Click the link and feel the **pixelated breeze**:

👉 [https://zkwokleung.github.io/fan/](https://zkwokleung.github.io/fan/)

*(Pro tip: press **⏻** to power on, then crank the sliders — but mind your hair!)*

## Contribute & Make It Cooler (literally)
Found a bug? Got an idea for turbo-mode? Want rainbow LED blades? PRs welcome! 🥳

1. Fork → `git checkout -b feat/super-cool`
2. Code / model / meme
3. `git commit -m "feat: add super cool thing"`
4. Open a pull request — screenshots or GIFs highly encouraged.

## License
MIT — because the only thing we don't want to restrict is **air flow**.

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
