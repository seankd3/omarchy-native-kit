# Portal File Picker Lab

A studio dogfood app for inspecting file chooser portals, recent-file exposure, sandbox handoffs, and per-app document access expectations.

```bash
npm install
npm run theme:css
npm run dev
```

The app imports `src/omarchy-theme.css` before `src/styles.css`, so every visible color is driven by generated `--omarchy-*` tokens.

Useful kit checks:

```bash
omarchy-native verify examples/portal-file-picker-lab --build
omarchy-native app desktop examples/portal-file-picker-lab --name "Portal File Picker Lab"
omarchy-native app hook examples/portal-file-picker-lab
```
