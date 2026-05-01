# Release Console

Release Console is an Omarchy-native dashboard for preparing package dry-runs, catalog snapshots, and pre-publish checks.

```bash
npm install
npm run theme:css
npm run dev
```

It dogfoods the release loop:

```bash
npm test
npm run verify:examples
npm run catalog:examples
npm pack --dry-run
```
