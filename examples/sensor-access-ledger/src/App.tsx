type SensorState = 'allowed' | 'review' | 'blocked';

type SensorRequest = {
  app: string;
  sensor: string;
  workspace: string;
  request: string;
  grant: string;
  state: SensorState;
};

type TrustProfile = {
  name: string;
  scope: string;
  score: number;
  state: SensorState;
};

type FallbackRule = {
  mode: string;
  behavior: string;
  privacy: string;
  state: SensorState;
};

type LedgerCheck = {
  target: string;
  action: string;
  command: string;
  state: SensorState;
};

const requests: SensorRequest[] = [
  {
    app: 'Desk brightness',
    sensor: 'ambient light',
    workspace: 'focus',
    request: 'adjust display warmth',
    grant: 'session allowed',
    state: 'allowed'
  },
  {
    app: 'Motion note taker',
    sensor: 'accelerometer',
    workspace: 'mobile desk',
    request: 'detect tablet posture',
    grant: 'ask every time',
    state: 'review'
  },
  {
    app: 'Device handoff',
    sensor: 'Bluetooth proximity',
    workspace: 'calls',
    request: 'route headset presence',
    grant: 'remembered device',
    state: 'review'
  },
  {
    app: 'Maps helper',
    sensor: 'location',
    workspace: 'research',
    request: 'nearby venue lookup',
    grant: 'stale persistent',
    state: 'blocked'
  }
];

const profiles: TrustProfile[] = [
  {
    name: 'Focus workspace',
    scope: 'ambient light only, no location',
    score: 88,
    state: 'allowed'
  },
  {
    name: 'Calls workspace',
    scope: 'Bluetooth, microphone pairing, headset state',
    score: 69,
    state: 'review'
  },
  {
    name: 'Research workspace',
    scope: 'location prompts and map helpers',
    score: 48,
    state: 'blocked'
  }
];

const fallbacks: FallbackRule[] = [
  {
    mode: 'Light sensor denied',
    behavior: 'use manual brightness presets and keep adaptive color disabled',
    privacy: 'no sensor stream',
    state: 'allowed'
  },
  {
    mode: 'Bluetooth unavailable',
    behavior: 'route through explicit headset picker before joining calls',
    privacy: 'no proximity inference',
    state: 'review'
  },
  {
    mode: 'Location blocked',
    behavior: 'use typed city search and clear map cache after session',
    privacy: 'promptless lookup only',
    state: 'blocked'
  }
];

const checks: LedgerCheck[] = [
  {
    target: 'Sensor portal baseline',
    action: 'Confirm portal service is active before trusting app-level sensor prompts',
    command: 'systemctl --user status xdg-desktop-portal',
    state: 'allowed'
  },
  {
    target: 'Bluetooth requests',
    action: 'Review paired devices and recent controller activity before approving handoff',
    command: 'bluetoothctl devices',
    state: 'review'
  },
  {
    target: 'Location grants',
    action: 'Open application privacy settings and revoke stale persistent location access',
    command: 'xdg-open flatpak://settings/permissions',
    state: 'blocked'
  },
  {
    target: 'Motion sensors',
    action: 'Keep accelerometer access prompt-scoped for tablet posture tools',
    command: 'udevadm info --export-db',
    state: 'review'
  }
];

const stateLabels: Record<SensorState, string> = {
  allowed: 'Allowed',
  review: 'Review',
  blocked: 'Blocked'
};

const allowedCount = requests.filter((request) => request.state === 'allowed').length;
const reviewCount = requests.filter((request) => request.state === 'review').length;
const blockedCount = requests.filter((request) => request.state === 'blocked').length;

export function App() {
  return (
    <main className="shell">
      <section className="lab" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Sensor privacy</p>
            <h1 id="page-title">Access Ledger</h1>
          </div>
          <button type="button">Stage Sensor Review</button>
        </header>

        <section className="metrics" aria-label="Sensor access ledger summary">
          <article>
            <span>{requests.length}</span>
            <p>requests logged</p>
          </article>
          <article>
            <span>{allowedCount}</span>
            <p>allowed</p>
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
          <section className="ledgerPanel" aria-label="Sensor access request ledger">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Access ledger</p>
                <h2>Ambient light, accelerometer, Bluetooth, and location requests by workspace</h2>
              </div>
              <div className="sensorBadge">
                <span />
                prompt scoped
              </div>
            </div>

            <div className="requestList" role="list">
              {requests.map((request) => (
                <article className="requestRow" data-state={request.state} key={request.app} role="listitem" tabIndex={0}>
                  <div className="requestTitle">
                    <span>{stateLabels[request.state]}</span>
                    <h3>{request.app}</h3>
                    <p>{request.sensor}</p>
                  </div>
                  <div className="requestMeta">
                    <div>
                      <small>workspace</small>
                      <strong>{request.workspace}</strong>
                    </div>
                    <div>
                      <small>request</small>
                      <strong>{request.request}</strong>
                    </div>
                    <div>
                      <small>grant</small>
                      <strong>{request.grant}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="sideRail">
            <section className="previewPanel" aria-label="Sensor access route preview">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Preview</p>
                  <h2>Grant route</h2>
                </div>
              </div>
              <pre aria-label="Sensor access path preview">{`app request
  -> sensor class identified
  -> workspace policy checked
  -> portal or device prompt
  -> stale grant review
  -> fallback selected
  -> ledger entry saved`}</pre>
            </section>

            <section className="profilePanel" aria-label="Sensor trust profiles">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Profiles</p>
                  <h2>Workspace trust</h2>
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
                    <meter min="0" max="100" value={profile.score} aria-label={`${profile.name} trust score`} />
                  </article>
                ))}
              </div>
            </section>

            <section className="fallbackPanel" aria-label="Privacy-safe sensor fallbacks">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Fallbacks</p>
                  <h2>Safe behavior</h2>
                </div>
              </div>
              <div className="fallbackList">
                {fallbacks.map((fallback) => (
                  <article data-state={fallback.state} key={fallback.mode}>
                    <span>{stateLabels[fallback.state]}</span>
                    <h3>{fallback.mode}</h3>
                    <p>{fallback.behavior}</p>
                    <strong>{fallback.privacy}</strong>
                  </article>
                ))}
              </div>
            </section>

            <section className="checkPanel" aria-label="Staged sensor access checks">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Staged checks</p>
                  <h2>Review probes</h2>
                </div>
              </div>
              <div className="checkList">
                {checks.map((check) => (
                  <article data-state={check.state} key={check.target}>
                    <span>{stateLabels[check.state]}</span>
                    <h3>{check.target}</h3>
                    <p>{check.action}</p>
                    <code>{check.command}</code>
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
