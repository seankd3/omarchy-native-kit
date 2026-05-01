# Config Diff Studio

A studio dogfood app for comparing proposed Omarchy config edits against current lines and staging reversible patches before touching live files.

```bash
npm install
npm run theme:css
npm run dev
```

The app imports generated Omarchy CSS variables before app styles, uses only `--omarchy-*` color tokens, and keeps every staged patch keyboard-focusable.

Useful kit checks:

```bash
omarchy-native verify examples/config-diff-studio --build
omarchy-native app desktop examples/config-diff-studio --name "Config Diff Studio"
omarchy-native app hook examples/config-diff-studio
```
