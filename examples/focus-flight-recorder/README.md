# Focus Flight Recorder

A studio dogfood app for capturing keyboard navigation paths and inspecting where focus lands across Omarchy-native surfaces.

```bash
npm install
npm run theme:css
npm run dev
```

The app imports generated Omarchy CSS variables before app styles, uses only `--omarchy-*` color tokens, and keeps every interactive row visibly focusable.

Useful kit checks:

```bash
omarchy-native verify examples/focus-flight-recorder --build
omarchy-native app desktop examples/focus-flight-recorder --name "Focus Flight Recorder"
omarchy-native app hook examples/focus-flight-recorder
```
