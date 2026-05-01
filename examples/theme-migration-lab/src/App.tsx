const tokens = [
  { name: 'background', before: 'current base', after: 'new base', risk: 'low' },
  { name: 'surface', before: 'panel dark', after: 'panel calm', risk: 'low' },
  { name: 'accent', before: 'blue focus', after: 'cyan focus', risk: 'review' },
  { name: 'warning', before: 'amber', after: 'gold', risk: 'check' }
];

const apps = [
  { name: 'Theme Forge', status: 'previewed' },
  { name: 'Native Gallery', status: 'queued' },
  { name: 'Release Console', status: 'queued' },
  { name: 'AUR Packager', status: 'check' }
];

const commands = [
  'omarchy-native theme sync --out src/omarchy-theme.css',
  'omarchy-native app catalog ./examples --json',
  'npm run verify:examples'
];

export function App() {
  return (
    <main className="migrationShell">
      <aside className="rail" aria-label="Migration modes">
        {['Compare', 'Preview', 'Rollout', 'Verify'].map((mode, index) => (
          <button className={index === 0 ? 'railButton active' : 'railButton'} key={mode} type="button" title={mode}>
            {mode.slice(0, 1)}
          </button>
        ))}
      </aside>

      <section className="comparePane" aria-label="Theme token comparison">
        <header className="mast">
          <div>
            <p className="eyebrow">omarchy.theme.migration</p>
            <h1>Theme Migration Lab</h1>
          </div>
          <button className="primaryAction" type="button">
            Stage Rollout
          </button>
        </header>

        <div className="tokenTable" role="table" aria-label="Token migration table">
          <div className="tableHead" role="row">
            <span>Token</span>
            <span>Before</span>
            <span>After</span>
            <span>Risk</span>
          </div>
          {tokens.map((token) => (
            <button className="tokenRow" key={token.name} type="button" role="row">
              <strong>{token.name}</strong>
              <span>{token.before}</span>
              <span>{token.after}</span>
              <em>{token.risk}</em>
            </button>
          ))}
        </div>
      </section>

      <aside className="rolloutPane" aria-label="Rollout plan">
        <div className="panelHeader">
          <h2>Rollout</h2>
          <span>10 apps</span>
        </div>
        <div className="appStack">
          {apps.map((app) => (
            <button className="appRow" key={app.name} type="button">
              <strong>{app.name}</strong>
              <small>{app.status}</small>
            </button>
          ))}
        </div>
        <div className="commandStack">
          {commands.map((command) => (
            <button className="commandRow" key={command} type="button">
              <kbd>$</kbd>
              <span>{command}</span>
            </button>
          ))}
        </div>
      </aside>
    </main>
  );
}
