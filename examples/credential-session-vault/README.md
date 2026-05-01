# Credential Session Vault

A studio dogfood app for staging session secrets, SSH agents, keyring readiness, and per-workspace credential exposure.

The app starts on the security surface: credential lanes, keyring/agent state, TTLs, workspace exposure policies, and revocation guardrails. Styling comes from `src/omarchy-theme.css`, with app CSS consuming `--omarchy-*` variables.

```bash
npm install
npm run theme:css
npm run dev
```

Useful kit checks from the repository root:

```bash
omarchy-native verify examples/credential-session-vault --build
omarchy-native app desktop examples/credential-session-vault --name "Credential Session Vault"
omarchy-native app hook examples/credential-session-vault
```
