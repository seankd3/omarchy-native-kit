type RouteState = 'live' | 'quiet' | 'review';

type Route = {
  app: string;
  channel: string;
  destination: string;
  state: RouteState;
  window: string;
  escalation: string;
  volume: number;
};

type QuietWindow = {
  label: string;
  apps: string;
  rule: string;
  impact: string;
};

type Escalation = {
  trigger: string;
  first: string;
  second: string;
  guardrail: string;
};

const routes: Route[] = [
  {
    app: 'Release Console',
    channel: 'Publish gates',
    destination: 'Signal Desk',
    state: 'live',
    window: 'Always on',
    escalation: 'Page after 2 failed checks',
    volume: 18
  },
  {
    app: 'App Health Monitor',
    channel: 'Verifier drift',
    destination: 'Ops Deck',
    state: 'live',
    window: 'Work blocks',
    escalation: 'Open triage lane',
    volume: 31
  },
  {
    app: 'Shortcut Trainer',
    channel: 'Practice nudges',
    destination: 'Focus Flight Recorder',
    state: 'quiet',
    window: 'Muted until 16:00',
    escalation: 'Digest only',
    volume: 9
  },
  {
    app: 'Portal Permission Center',
    channel: 'Permission changes',
    destination: 'Notification tray',
    state: 'review',
    window: 'Needs owner',
    escalation: 'Require confirmation',
    volume: 5
  },
  {
    app: 'Backup Restore Console',
    channel: 'Restore readiness',
    destination: 'Ops Deck',
    state: 'live',
    window: 'Always on',
    escalation: 'Escalate stale snapshots',
    volume: 12
  }
];

const quietWindows: QuietWindow[] = [
  {
    label: 'Deep work',
    apps: 'Prompt Foundry, Theme Forge',
    rule: 'Digest non-critical items',
    impact: '42 minutes protected'
  },
  {
    label: 'Review pass',
    apps: 'Config Diff Studio, Window Rule Lab',
    rule: 'Allow approvals and rollback warnings',
    impact: '4 routes allowed'
  },
  {
    label: 'After hours',
    apps: 'All dogfood apps',
    rule: 'Only failed release and backup alerts',
    impact: '87% noise reduced'
  }
];

const escalations: Escalation[] = [
  {
    trigger: 'Build-backed verifier fails twice',
    first: 'Release Console',
    second: 'Signal Desk',
    guardrail: 'Require direct action before repeating'
  },
  {
    trigger: 'Backup snapshot becomes stale',
    first: 'Backup Restore Console',
    second: 'Ops Deck',
    guardrail: 'Suppress duplicate route for 45 minutes'
  },
  {
    trigger: 'Portal handler changes owner',
    first: 'Portal Permission Center',
    second: 'Notification tray',
    guardrail: 'Ask before opening external settings'
  }
];

const stateLabels: Record<RouteState, string> = {
  live: 'Live',
  quiet: 'Quiet',
  review: 'Review'
};

const liveRoutes = routes.filter((route) => route.state === 'live').length;
const quietRoutes = routes.filter((route) => route.state === 'quiet').length;
const reviewRoutes = routes.filter((route) => route.state === 'review').length;
const totalVolume = routes.reduce((sum, route) => sum + route.volume, 0);

export function App() {
  return (
    <main className="shell">
      <section className="board" aria-labelledby="page-title">
        <header className="topbar">
          <div>
            <p className="eyebrow">Notification routing</p>
            <h1 id="page-title">Route Board</h1>
          </div>
          <div className="syncBadge">
            <span />
            Omarchy theme synced
          </div>
        </header>

        <section className="summary" aria-label="Routing summary">
          <article>
            <span>{liveRoutes}</span>
            <p>live routes</p>
          </article>
          <article>
            <span>{quietRoutes}</span>
            <p>quieted</p>
          </article>
          <article>
            <span>{reviewRoutes}</span>
            <p>need review</p>
          </article>
          <article>
            <span>{totalVolume}</span>
            <p>events today</p>
          </article>
        </section>

        <section className="layout">
          <div className="routePanel">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Active policy</p>
                <h2>App routes</h2>
              </div>
              <button type="button">Audit</button>
            </div>

            <div className="routeList" role="list" aria-label="Notification routes">
              {routes.map((route) => (
                <article className="route" data-state={route.state} key={`${route.app}-${route.channel}`} role="listitem">
                  <div className="routeMain">
                    <span className="status">{stateLabels[route.state]}</span>
                    <h3>{route.app}</h3>
                    <p>{route.channel}</p>
                  </div>
                  <div className="routeMeta">
                    <span>{route.destination}</span>
                    <span>{route.window}</span>
                    <span>{route.escalation}</span>
                  </div>
                  <div className="volume" aria-label={`${route.volume} events today`}>
                    <span style={{ inlineSize: `${Math.max(route.volume * 2, 14)}%` }} />
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="sideRail" aria-label="Quiet hours and escalations">
            <section className="quietPanel">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Quiet hours</p>
                  <h2>Windows</h2>
                </div>
              </div>

              <div className="quietList">
                {quietWindows.map((window) => (
                  <article key={window.label}>
                    <div>
                      <h3>{window.label}</h3>
                      <p>{window.apps}</p>
                    </div>
                    <strong>{window.impact}</strong>
                    <span>{window.rule}</span>
                  </article>
                ))}
              </div>
            </section>

            <section className="escalationPanel">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Escalation</p>
                  <h2>Rules</h2>
                </div>
              </div>

              <div className="timeline">
                {escalations.map((rule) => (
                  <article key={rule.trigger}>
                    <span className="dot" />
                    <div>
                      <h3>{rule.trigger}</h3>
                      <p>
                        {rule.first} to {rule.second}
                      </p>
                      <small>{rule.guardrail}</small>
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
