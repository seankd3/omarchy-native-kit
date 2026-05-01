# Container Runtime Dashboard

A dashboard dogfood app for inspecting Podman and Docker services, socket exposure, image trust, volume mounts, and rollback-safe container runtime changes.

```bash
npm install
npm run theme:css
npm run dev
```

The app imports `src/omarchy-theme.css` before local styles so every visible color is driven by Omarchy semantic tokens.
