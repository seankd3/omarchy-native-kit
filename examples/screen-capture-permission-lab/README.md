# Screen Capture Permission Lab

A studio dogfood app for inspecting screenshot and screen-share portals, monitor selection, persistent grants, and per-app capture expectations.

```bash
npm install
npm run theme:css
npm run dev
```

The app imports `src/omarchy-theme.css` before `src/styles.css`, so every visible color is driven by generated `--omarchy-*` tokens.

Useful kit checks:

```bash
omarchy-native verify examples/screen-capture-permission-lab --build
omarchy-native app desktop examples/screen-capture-permission-lab --name "Screen Capture Permission Lab"
omarchy-native app hook examples/screen-capture-permission-lab
```
