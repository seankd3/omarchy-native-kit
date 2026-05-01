# Agent Guide

Omarchy Native Kit is intentionally agent-friendly. Use it to produce theme-aware app artifacts without guessing at the user's current Omarchy palette.

## Fast Path

```bash
npm install
npm run build
node dist/cli.js agent json --colors tests/fixtures/colors.basic.toml
node dist/cli.js agent prompt --colors tests/fixtures/colors.basic.toml
node dist/cli.js agent blueprint --app signal-desk --kind dashboard --colors tests/fixtures/colors.basic.toml
node dist/cli.js create my-app --template react-vite --kind dashboard --colors tests/fixtures/colors.basic.toml
```

On an Omarchy machine, omit `--colors` to read `~/.config/omarchy/current/theme/colors.toml`.

## What To Consume

- `agent json` is the stable machine contract for coding agents.
- `agent prompt` is a compact text brief for agents that need natural-language design guidance.
- `agent blueprint` is a structured app plan with layout regions, component recipes, token roles, and acceptance checks.
- `theme css` writes `--omarchy-*` variables for app code.
- `theme json` exposes the lower-level raw theme payload.
- `create --kind <kind>` writes `omarchy-blueprint.json` into the generated app for follow-on agent work.

## Build Rules

- Use `--omarchy-*` variables instead of hard-coded colors.
- Keep interfaces keyboard-first, dense, and native-feeling.
- Treat `accent`, `danger`, `success`, `warning`, and `info` as semantic roles.
- Use the generated foreground tokens for contrast-safe text on semantic backgrounds.
- Run `npm test` before committing changes.
