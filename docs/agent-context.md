# Agent Context Contract

`omarchy-native agent json` emits a small JSON contract that coding agents can ingest before generating an Omarchy-native UI.

```bash
omarchy-native agent json
omarchy-native agent prompt
omarchy-native agent blueprint --app signal-desk --kind dashboard
```

For deterministic generation in tests or CI:

```bash
omarchy-native agent json --colors tests/fixtures/colors.basic.toml
omarchy-native agent blueprint --app canvas-forge --kind studio --colors tests/fixtures/colors.basic.toml
```

## Schema

The payload uses `schemaVersion: 1` and contains:

- `kit` - the producing package name.
- `purpose` - a one-line description for tool routers and agents.
- `theme` - theme name, source paths, and parser warnings.
- `cssVariables` - each semantic token with its CSS variable, value, and suggested uses.
- `designRules` - practical constraints for building Omarchy-native interfaces.
- `componentPatterns` - reusable UI patterns that map tokens to common controls.
- `commands` - canonical CLI commands for syncing CSS, printing theme JSON, and scaffolding.

Use `agent prompt` when an agent cannot reliably consume JSON, and `agent json` when building workflows that transform the contract into code, design tokens, or generated starter apps.

## Blueprints

`agent blueprint` emits a practical plan for an Omarchy-native app before any files are written. It includes target files, layout regions, component recipes, token roles, interactions, and acceptance checks.

Supported `--kind` values:

- `command-center` - action rows, shortcut-first workflows, and contextual inspection.
- `dashboard` - metric strips, tables, filters, and detail panels.
- `studio` - tool rails, creation canvases, and properties panels.

Unknown kinds fall back to `command-center` so agents still get a usable plan.

## Verification

Generated apps can be audited with:

```bash
omarchy-native verify ./my-app
omarchy-native verify ./my-app --json
```

The verifier checks that the app has package metadata, a valid `omarchy-blueprint.json`, all files named by that blueprint, generated `src/omarchy-theme.css`, and the required import order where theme variables load before app styles.

## Launchers

Generate a `.desktop` entry for a built app with:

```bash
omarchy-native app desktop ./my-app --out my-app.desktop
```

This writes a launcher file only where requested. It does not install into `~/.local/share/applications` or mutate Omarchy configuration.

## Hook Scripts

Generate an opt-in theme sync hook script with:

```bash
omarchy-native app hook ./my-app --out theme-set
```

The generated script syncs `src/omarchy-theme.css` for that app. It is written only to the requested output path and is not installed into Omarchy automatically.
