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
node dist/cli.js theme sync --out my-app/src/omarchy-theme.css --colors tests/fixtures/colors.basic.toml
node dist/cli.js theme shell --out my-app/omarchy-theme.env --colors tests/fixtures/colors.basic.toml
node dist/cli.js theme gtk --out my-app/gtk.css --colors tests/fixtures/colors.basic.toml
node dist/cli.js theme qt --out my-app/qt.ini --colors tests/fixtures/colors.basic.toml
node dist/cli.js verify my-app --json
node dist/cli.js app desktop my-app --out my-app.desktop
node dist/cli.js app hook my-app --out theme-set
```

On an Omarchy machine, omit `--colors` to read `~/.config/omarchy/current/theme/colors.toml`.

## What To Consume

- `agent json` is the stable machine contract for coding agents.
- `agent prompt` is a compact text brief for agents that need natural-language design guidance.
- `agent blueprint` is a structured app plan with layout regions, component recipes, token roles, and acceptance checks.
- `theme css` writes `--omarchy-*` variables for app code.
- `theme shell` writes `OMARCHY_*` exports for scripts and hooks.
- `theme gtk` writes GTK CSS variables and a small widget baseline.
- `theme qt` writes a Qt-style palette INI for Qt/PySide experiments.
- `theme sync` refreshes app theme CSS once; `theme watch` keeps it updated while developing.
- `theme json` exposes the lower-level raw theme payload.
- `create --kind <kind>` writes `omarchy-blueprint.json` into the generated app for follow-on agent work.
- `verify <path>` audits generated app contracts before handoff.
- `app desktop <path>` generates a launcher entry without installing it.
- `app hook <path>` generates a theme sync hook script without installing it.

## Build Rules

- Use `--omarchy-*` variables instead of hard-coded colors.
- Keep interfaces keyboard-first, dense, and native-feeling.
- Treat `accent`, `danger`, `success`, `warning`, and `info` as semantic roles.
- Use the generated foreground tokens for contrast-safe text on semantic backgrounds.
- Run `npm test` before committing changes.
- Run `node dist/cli.js verify <app>` after editing a generated app.
- Generate a `.desktop` file when handing off an app meant to launch from Omarchy.
- Generate a hook script only as an opt-in artifact; do not mutate Omarchy hooks automatically.
