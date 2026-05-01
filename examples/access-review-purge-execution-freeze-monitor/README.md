# Access Review Purge Execution Freeze Monitor

A studio dogfood app for inspecting approved-but-frozen archive purge executions, reconciliation packet locks, legal hold re-freezes, delegated owner pause acknowledgements, retry hash freeze proofs, checksum acceptance freezes, and rollback-safe thaw packets.

```bash
npm install
npm run build
npm run dev
```

The app imports `src/omarchy-theme.css` before `src/styles.css` so every visible color is driven by generated Omarchy theme tokens.
