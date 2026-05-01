# Package Update Coordinator

A dashboard dogfood app for planning package updates, pinning holds, comparing risky upgrades, and scheduling rollback-safe maintenance windows.

```bash
npm install
npm run theme:css
npm run dev
```

The app imports `src/omarchy-theme.css` before `src/styles.css`, so every visible color is driven by generated `--omarchy-*` tokens.

Useful kit checks:

```bash
omarchy-native verify examples/package-update-coordinator --build
omarchy-native app desktop examples/package-update-coordinator --name "Package Update Coordinator"
omarchy-native app hook examples/package-update-coordinator
```
