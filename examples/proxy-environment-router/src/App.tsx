type ProxyState = 'routed' | 'review' | 'blocked';

type ProxyRoute = {
  app: string;
  workspace: string;
  variables: string;
  bypass: string;
  rollback: string;
  state: ProxyState;
};

type ProxyLane = {
  name: string;
  scope: string;
  score: number;
  state: ProxyState;
};

type ProxyChange = {
  mode: string;
  behavior: string;
  rollback: string;
  state: ProxyState;
};

type ProxyProbe = {
  target: string;
  action: string;
  command: string;
  state: ProxyState;
};

const routes: ProxyRoute[] = [
  {
    app: 'Browser vault',
    workspace: 'research',
    variables: 'HTTPS_PROXY via privacy exit',
    bypass: 'localhost, portals, unix sockets',
    rollback: 'restore shell env snapshot',
    state: 'routed'
  },
  {
    app: 'Package builder',
    workspace: 'build bench',
    variables: 'http_proxy for mirrors',
    bypass: 'repo cache and local registry',
    rollback: 'unset build env proxy',
    state: 'review'
  },
  {
    app: 'Docs reader',
    workspace: 'offline docs',
    variables: 'none',
    bypass: 'all network disabled',
    rollback: 'keep proxy empty',
    state: 'routed'
  },
  {
    app: 'Legacy sync',
    workspace: 'secrets desk',
    variables: 'unknown PAC script',
    bypass: 'missing NO_PROXY',
    rollback: 'block launcher proxy env',
    state: 'blocked'
  }
];

const lanes: ProxyLane[] = [
  {
    name: 'Proxy variables',
    scope: 'HTTP_PROXY, HTTPS_PROXY, ALL_PROXY, lowercase variants',
    score: 81,
    state: 'review'
  },
  {
    name: 'No-proxy gaps',
    scope: 'localhost, portals, tailscale, private ranges, package caches',
    score: 63,
    state: 'review'
  },
  {
    name: 'PAC coverage',
    scope: 'desktop PAC files, browser policy, and rollback copies',
    score: 55,
    state: 'blocked'
  }
];

const changes: ProxyChange[] = [
  {
    mode: 'Workspace export',
    behavior: 'scope proxy variables to research workspace launchers only',
    rollback: 'restore previous desktop entry env',
    state: 'routed'
  },
  {
    mode: 'NO_PROXY cleanup',
    behavior: 'add portal, loopback, and trusted network bypasses before rollout',
    rollback: 'revert proxy.env snapshot',
    state: 'review'
  },
  {
    mode: 'PAC quarantine',
    behavior: 'block legacy PAC script until routes and bypasses are documented',
    rollback: 'restore PAC after review',
    state: 'blocked'
  }
];

const probes: ProxyProbe[] = [
  {
    target: 'Shell proxy env',
    action: 'Inspect active proxy variables before staging launcher exports',
    command: 'env | grep -i proxy',
    state: 'review'
  },
  {
    target: 'Per-app route',
    action: 'Confirm the selected app reaches the expected proxy endpoint',
    command: 'curl -I --proxy "$HTTPS_PROXY" https://example.com',
    state: 'routed'
  },
  {
    target: 'No-proxy bypass',
    action: 'Check loopback and portal hosts are not sent through proxy routes',
    command: 'curl --noproxy "*" http://127.0.0.1:8080/health',
    state: 'review'
  },
  {
    target: 'PAC source',
    action: 'Find unmanaged PAC files before allowing automatic proxy discovery',
    command: 'rg -n "FindProxyForURL|ProxyAutoConfig" ~/.config /etc',
    state: 'blocked'
  }
];

const stateLabels: Record<ProxyState, string> = {
  routed: 'Routed',
  review: 'Review',
  blocked: 'Blocked'
};

const routedCount = routes.filter((route) => route.state === 'routed').length;
const reviewCount = routes.filter((route) => route.state === 'review').length;
const blockedCount = routes.filter((route) => route.state === 'blocked').length;

export function App() {
  return (
    <main className="shell">
      <section className="lab" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Proxy policy</p>
            <h1 id="page-title">Environment Router</h1>
          </div>
          <button type="button">Stage Proxy Route</button>
        </header>

        <section className="metrics" aria-label="Proxy routing summary">
          <article>
            <span>{routes.length}</span>
            <p>app routes</p>
          </article>
          <article>
            <span>{routedCount}</span>
            <p>routed</p>
          </article>
          <article>
            <span>{reviewCount}</span>
            <p>needs review</p>
          </article>
          <article>
            <span>{blockedCount}</span>
            <p>blocked</p>
          </article>
        </section>

        <section className="layout">
          <section className="routePanel" aria-label="Proxy route matrix">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Route matrix</p>
                <h2>Proxy variables, per-app routing, no-proxy gaps, PAC files, and rollback-safe proxy changes</h2>
              </div>
              <div className="routeBadge">
                <span />
                env scoped
              </div>
            </div>

            <div className="routeRows" role="list">
              {routes.map((route) => (
                <article className="routeRow" data-state={route.state} key={route.app} role="listitem" tabIndex={0}>
                  <div className="routeTitle">
                    <span>{stateLabels[route.state]}</span>
                    <h3>{route.app}</h3>
                    <p>{route.workspace}</p>
                  </div>
                  <div className="routeMeta">
                    <div>
                      <small>variables</small>
                      <strong>{route.variables}</strong>
                    </div>
                    <div>
                      <small>bypass</small>
                      <strong>{route.bypass}</strong>
                    </div>
                    <div>
                      <small>rollback</small>
                      <strong>{route.rollback}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="sideRail">
            <section className="previewPanel" aria-label="Proxy route preview">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Preview</p>
                  <h2>Proxy route</h2>
                </div>
              </div>
              <pre aria-label="Proxy route preview">{`app launch
  -> workspace env selected
  -> proxy variables scoped
  -> no-proxy bypass checked
  -> PAC source reviewed
  -> rollback env retained`}</pre>
            </section>

            <section className="lanePanel" aria-label="Proxy routing lanes">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Coverage</p>
                  <h2>Routing lanes</h2>
                </div>
              </div>
              <div className="laneList">
                {lanes.map((lane) => (
                  <article data-state={lane.state} key={lane.name}>
                    <div>
                      <span>{stateLabels[lane.state]}</span>
                      <h3>{lane.name}</h3>
                      <p>{lane.scope}</p>
                    </div>
                    <meter min="0" max="100" value={lane.score} aria-label={`${lane.name} coverage`} />
                  </article>
                ))}
              </div>
            </section>

            <section className="changePanel" aria-label="Rollback-safe proxy changes">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Changes</p>
                  <h2>Proxy edits</h2>
                </div>
              </div>
              <div className="changeList">
                {changes.map((change) => (
                  <article data-state={change.state} key={change.mode}>
                    <span>{stateLabels[change.state]}</span>
                    <h3>{change.mode}</h3>
                    <p>{change.behavior}</p>
                    <strong>{change.rollback}</strong>
                  </article>
                ))}
              </div>
            </section>

            <section className="probePanel" aria-label="Staged proxy probes">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Staged probes</p>
                  <h2>Review commands</h2>
                </div>
              </div>
              <div className="probeList">
                {probes.map((probe) => (
                  <article data-state={probe.state} key={probe.target}>
                    <span>{stateLabels[probe.state]}</span>
                    <h3>{probe.target}</h3>
                    <p>{probe.action}</p>
                    <code>{probe.command}</code>
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
