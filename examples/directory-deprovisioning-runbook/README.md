# Directory Deprovisioning Runbook

A studio dogfood app for inspecting deprovisioning tasks, suspended identities, app offboarding
queues, orphaned sessions, manager sign-off, exception holds, and rollback-safe account
disablement.

```bash
npm install
npm run dev
npm run build
```

The app imports `src/omarchy-theme.css` before local styles so every visible color is driven by
Omarchy semantic tokens.
