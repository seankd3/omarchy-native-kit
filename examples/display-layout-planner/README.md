# Display Layout Planner

A dashboard dogfood app for planning monitor arrangements, scaling, color temperature, and workspace placement before applying display config.

The app starts on the operational surface: display roles, resolution and scale settings, workspace assignments, readiness signals, and guarded apply commands. Styling comes from `src/omarchy-theme.css`, with app CSS consuming `--omarchy-*` variables.

```bash
npm install
npm run theme:css
npm run dev
```

Useful kit checks from the repository root:

```bash
omarchy-native verify examples/display-layout-planner --build
omarchy-native app desktop examples/display-layout-planner --name "Display Layout Planner"
omarchy-native app hook examples/display-layout-planner
```
