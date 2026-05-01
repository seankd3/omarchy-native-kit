# Window Rule Lab

A studio dogfood app for drafting Omarchy window/workspace rules and previewing which windows they affect before touching a live config.

```bash
npm install
npm run theme:css
npm run dev
```

The app imports generated Omarchy CSS variables before app styles, uses only `--omarchy-*` color tokens, and keeps every draft rule keyboard-focusable.

Useful kit checks:

```bash
omarchy-native verify examples/window-rule-lab --build
omarchy-native app desktop examples/window-rule-lab --name "Window Rule Lab"
omarchy-native app hook examples/window-rule-lab
```
