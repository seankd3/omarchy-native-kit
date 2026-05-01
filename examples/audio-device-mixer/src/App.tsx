type RouteState = 'active' | 'muted' | 'monitor';

type DeviceRoute = {
  source: string;
  target: string;
  role: string;
  state: RouteState;
  level: number;
  latency: string;
};

type AppLevel = {
  app: string;
  role: string;
  level: number;
  destination: string;
};

type Preset = {
  name: string;
  input: string;
  output: string;
  policy: string;
};

const routes: DeviceRoute[] = [
  {
    source: 'Studio Mic',
    target: 'Meeting Bus',
    role: 'Primary input',
    state: 'active',
    level: 82,
    latency: '12 ms'
  },
  {
    source: 'System Audio',
    target: 'Headphones',
    role: 'Desktop mix',
    state: 'active',
    level: 64,
    latency: '8 ms'
  },
  {
    source: 'Browser Tab',
    target: 'Recording Bus',
    role: 'Share audio',
    state: 'monitor',
    level: 48,
    latency: '18 ms'
  },
  {
    source: 'Laptop Mic',
    target: 'Muted',
    role: 'Fallback input',
    state: 'muted',
    level: 0,
    latency: '0 ms'
  }
];

const appLevels: AppLevel[] = [
  { app: 'Signal Desk', role: 'Alerts', level: 72, destination: 'Headphones' },
  { app: 'Docs Reader', role: 'Narration', level: 38, destination: 'Speakers' },
  { app: 'Notification Routing Board', role: 'Pings', level: 44, destination: 'Headphones' },
  { app: 'Focus Flight Recorder', role: 'Review tones', level: 26, destination: 'Muted after hours' }
];

const presets: Preset[] = [
  {
    name: 'Client call',
    input: 'Studio Mic',
    output: 'Headphones',
    policy: 'Mute system alerts, keep release failures audible'
  },
  {
    name: 'Screen recording',
    input: 'Studio Mic + Browser Tab',
    output: 'Recording Bus',
    policy: 'Route app audio to monitor at reduced gain'
  },
  {
    name: 'Deep work',
    input: 'Muted',
    output: 'Headphones',
    policy: 'Only critical Ops Deck and backup alerts'
  }
];

const stateLabels: Record<RouteState, string> = {
  active: 'Active',
  muted: 'Muted',
  monitor: 'Monitor'
};

const activeRoutes = routes.filter((route) => route.state === 'active').length;
const mutedRoutes = routes.filter((route) => route.state === 'muted').length;
const averageLevel = Math.round(routes.reduce((sum, route) => sum + route.level, 0) / routes.length);
const routedApps = appLevels.length;

export function App() {
  return (
    <main className="shell">
      <section className="mixer" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Audio routing</p>
            <h1 id="page-title">Device Mixer</h1>
          </div>
          <div className="liveBadge">
            <span />
            PipeWire graph synced
          </div>
        </header>

        <section className="metrics" aria-label="Audio summary">
          <article>
            <span>{activeRoutes}</span>
            <p>active routes</p>
          </article>
          <article>
            <span>{mutedRoutes}</span>
            <p>muted fallback</p>
          </article>
          <article>
            <span>{averageLevel}%</span>
            <p>average gain</p>
          </article>
          <article>
            <span>{routedApps}</span>
            <p>app lanes</p>
          </article>
        </section>

        <section className="layout">
          <div className="routePanel">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Patch graph</p>
                <h2>Device routes</h2>
              </div>
              <button type="button">Apply Preset</button>
            </div>

            <div className="routeList" role="list" aria-label="Device audio routes">
              {routes.map((route) => (
                <article className="route" data-state={route.state} key={`${route.source}-${route.target}`} role="listitem">
                  <div className="routeTitle">
                    <span>{stateLabels[route.state]}</span>
                    <h3>{route.source}</h3>
                    <p>{route.role}</p>
                  </div>
                  <div className="routeTarget">
                    <strong>{route.target}</strong>
                    <small>{route.latency}</small>
                  </div>
                  <div className="level" aria-label={`${route.level}% gain`}>
                    <div>
                      <strong>{route.level}%</strong>
                      <small>gain</small>
                    </div>
                    <span>
                      <i style={{ inlineSize: `${route.level}%` }} />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="sideRail">
            <section className="appPanel" aria-label="Per-app volume">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Per-app lanes</p>
                  <h2>Volume map</h2>
                </div>
              </div>
              <div className="appList">
                {appLevels.map((item) => (
                  <article key={item.app}>
                    <div>
                      <h3>{item.app}</h3>
                      <p>{item.role} to {item.destination}</p>
                    </div>
                    <strong>{item.level}%</strong>
                  </article>
                ))}
              </div>
            </section>

            <section className="presetPanel" aria-label="Meeting presets">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Meeting presets</p>
                  <h2>Guarded switches</h2>
                </div>
              </div>
              <div className="presetList">
                {presets.map((preset) => (
                  <article key={preset.name}>
                    <span />
                    <div>
                      <h3>{preset.name}</h3>
                      <p>{preset.input} to {preset.output}</p>
                      <small>{preset.policy}</small>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </section>
      </section>
    </main>
  );
}
