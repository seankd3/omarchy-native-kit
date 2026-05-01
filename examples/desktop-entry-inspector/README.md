# Desktop Entry Inspector

A studio dogfood app for auditing `.desktop` launchers, categories, icons, actions, startup hints, and app identity metadata across generated and installed Omarchy apps.

```bash
npm install
npm run theme:css
npm run dev
```

The app imports `src/omarchy-theme.css` before `src/styles.css`, so every visible color is driven by generated `--omarchy-*` tokens.

Useful kit checks:

```bash
omarchy-native verify examples/desktop-entry-inspector --build
omarchy-native app desktop examples/desktop-entry-inspector --name "Desktop Entry Inspector"
omarchy-native app hook examples/desktop-entry-inspector
```
