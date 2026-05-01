# Changelog

All notable changes are tracked here.

## 0.0.0

Initial public seed of Omarchy Native Kit.

### Added

- Theme discovery for Omarchy's current theme directory.
- `colors.toml` parsing with validation and friendly errors.
- Semantic token mapping with contrast-aware foregrounds.
- CSS and JSON theme emitters.
- Shell export theme emitter.
- GTK CSS theme emitter.
- Qt palette theme emitter.
- CLI commands:
  - `doctor`
  - `theme json`
  - `theme css`
  - `theme sync`
  - `theme watch`
  - `agent json`
  - `agent prompt`
  - `agent blueprint`
  - `create`
  - `verify`
  - `app desktop`
- React/Vite starter template.
- Agent context, prompt, and blueprint contracts for coding agents.
- App contract verifier for generated apps.
- Hard-coded hex color detection in generated app verification.
- `.desktop` launcher generation.
- Opt-in theme hook script generation.
- Dogfood apps:
  - `hello-omarchy-native`
  - `agent-context-lab`
  - `signal-desk`
  - `theme-forge`
- Ecosystem map and CI workflow template.
