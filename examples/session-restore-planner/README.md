# Session Restore Planner

A dashboard dogfood app for modeling startup apps, workspace placement, restore order, and readiness checks before committing session automation.

```bash
npm install
npm run theme:css
npm run dev
```

The app imports generated Omarchy CSS variables before app styles, uses only `--omarchy-*` color tokens, and keeps every restore step keyboard-focusable.

Useful kit checks:

```bash
omarchy-native verify examples/session-restore-planner --build
omarchy-native app desktop examples/session-restore-planner --name "Session Restore Planner"
omarchy-native app hook examples/session-restore-planner
```
