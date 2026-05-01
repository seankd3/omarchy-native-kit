# Journal Timeline Inspector

A studio dogfood app for inspecting system logs across boots, correlating service failures with updates, and saving annotated incident timelines.

```bash
npm install
npm run theme:css
npm run dev
```

The app imports `src/omarchy-theme.css` before `src/styles.css`, so every visible color is driven by generated `--omarchy-*` tokens.

Useful kit checks:

```bash
omarchy-native verify examples/journal-timeline-inspector --build
omarchy-native app desktop examples/journal-timeline-inspector --name "Journal Timeline Inspector"
omarchy-native app hook examples/journal-timeline-inspector
```
