type CaptureState = 'approved' | 'review' | 'blocked';

type CaptureRoute = {
  app: string;
  portal: string;
  monitor: string;
  grant: string;
  expectation: string;
  state: CaptureState;
};

type CaptureProfile = {
  name: string;
  scope: string;
  readiness: number;
  state: CaptureState;
};

type StagedAction = {
  target: string;
  action: string;
  command: string;
  state: CaptureState;
};

const routes: CaptureRoute[] = [
  {
    app: 'Meeting browser',
    portal: 'ScreenCast portal',
    monitor: 'selected monitor',
    grant: 'session only',
    expectation: 'share window or full display',
    state: 'approved'
  },
  {
    app: 'Screenshot tool',
    portal: 'Screenshot portal',
    monitor: 'active output',
    grant: 'one-shot',
    expectation: 'still capture with prompt',
    state: 'approved'
  },
  {
    app: 'Streaming studio',
    portal: 'PipeWire stream',
    monitor: 'external monitor',
    grant: 'persistent review',
    expectation: 'remember source carefully',
    state: 'review'
  },
  {
    app: 'Legacy recorder',
    portal: 'none',
    monitor: 'all outputs',
    grant: 'untracked',
    expectation: 'requires explicit migration',
    state: 'blocked'
  }
];

const profiles: CaptureProfile[] = [
  {
    name: 'Portal coverage',
    scope: 'Screenshot + ScreenCast',
    readiness: 91,
    state: 'approved'
  },
  {
    name: 'Monitor selection',
    scope: 'internal, external, window',
    readiness: 78,
    state: 'review'
  },
  {
    name: 'Persistent grants',
    scope: 'remembered capture permissions',
    readiness: 58,
    state: 'blocked'
  }
];

const stagedActions: StagedAction[] = [
  {
    target: 'Legacy recorder',
    action: 'Move screen recording through xdg-desktop-portal before enabling capture',
    command: 'systemctl --user status xdg-desktop-portal',
    state: 'blocked'
  },
  {
    target: 'Streaming persistent grant',
    action: 'Review remembered source before trusting unattended sessions',
    command: 'busctl --user tree org.freedesktop.portal.Desktop',
    state: 'review'
  },
  {
    target: 'Meeting browser baseline',
    action: 'Keep browser capture on session-scoped portal grants',
    command: 'xdg-desktop-portal --replace --verbose',
    state: 'approved'
  }
];

const stateLabels: Record<CaptureState, string> = {
  approved: 'Approved',
  review: 'Review',
  blocked: 'Blocked'
};

const approvedCount = routes.filter((route) => route.state === 'approved').length;
const reviewCount = routes.filter((route) => route.state === 'review').length;
const blockedCount = routes.filter((route) => route.state === 'blocked').length;

export function App() {
  return (
    <main className="shell">
      <section className="lab" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Screen capture</p>
            <h1 id="page-title">Capture Lab</h1>
          </div>
          <button type="button">Stage Policy</button>
        </header>

        <section className="metrics" aria-label="Screen capture permission summary">
          <article>
            <span>{routes.length}</span>
            <p>capture flows</p>
          </article>
          <article>
            <span>{approvedCount}</span>
            <p>approved</p>
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
          <section className="routePanel" aria-label="Screen capture portal matrix">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Capture matrix</p>
                <h2>Screenshot portals, screen-share routes, monitor selection, and grants</h2>
              </div>
              <div className="captureBadge">
                <span />
                session scoped
              </div>
            </div>

            <div className="routeList" role="list">
              {routes.map((route) => (
                <article className="routeRow" data-state={route.state} key={route.app} role="listitem" tabIndex={0}>
                  <div className="routeTitle">
                    <span>{stateLabels[route.state]}</span>
                    <h3>{route.app}</h3>
                    <p>{route.portal}</p>
                  </div>
                  <div className="routeMeta">
                    <div>
                      <small>monitor</small>
                      <strong>{route.monitor}</strong>
                    </div>
                    <div>
                      <small>grant</small>
                      <strong>{route.grant}</strong>
                    </div>
                    <div>
                      <small>expectation</small>
                      <strong>{route.expectation}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="sideRail">
            <section className="previewPanel" aria-label="Screen capture portal preview">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Preview</p>
                  <h2>Capture route</h2>
                </div>
              </div>
              <pre aria-label="Screen capture route preview">{`app -> ScreenCast portal
  -> user selects window or monitor
  -> PipeWire stream token
  -> session-scoped grant
  -> revoke on close`}</pre>
            </section>

            <section className="profilePanel" aria-label="Screen capture readiness profiles">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Profiles</p>
                  <h2>Capture readiness</h2>
                </div>
              </div>
              <div className="profileList">
                {profiles.map((profile) => (
                  <article data-state={profile.state} key={profile.name}>
                    <div>
                      <span>{stateLabels[profile.state]}</span>
                      <h3>{profile.name}</h3>
                      <p>{profile.scope}</p>
                    </div>
                    <meter min="0" max="100" value={profile.readiness} aria-label={`${profile.name} readiness`} />
                  </article>
                ))}
              </div>
            </section>

            <section className="actionPanel" aria-label="Staged screen capture actions">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Staged actions</p>
                  <h2>Safe checks</h2>
                </div>
              </div>
              <div className="actionList">
                {stagedActions.map((action) => (
                  <article data-state={action.state} key={action.target}>
                    <span>{stateLabels[action.state]}</span>
                    <h3>{action.target}</h3>
                    <p>{action.action}</p>
                    <code>{action.command}</code>
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
