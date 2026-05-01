# App Health Monitor

App Health Monitor is an Omarchy-native dashboard for inspecting verifier results, missing scripts, and blueprint drift across a catalog.

```bash
npm install
npm run theme:css
npm run dev
```

It dogfoods the verification loop:

```bash
omarchy-native verify .
omarchy-native app catalog ../../examples --json
npm run verify:examples
```
