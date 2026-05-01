# Backup Restore Console

A dashboard dogfood app for checking app state backups, restore points, and rollback readiness before applying risky Omarchy-native workflow changes.

```bash
npm install
npm run theme:css
npm run dev
```

The app imports generated Omarchy CSS variables before app styles, uses only `--omarchy-*` color tokens, and keeps every backup job keyboard-focusable.

Useful kit checks:

```bash
omarchy-native verify examples/backup-restore-console --build
omarchy-native app desktop examples/backup-restore-console --name "Backup Restore Console"
omarchy-native app hook examples/backup-restore-console
```
