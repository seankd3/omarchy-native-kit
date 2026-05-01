# MIME Defaults Workbench

A studio dogfood app for auditing MIME defaults, opener precedence, portal handoffs, browser handlers, and rollback-safe association changes.

```bash
npm install
npm run theme:css
npm run dev
```

The app imports `src/omarchy-theme.css` before `src/styles.css`, so every visible color is driven by generated `--omarchy-*` tokens.

Useful kit checks:

```bash
omarchy-native verify examples/mime-defaults-workbench --build
omarchy-native app desktop examples/mime-defaults-workbench --name "MIME Defaults Workbench"
omarchy-native app hook examples/mime-defaults-workbench
```
