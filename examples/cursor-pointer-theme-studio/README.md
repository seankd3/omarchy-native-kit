# Cursor Pointer Theme Studio

A studio dogfood app for comparing cursor themes, pointer sizes, acceleration, and touchpad behavior across compositor, GTK, Qt, and browser surfaces.

```bash
npm install
npm run theme:css
npm run dev
```

The app imports `src/omarchy-theme.css` before `src/styles.css`, so every visible color is driven by generated `--omarchy-*` tokens.

Useful kit checks:

```bash
omarchy-native verify examples/cursor-pointer-theme-studio --build
omarchy-native app desktop examples/cursor-pointer-theme-studio --name "Cursor Pointer Theme Studio"
omarchy-native app hook examples/cursor-pointer-theme-studio
```
