# Locale Timezone Manager

A dashboard dogfood app for comparing locale, timezone, keyboard, and clock settings across shells, desktop sessions, and services before applying changes.

```bash
npm install
npm run theme:css
npm run dev
```

The app imports `src/omarchy-theme.css` before `src/styles.css`, so every visible color is driven by generated `--omarchy-*` tokens.

Useful kit checks:

```bash
omarchy-native verify examples/locale-timezone-manager --build
omarchy-native app desktop examples/locale-timezone-manager --name "Locale Timezone Manager"
omarchy-native app hook examples/locale-timezone-manager
```
