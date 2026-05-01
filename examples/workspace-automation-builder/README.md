# Workspace Automation Builder

A studio dogfood app for composing workspace triggers, app launch rules, hooks, and rollback-safe automation recipes.

The app starts on the staging surface: automation recipes, trigger rules, generated hook commands, app launch sets, and rollback guardrails. Styling comes from `src/omarchy-theme.css`, with app CSS consuming `--omarchy-*` variables.

```bash
npm install
npm run theme:css
npm run dev
```

Useful kit checks from the repository root:

```bash
omarchy-native verify examples/workspace-automation-builder --build
omarchy-native app desktop examples/workspace-automation-builder --name "Workspace Automation Builder"
omarchy-native app hook examples/workspace-automation-builder
```
