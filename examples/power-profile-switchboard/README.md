# Power Profile Switchboard

A dashboard dogfood app for tuning power profiles, display brightness, idle behavior, and performance modes per workspace.

The app keeps the first screen on the operational surface: workspace policy assignments, brightness meters, shell commands, device signals, and automation guardrails. Styling comes from `src/omarchy-theme.css`, with app CSS consuming `--omarchy-*` variables.

```bash
npm install
npm run theme:css
npm run dev
```

Useful kit checks from the repository root:

```bash
omarchy-native verify examples/power-profile-switchboard --build
omarchy-native app desktop examples/power-profile-switchboard --name "Power Profile Switchboard"
omarchy-native app hook examples/power-profile-switchboard
```
