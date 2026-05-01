const targets = [
  { name: 'Signal Desk', path: 'examples/signal-desk', state: 'Ready', script: 'theme-set-signal' },
  { name: 'Theme Forge', path: 'examples/theme-forge', state: 'Review', script: 'theme-set-forge' },
  { name: 'Agent Context Lab', path: 'examples/agent-context-lab', state: 'Synced', script: 'theme-set-agent' }
];

const checks = [
  'writes only to requested output path',
  'refreshes src/omarchy-theme.css',
  'leaves Omarchy config untouched',
  'keeps script executable after export'
];

const scriptLines = [
  '#!/usr/bin/env sh',
  'set -eu',
  "APP_PATH='examples/theme-forge'",
  "CSS_PATH=\"$APP_PATH/src/omarchy-theme.css\"",
  "'omarchy-native' theme sync --out \"$CSS_PATH\""
];

export function App() {
  return (
    <main className="stationShell">
      <aside className="rail" aria-label="Hook station modes">
        {['A', 'S', 'P', 'V'].map((label, index) => (
          <button className={index === 1 ? 'railButton active' : 'railButton'} key={label} type="button" title={label}>
            {label}
          </button>
        ))}
      </aside>

      <section className="workspace" aria-label="Theme hook workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">omarchy.hooks</p>
            <h1>Hook Station</h1>
          </div>
          <button className="primaryAction" type="button">
            Export Hook
          </button>
        </header>

        <div className="contentGrid">
          <section className="targetList" aria-label="App targets">
            {targets.map((target, index) => (
              <button className={index === 1 ? 'targetRow selected' : 'targetRow'} key={target.name} type="button">
                <span>
                  <strong>{target.name}</strong>
                  <small>{target.path}</small>
                </span>
                <em>{target.state}</em>
              </button>
            ))}
          </section>

          <section className="scriptPane" aria-label="Generated hook preview">
            <div className="scriptHeader">
              <span>theme-set-forge</span>
              <strong>755</strong>
            </div>
            <pre>
              {scriptLines.map((line, index) => (
                <span key={line}>
                  <i>{index + 1}</i>
                  {line}
                </span>
              ))}
            </pre>
          </section>
        </div>
      </section>

      <aside className="properties" aria-label="Hook properties">
        <div className="panelTitle">
          <h2>Install Guard</h2>
          <span>opt-in</span>
        </div>

        <label className="field">
          App path
          <input value="examples/theme-forge" readOnly />
        </label>

        <label className="field">
          Output script
          <input value="./theme-set" readOnly />
        </label>

        <div className="toggleRow">
          <span>
            <strong>Executable</strong>
            <small>chmod 755 after write</small>
          </span>
          <input type="checkbox" checked readOnly aria-label="Executable hook script" />
        </div>

        <div className="checkStack" aria-label="Safety checks">
          {checks.map((check) => (
            <div className="checkItem" key={check}>
              <span aria-hidden="true" />
              {check}
            </div>
          ))}
        </div>

        <button className="secondaryAction" type="button">
          Generate Preview
        </button>
      </aside>
    </main>
  );
}
