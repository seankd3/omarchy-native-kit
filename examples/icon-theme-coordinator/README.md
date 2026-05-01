# Icon Theme Coordinator

A studio dogfood app for comparing icon themes, symbolic icon coverage, launcher glyphs, and file-manager fallbacks across GTK, Qt, browser, and shell surfaces.

```bash
npm install
npm run theme:css
npm run dev
```

The app imports `src/omarchy-theme.css` before `src/styles.css`, so every visible color is driven by generated `--omarchy-*` tokens.

Useful kit checks:

```bash
omarchy-native verify examples/icon-theme-coordinator --build
omarchy-native app desktop examples/icon-theme-coordinator --name "Icon Theme Coordinator"
omarchy-native app hook examples/icon-theme-coordinator
```
