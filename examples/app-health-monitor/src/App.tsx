const metrics = [
  { label: 'Verified apps', value: '13/13', state: 'success' },
  { label: 'Blueprint drift', value: '0', state: 'success' },
  { label: 'Theme scripts', value: 'ok', state: 'info' },
  { label: 'Hard-coded colors', value: '0', state: 'success' }
];

const checks = [
  { app: 'Docs Reader', check: 'blueprint-name', status: 'ok' },
  { app: 'Ops Deck', check: 'theme-scripts', status: 'ok' },
  { app: 'Native Gallery', check: 'blueprint-files', status: 'ok' },
  { app: 'Theme Forge', check: 'no-hardcoded-colors', status: 'ok' }
];

const commands = [
  'omarchy-native verify ./examples/app-health-monitor',
  'omarchy-native app catalog ./examples --json',
  'npm run verify:examples'
];

export function App() {
  return (
    <main className="healthShell">
      <header className="mast">
        <div>
          <p className="eyebrow">omarchy.health</p>
          <h1>App Health Monitor</h1>
        </div>
        <button className="primaryAction" type="button">
          Scan Catalog
        </button>
      </header>

      <section className="metricStrip" aria-label="Health metrics">
        {metrics.map((metric) => (
          <button className="metricTile" key={metric.label} type="button">
            <small>{metric.label}</small>
            <strong>{metric.value}</strong>
            <em className={metric.state}>{metric.state}</em>
          </button>
        ))}
      </section>

      <section className="healthGrid">
        <section className="checkPanel" aria-label="Verifier checks">
          <div className="panelHeader">
            <h2>Verifier Rows</h2>
            <span>live</span>
          </div>
          <div className="checkTable" role="table" aria-label="Verifier status table">
            {checks.map((check) => (
              <button className="checkRow" key={`${check.app}-${check.check}`} type="button" role="row">
                <strong>{check.app}</strong>
                <span>{check.check}</span>
                <em>{check.status}</em>
              </button>
            ))}
          </div>
        </section>

        <aside className="commandPanel" aria-label="Remediation commands">
          <div className="panelHeader">
            <h2>Remediate</h2>
            <span>copyable</span>
          </div>
          <div className="commandStack">
            {commands.map((command) => (
              <button className="commandRow" key={command} type="button">
                <kbd>$</kbd>
                <span>{command}</span>
              </button>
            ))}
          </div>
          <div className="summary">
            <small>Current state</small>
            <strong>all checks green</strong>
            <p>Verifier output, catalog status, and likely fixes stay visible before handoff.</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
