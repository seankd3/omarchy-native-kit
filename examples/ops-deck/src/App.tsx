const metrics = [
  { label: 'Catalog', value: '11/11', state: 'success' },
  { label: 'Release gates', value: '4', state: 'success' },
  { label: 'Theme hooks', value: 'ready', state: 'info' },
  { label: 'Next app', value: '1', state: 'warning' }
];

const tasks = [
  { name: 'Run catalog snapshot', owner: 'native-gallery', status: 'ready' },
  { name: 'Verify examples', owner: 'release-console', status: 'ready' },
  { name: 'Review theme rollout', owner: 'theme-migration-lab', status: 'queued' },
  { name: 'Stage package metadata', owner: 'aur-packager', status: 'queued' }
];

const commands = ['npm run catalog:examples', 'npm run verify:examples', 'npm pack --dry-run'];

export function App() {
  return (
    <main className="opsShell">
      <header className="mast">
        <div>
          <p className="eyebrow">omarchy.ops</p>
          <h1>Ops Deck</h1>
        </div>
        <button className="primaryAction" type="button">
          Run Checks
        </button>
      </header>

      <section className="metricStrip" aria-label="Operations metrics">
        {metrics.map((metric) => (
          <button className="metricTile" key={metric.label} type="button">
            <small>{metric.label}</small>
            <strong>{metric.value}</strong>
            <em className={metric.state}>{metric.state}</em>
          </button>
        ))}
      </section>

      <section className="opsGrid">
        <section className="taskPanel" aria-label="Daily operations tasks">
          <div className="panelHeader">
            <h2>Daily Runbook</h2>
            <span>operator</span>
          </div>
          <div className="taskTable" role="table" aria-label="Operations task list">
            {tasks.map((task) => (
              <button className="taskRow" key={task.name} type="button" role="row">
                <strong>{task.name}</strong>
                <span>{task.owner}</span>
                <em>{task.status}</em>
              </button>
            ))}
          </div>
        </section>

        <aside className="commandPanel" aria-label="Commands">
          <div className="panelHeader">
            <h2>Commands</h2>
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
            <small>Focus</small>
            <strong>keep the loop green</strong>
            <p>Catalog status, release checks, and theme rollout tasks stay visible in one Omarchy-native surface.</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
