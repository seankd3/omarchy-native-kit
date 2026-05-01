# Network Profile Mapper

A dashboard dogfood app for mapping trusted networks, VPN posture, DNS profiles, and per-workspace connectivity rules.

The app starts on the operational surface: known network trust levels, VPN and DNS posture, workspace-specific route rules, and live connectivity signals. Styling comes from `src/omarchy-theme.css`, with app CSS consuming `--omarchy-*` variables.

```bash
npm install
npm run theme:css
npm run dev
```

Useful kit checks from the repository root:

```bash
omarchy-native verify examples/network-profile-mapper --build
omarchy-native app desktop examples/network-profile-mapper --name "Network Profile Mapper"
omarchy-native app hook examples/network-profile-mapper
```
