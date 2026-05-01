# Notification Routing Board

A dashboard dogfood app for designing notification routes, quiet-hour windows, and escalation rules across Omarchy-native apps.

It keeps the first screen on the operational surface: live routes, muted routes, review-needed policies, per-app destinations, quiet windows, and escalation guardrails. Styling comes from `src/omarchy-theme.css` and app CSS only consumes `--omarchy-*` variables.

```bash
npm install
npm run theme:css
npm run dev
```

Useful kit checks from the repository root:

```bash
omarchy-native verify examples/notification-routing-board --build
omarchy-native app desktop examples/notification-routing-board --name "Notification Routing Board"
omarchy-native app hook examples/notification-routing-board
```
