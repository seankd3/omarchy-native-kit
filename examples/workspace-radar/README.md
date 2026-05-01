# Workspace Radar

Workspace Radar is an Omarchy-native dashboard for scanning active workspaces, focused windows, and keybinding coverage.

```bash
npm install
npm run theme:css
npm run dev
```

It dogfoods the dashboard blueprint contract:

```bash
omarchy-native verify .
omarchy-native app desktop . --out workspace-radar.desktop
omarchy-native app hook . --out theme-set
```
