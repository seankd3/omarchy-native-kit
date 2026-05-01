const metrics = [
  { label: 'Active agents', value: '18', delta: '+4', state: 'success' },
  { label: 'Queued builds', value: '7', delta: '-2', state: 'warning' },
  { label: 'Theme syncs', value: '142', delta: '99%', state: 'info' },
  { label: 'Failed checks', value: '1', delta: 'fix', state: 'danger' }
];

const events = [
  { time: '09:42', source: 'agent-context-lab', action: 'Built preview', status: 'ready' },
  { time: '09:38', source: 'signal-desk', action: 'Generated dashboard blueprint', status: 'ready' },
  { time: '09:31', source: 'native-kit', action: 'Published agent commands', status: 'merged' },
  { time: '09:24', source: 'theme-sync', action: 'Refreshed semantic tokens', status: 'watching' },
  { time: '09:17', source: 'package', action: 'Verified tarball contents', status: 'ready' }
];

const filters = ['All', 'Builds', 'Agents', 'Themes'];

export function App() {
  return (
    <main className="deskShell">
      <header className="topbar">
        <div>
          <p className="eyebrow">omarchy.signal</p>
          <h1>Signal Desk</h1>
        </div>
        <button className="syncButton" type="button">
          Sync tokens
        </button>
      </header>

      <section className="metricStrip" aria-label="System metrics">
        {metrics.map((metric) => (
          <button className="metricTile" key={metric.label} type="button">
            <span className={`rail ${metric.state}`} />
            <small>{metric.label}</small>
            <strong>{metric.value}</strong>
            <em className={metric.state}>{metric.delta}</em>
          </button>
        ))}
      </section>

      <section className="dashboardGrid">
        <div className="activityPanel">
          <div className="panelHeader">
            <h2>Activity</h2>
            <span>live</span>
          </div>
          <div className="table" role="table" aria-label="Recent activity">
            <div className="tableHead" role="row">
              <span>Time</span>
              <span>Source</span>
              <span>Action</span>
              <span>Status</span>
            </div>
            {events.map((event) => (
              <button className="dataRow" key={`${event.time}-${event.source}`} type="button" role="row">
                <span>{event.time}</span>
                <strong>{event.source}</strong>
                <span>{event.action}</span>
                <em>{event.status}</em>
              </button>
            ))}
          </div>
        </div>

        <aside className="sidePanel" aria-label="Filters and selected detail">
          <div className="panelHeader">
            <h2>Focus</h2>
            <span>dashboard</span>
          </div>
          <div className="filterStack">
            {filters.map((filter, index) => (
              <button className={index === 0 ? 'filter active' : 'filter'} key={filter} type="button">
                {filter}
              </button>
            ))}
          </div>
          <div className="detailBlock">
            <small>Selected blueprint</small>
            <strong>dashboard</strong>
            <p>
              Metric strip, activity table, and side-panel filters built from the Omarchy agent blueprint contract.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
