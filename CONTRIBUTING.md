# Contributing

Omarchy Native Kit is small on purpose. Contributions should make it easier for people or coding agents to build theme-aware, keyboard-first apps that feel native on Omarchy.

## Local Setup

```bash
npm install
npm test
npm run verify:examples
```

## Useful Commands

```bash
npm run build
npm run typecheck
npm test
npm run verify:examples
node dist/cli.js agent blueprint --app my-app --kind dashboard --colors tests/fixtures/colors.basic.toml
node dist/cli.js create /tmp/my-app --template react-vite --kind dashboard --colors tests/fixtures/colors.basic.toml
node dist/cli.js verify /tmp/my-app
```

## Contribution Areas

- Add emitters for GTK, Qt, shell exports, or other native surfaces.
- Improve blueprint profiles and app verification checks.
- Build new dogfood apps from `docs/ecosystem.md`.
- Add visual regression checks for generated apps.
- Improve docs for packaging and Omarchy integration.

## Expectations

- Keep runtime dependencies minimal.
- Avoid mutating Omarchy-managed files.
- Preserve generated app contracts: `omarchy-blueprint.json`, `src/omarchy-theme.css`, and `omarchy-native verify`.
- Add focused tests for CLI, library, or parser behavior.
- Run `npm test` before opening a pull request.
