# Zwe (Kai) — Portfolio

A white, black, and red portfolio with a fixed Grainient background, an interactive project wheel, seven project sections, and galleries for supplied local work.

## Run locally

```powershell
npm install
npm run dev
```

Use the URL printed by Vite. Build with `npm run build`; preview with `npm run preview`.

The four films are embedded from YouTube, so the website does not need to upload or stream local video files. GitHub Pages can host the built static site; the included GitHub Actions workflow builds `dist/` and publishes it. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. Visitors need access to YouTube for embedded playback.

## Project map

```text
src/App.jsx                 Portfolio content and interactions
src/Grainient.jsx           Fixed grainy-gradient background
src/FlexCarousel.jsx        First Exhibition gallery
src/MorphSlider.jsx         Photography gallery
src/Masonry.jsx             Graphic Design gallery
src/TiltedCard.jsx          Second Exhibition cards
src/OptionWheel.jsx         Curved project selector
src/main.jsx                React entry point
styles.css                  Responsive layout and palette
public/site-assets/         Optimized local artwork and supplied logos
```

The background uses OGL; animated galleries use GSAP and Motion. The contact email remains a placeholder in `src/App.jsx`.
