# Release Checklist

Use this checklist before tagging or publishing a release.

## Verify

```bash
npm ci
npm run typecheck
npm test
npm run verify:examples
npm pack --dry-run
```

## Smoke Test CLI

```bash
node dist/cli.js doctor
node dist/cli.js agent json --colors tests/fixtures/colors.basic.toml
node dist/cli.js agent blueprint --app release-smoke --kind dashboard --colors tests/fixtures/colors.basic.toml
node dist/cli.js create /tmp/release-smoke --template react-vite --kind dashboard --colors tests/fixtures/colors.basic.toml
node dist/cli.js verify /tmp/release-smoke
node dist/cli.js app desktop /tmp/release-smoke --out /tmp/release-smoke.desktop
```

## Update Metadata

- Confirm `README.md` commands match CLI help.
- Confirm `CHANGELOG.md` has the release notes.
- Confirm `package.json` version and repository metadata.
- Confirm `npm pack --dry-run` includes `dist`, `templates`, `README.md`, and `LICENSE`.

## Publish

```bash
npm version patch
npm publish --access public
git push origin main --tags
```

Only publish from a clean worktree after the checks above pass.
