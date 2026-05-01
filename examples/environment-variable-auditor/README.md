# Environment Variable Auditor

A studio dogfood app for inspecting shell, desktop, and service environments, comparing mismatched variables, and staging clean export fixes.

```bash
npm install
npm run theme:css
npm run dev
```

The app imports `src/omarchy-theme.css` before `src/styles.css`, so every visible color is driven by generated `--omarchy-*` tokens.

Useful kit checks:

```bash
omarchy-native verify examples/environment-variable-auditor --build
omarchy-native app desktop examples/environment-variable-auditor --name "Environment Variable Auditor"
omarchy-native app hook examples/environment-variable-auditor
```
