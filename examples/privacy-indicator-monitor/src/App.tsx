type PrivacyState = 'clear' | 'watch' | 'alert';

type ActivitySignal = {
  surface: string;
  indicator: string;
  workspace: string;
  source: string;
  grant: string;
  state: PrivacyState;
};

type WorkspacePosture = {
  name: string;
  scope: string;
  score: number;
  state: PrivacyState;
};

type StaleGrant = {
  app: string;
  age: string;
  access: string;
  action: string;
  state: PrivacyState;
};

type ReviewStep = {
  target: string;
  action: string;
  command: string;
  state: PrivacyState;
};

const signals: ActivitySignal[] = [
  {
    surface: 'Meeting workspace',
    indicator: 'camera + microphone live',
    workspace: 'calls',
    source: 'browser WebRTC',
    grant: 'session grant',
    state: 'watch'
  },
  {
    surface: 'Streaming desk',
    indicator: 'screen capture active',
    workspace: 'studio',
    source: 'ScreenCast portal',
    grant: 'remembered source',
    state: 'alert'
  },
  {
    surface: 'Maps preview',
    indicator: 'location idle',
    workspace: 'research',
    source: 'Location portal',
    grant: 'ask every time',
    state: 'clear'
  },
  {
    surface: 'Terminal session',
    indicator: 'no privacy device',
    workspace: 'ops',
    source: 'host shell',
    grant: 'none',
    state: 'clear'
  }
];

const postures: WorkspacePosture[] = [
  {
    name: 'Calls',
    scope: 'camera, microphone, captions',
    score: 71,
    state: 'watch'
  },
  {
    name: 'Studio',
    scope: 'screen capture, virtual camera, monitor mix',
    score: 54,
    state: 'alert'
  },
  {
    name: 'Ops',
    scope: 'terminal, logs, package updates',
    score: 93,
    state: 'clear'
  }
];

const staleGrants: StaleGrant[] = [
  {
    app: 'Streaming desk',
    age: '18 days',
    access: 'screen + monitor source',
    action: 'reconfirm before next launch',
    state: 'alert'
  },
  {
    app: 'Meeting browser',
    age: '6 days',
    access: 'camera + microphone',
    action: 'trim to session-only',
    state: 'watch'
  },
  {
    app: 'Maps preview',
    age: 'fresh',
    access: 'location prompt',
    action: 'keep ask-every-time',
    state: 'clear'
  }
];

const reviewSteps: ReviewStep[] = [
  {
    target: 'Portal activity',
    action: 'Inspect active portal-backed privacy sessions before trusting indicators',
    command: 'busctl --user tree org.freedesktop.portal.Desktop',
    state: 'watch'
  },
  {
    target: 'Audio and video nodes',
    action: 'Compare visible PipeWire nodes with the privacy indicator timeline',
    command: 'wpctl status',
    state: 'watch'
  },
  {
    target: 'Screen capture grant',
    action: 'Revoke remembered capture source before unattended studio work',
    command: 'xdg-open flatpak://settings/permissions',
    state: 'alert'
  },
  {
    target: 'Location posture',
    action: 'Keep location requests prompt-scoped across research workspaces',
    command: 'systemctl --user status xdg-desktop-portal',
    state: 'clear'
  }
];

const stateLabels: Record<PrivacyState, string> = {
  clear: 'Clear',
  watch: 'Watch',
  alert: 'Alert'
};

const clearCount = signals.filter((signal) => signal.state === 'clear').length;
const watchCount = signals.filter((signal) => signal.state === 'watch').length;
const alertCount = signals.filter((signal) => signal.state === 'alert').length;

export function App() {
  return (
    <main className="shell">
      <section className="lab" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Privacy posture</p>
            <h1 id="page-title">Indicator Monitor</h1>
          </div>
          <button type="button">Stage Review</button>
        </header>

        <section className="metrics" aria-label="Privacy indicator summary">
          <article>
            <span>{signals.length}</span>
            <p>signals tracked</p>
          </article>
          <article>
            <span>{clearCount}</span>
            <p>clear</p>
          </article>
          <article>
            <span>{watchCount}</span>
            <p>watching</p>
          </article>
          <article>
            <span>{alertCount}</span>
            <p>alerts</p>
          </article>
        </section>

        <section className="layout">
          <section className="signalPanel" aria-label="Privacy activity indicator matrix">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Activity matrix</p>
                <h2>Camera, microphone, screen-capture, and location indicators by workspace</h2>
              </div>
              <div className="privacyBadge">
                <span />
                visible signals
              </div>
            </div>

            <div className="signalList" role="list">
              {signals.map((signal) => (
                <article className="signalRow" data-state={signal.state} key={signal.surface} role="listitem" tabIndex={0}>
                  <div className="signalTitle">
                    <span>{stateLabels[signal.state]}</span>
                    <h3>{signal.surface}</h3>
                    <p>{signal.indicator}</p>
                  </div>
                  <div className="signalMeta">
                    <div>
                      <small>workspace</small>
                      <strong>{signal.workspace}</strong>
                    </div>
                    <div>
                      <small>source</small>
                      <strong>{signal.source}</strong>
                    </div>
                    <div>
                      <small>grant</small>
                      <strong>{signal.grant}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="sideRail">
            <section className="previewPanel" aria-label="Privacy indicator route preview">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Preview</p>
                  <h2>Signal path</h2>
                </div>
              </div>
              <pre aria-label="Privacy indicator path preview">{`portal event
  -> camera / mic / screen / location signal
  -> workspace attribution
  -> stale grant check
  -> indicator state
  -> review or revoke action`}</pre>
            </section>

            <section className="posturePanel" aria-label="Workspace privacy posture">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Workspaces</p>
                  <h2>Privacy posture</h2>
                </div>
              </div>
              <div className="postureList">
                {postures.map((posture) => (
                  <article data-state={posture.state} key={posture.name}>
                    <div>
                      <span>{stateLabels[posture.state]}</span>
                      <h3>{posture.name}</h3>
                      <p>{posture.scope}</p>
                    </div>
                    <meter min="0" max="100" value={posture.score} aria-label={`${posture.name} privacy posture`} />
                  </article>
                ))}
              </div>
            </section>

            <section className="grantPanel" aria-label="Stale privacy grants">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Stale grants</p>
                  <h2>Review queue</h2>
                </div>
              </div>
              <div className="grantList">
                {staleGrants.map((grant) => (
                  <article data-state={grant.state} key={grant.app}>
                    <span>{stateLabels[grant.state]}</span>
                    <h3>{grant.app}</h3>
                    <p>{grant.access}</p>
                    <strong>{grant.age} / {grant.action}</strong>
                  </article>
                ))}
              </div>
            </section>

            <section className="reviewPanel" aria-label="Staged privacy indicator checks">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Staged checks</p>
                  <h2>Review probes</h2>
                </div>
              </div>
              <div className="reviewList">
                {reviewSteps.map((step) => (
                  <article data-state={step.state} key={step.target}>
                    <span>{stateLabels[step.state]}</span>
                    <h3>{step.target}</h3>
                    <p>{step.action}</p>
                    <code>{step.command}</code>
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
