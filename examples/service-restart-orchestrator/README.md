# Service Restart Orchestrator

A dashboard dogfood app for planning systemd user and system service restarts, previewing dependency impact, and scheduling safe restart batches.

```bash
npm install
npm run theme:css
npm run dev
```

The app imports `src/omarchy-theme.css` before `src/styles.css`, so every visible color is driven by generated `--omarchy-*` tokens.

Useful kit checks:

```bash
omarchy-native verify examples/service-restart-orchestrator --build
omarchy-native app desktop examples/service-restart-orchestrator --name "Service Restart Orchestrator"
omarchy-native app hook examples/service-restart-orchestrator
```
