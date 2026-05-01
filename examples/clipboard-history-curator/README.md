# Clipboard History Curator

A studio dogfood app for reviewing clipboard history, pinning safe snippets, redacting secrets, and routing copied content by workspace.

The app starts on the review surface: clipboard items, redaction status, source apps, destination routes, pinned safe snippets, and guardrails for secret handling. Styling comes from `src/omarchy-theme.css`, with app CSS consuming `--omarchy-*` variables.

```bash
npm install
npm run theme:css
npm run dev
```

Useful kit checks from the repository root:

```bash
omarchy-native verify examples/clipboard-history-curator --build
omarchy-native app desktop examples/clipboard-history-curator --name "Clipboard History Curator"
omarchy-native app hook examples/clipboard-history-curator
```
