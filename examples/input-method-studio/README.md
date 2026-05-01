# Input Method Studio

A studio dogfood app for configuring keyboards, pointer devices, layout variants, repeat rates, and per-device workspace behavior.

The app starts on the staging surface: device profiles, layout variants, repeat/acceleration settings, apply commands, and guardrails for rollback checks. Styling comes from `src/omarchy-theme.css`, with app CSS consuming `--omarchy-*` variables.

```bash
npm install
npm run theme:css
npm run dev
```

Useful kit checks from the repository root:

```bash
omarchy-native verify examples/input-method-studio --build
omarchy-native app desktop examples/input-method-studio --name "Input Method Studio"
omarchy-native app hook examples/input-method-studio
```
