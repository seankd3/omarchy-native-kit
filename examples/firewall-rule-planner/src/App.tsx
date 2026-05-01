type FirewallState = 'allow' | 'review' | 'block';

type FirewallIntent = {
  workspace: string;
  purpose: string;
  exposure: string;
  backend: string;
  rollback: string;
  state: FirewallState;
};

type ExposureLane = {
  name: string;
  scope: string;
  score: number;
  state: FirewallState;
};

type TemporaryHole = {
  window: string;
  rule: string;
  expiry: string;
  state: FirewallState;
};

type FirewallProbe = {
  target: string;
  action: string;
  command: string;
  state: FirewallState;
};

const intents: FirewallIntent[] = [
  {
    workspace: 'Meeting room',
    purpose: 'video calls',
    exposure: 'outbound rtc and dns only',
    backend: 'nftables set: omarchy_meeting',
    rollback: 'drop workspace set',
    state: 'allow'
  },
  {
    workspace: 'Build bench',
    purpose: 'package fetches',
    exposure: 'temporary repo mirrors',
    backend: 'ufw route allow list',
    rollback: 'remove numbered ufw rules',
    state: 'review'
  },
  {
    workspace: 'Research vault',
    purpose: 'read-only browsing',
    exposure: 'https egress through vpn',
    backend: 'nftables mark and vpn table',
    rollback: 'clear fwmark route',
    state: 'review'
  },
  {
    workspace: 'Secrets desk',
    purpose: 'credential handling',
    exposure: 'no network except keyserver hold',
    backend: 'default deny chain',
    rollback: 'restore baseline deny',
    state: 'block'
  }
];

const lanes: ExposureLane[] = [
  {
    name: 'Workspace exposure',
    scope: 'per-workspace chains, marks, and default policy',
    score: 82,
    state: 'review'
  },
  {
    name: 'Temporary openings',
    scope: 'timed rules with expiry and owner notes',
    score: 68,
    state: 'review'
  },
  {
    name: 'Rollback coverage',
    scope: 'snapshots, numbered ufw deletes, nft ruleset restore',
    score: 91,
    state: 'allow'
  }
];

const holes: TemporaryHole[] = [
  {
    window: 'Package mirror burst',
    rule: 'allow outbound tcp 443 to repo mirror set',
    expiry: '45 minutes',
    state: 'review'
  },
  {
    window: 'Pairing session',
    rule: 'allow inbound tcp 2200 from tailscale cidr',
    expiry: 'ends with workspace',
    state: 'allow'
  },
  {
    window: 'Legacy sync',
    rule: 'deny broad lan discovery until target ports are named',
    expiry: 'blocked',
    state: 'block'
  }
];

const probes: FirewallProbe[] = [
  {
    target: 'nftables baseline',
    action: 'Snapshot active rules before staging workspace-specific exposure',
    command: 'sudo nft list ruleset > firewall-before.nft',
    state: 'allow'
  },
  {
    target: 'ufw numbered rules',
    action: 'Map temporary openings to reversible numbered deletes',
    command: 'sudo ufw status numbered',
    state: 'review'
  },
  {
    target: 'Workspace mark',
    action: 'Confirm traffic labels before relying on per-workspace routing',
    command: 'sudo nft list chain inet omarchy workspace_marks',
    state: 'review'
  },
  {
    target: 'Broad listener',
    action: 'Block services that listen on every interface without an owner',
    command: 'ss -tulpen',
    state: 'block'
  }
];

const stateLabels: Record<FirewallState, string> = {
  allow: 'Allow',
  review: 'Review',
  block: 'Block'
};

const allowCount = intents.filter((intent) => intent.state === 'allow').length;
const reviewCount = intents.filter((intent) => intent.state === 'review').length;
const blockCount = intents.filter((intent) => intent.state === 'block').length;

export function App() {
  return (
    <main className="shell">
      <section className="planner" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Firewall policy</p>
            <h1 id="page-title">Rule Planner</h1>
          </div>
          <button type="button">Stage Ruleset</button>
        </header>

        <section className="metrics" aria-label="Firewall rule planning summary">
          <article>
            <span>{intents.length}</span>
            <p>workspace intents</p>
          </article>
          <article>
            <span>{allowCount}</span>
            <p>ready</p>
          </article>
          <article>
            <span>{reviewCount}</span>
            <p>needs review</p>
          </article>
          <article>
            <span>{blockCount}</span>
            <p>blocked</p>
          </article>
        </section>

        <section className="layout">
          <section className="intentPanel" aria-label="Firewall intent matrix">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Intent matrix</p>
                <h2>nftables and ufw intents, workspace exposure, temporary holes, and rollback steps</h2>
              </div>
              <div className="intentBadge">
                <span />
                rollback-first
              </div>
            </div>

            <div className="intentRows" role="list">
              {intents.map((intent) => (
                <article className="intentRow" data-state={intent.state} key={intent.workspace} role="listitem" tabIndex={0}>
                  <div className="intentTitle">
                    <span>{stateLabels[intent.state]}</span>
                    <h3>{intent.workspace}</h3>
                    <p>{intent.purpose}</p>
                  </div>
                  <div className="intentMeta">
                    <div>
                      <small>exposure</small>
                      <strong>{intent.exposure}</strong>
                    </div>
                    <div>
                      <small>backend</small>
                      <strong>{intent.backend}</strong>
                    </div>
                    <div>
                      <small>rollback</small>
                      <strong>{intent.rollback}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="sideRail">
            <section className="previewPanel" aria-label="Firewall route preview">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Preview</p>
                  <h2>Rule route</h2>
                </div>
              </div>
              <pre aria-label="Firewall rule route preview">{`workspace intent
  -> exposure surface named
  -> backend selected
  -> temporary hole expires
  -> rollback command staged
  -> ruleset snapshot retained`}</pre>
            </section>

            <section className="lanePanel" aria-label="Firewall exposure lanes">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Coverage</p>
                  <h2>Planning lanes</h2>
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

            <section className="holePanel" aria-label="Temporary firewall openings">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Temporary holes</p>
                  <h2>Expiring rules</h2>
                </div>
              </div>
              <div className="holeList">
                {holes.map((hole) => (
                  <article data-state={hole.state} key={hole.window}>
                    <span>{stateLabels[hole.state]}</span>
                    <h3>{hole.window}</h3>
                    <p>{hole.rule}</p>
                    <strong>{hole.expiry}</strong>
                  </article>
                ))}
              </div>
            </section>

            <section className="probePanel" aria-label="Staged firewall probes">
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
