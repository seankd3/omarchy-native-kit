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
  - `theme shell`
  - `theme gtk`
  - `theme qt`
  - `theme sync`
  - `theme watch`
  - `agent json`
  - `agent prompt`
  - `agent blueprint`
  - `create`
  - `verify`
  - `app desktop`
  - `app hook`
  - `app catalog`
- React/Vite starter template.
- Agent context, prompt, and blueprint contracts for coding agents.
- App contract verifier for generated apps.
- Blueprint-backed app catalog generation.
- Hard-coded hex color detection in generated app verification.
- Multi-app verification from a single `omarchy-native verify` invocation.
- Directory verification for blueprint-backed app sets with `omarchy-native verify --all`.
- Optional build execution during app verification with `omarchy-native verify --build`.
- Example app verification scripts for fast contract checks and build-enabled handoff checks.
- Blueprint/package name consistency checks in generated app verification.
- Theme script checks in generated app verification.
- `.desktop` launcher generation.
- Opt-in theme hook script generation.
- Dogfood apps:
  - `accessibility-contrast-auditor`
  - `hello-omarchy-native`
  - `agent-context-lab`
  - `signal-desk`
  - `theme-forge`
  - `hook-station`
  - `workspace-radar`
  - `prompt-foundry`
  - `native-gallery`
  - `release-console`
  - `aur-packager`
  - `theme-migration-lab`
  - `ops-deck`
  - `docs-reader`
  - `app-health-monitor`
  - `shortcut-trainer`
  - `focus-flight-recorder`
  - `window-rule-lab`
  - `config-diff-studio`
  - `session-restore-planner`
  - `portal-permission-center`
  - `backup-restore-console`
  - `camera-microphone-permission-lab`
  - `notification-routing-board`
  - `power-profile-switchboard`
  - `privacy-indicator-monitor`
  - `audio-device-mixer`
  - `network-profile-mapper`
  - `display-layout-planner`
  - `input-method-studio`
  - `workspace-automation-builder`
  - `credential-session-vault`
  - `clipboard-history-curator`
  - `desktop-entry-inspector`
  - `package-update-coordinator`
  - `journal-timeline-inspector`
  - `service-restart-orchestrator`
  - `screen-capture-permission-lab`
  - `sandbox-policy-simulator`
  - `sensor-access-ledger`
  - `environment-variable-auditor`
  - `locale-timezone-manager`
  - `font-rendering-tuner`
  - `trust-zone-mapper`
  - `cursor-pointer-theme-studio`
  - `icon-theme-coordinator`
  - `mime-defaults-workbench`
  - `portal-file-picker-lab`
- Ecosystem map and CI workflow template.
