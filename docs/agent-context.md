# Agent Context Contract

`omarchy-native agent json` emits a small JSON contract that coding agents can ingest before generating an Omarchy-native UI.

```bash
omarchy-native agent json
omarchy-native agent prompt
```

For deterministic generation in tests or CI:

```bash
omarchy-native agent json --colors tests/fixtures/colors.basic.toml
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
