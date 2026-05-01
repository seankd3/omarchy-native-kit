# Access Review Purge Resume Execution Sentinel

A studio dogfood app for inspecting resumed archive purge executions, thaw authorization drift, legal hold relapse alerts, delegated owner resume confirmations, retry hash thaw replay, checksum unlock drift, and rollback-safe resume sentinels.

```bash
npm install
npm run build
npm run dev
```

The app imports `src/omarchy-theme.css` before `src/styles.css` so every visible color is driven by generated Omarchy theme tokens.
