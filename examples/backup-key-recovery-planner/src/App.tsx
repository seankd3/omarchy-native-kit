type RecoveryState = 'ready' | 'drill' | 'blocked';

type RecoveryAsset = {
  name: string;
  kind: string;
  owner: string;
  lastVerified: string;
  location: string;
  state: RecoveryState;
};

type DrillStep = {
  title: string;
  command: string;
  evidence: string;
  state: RecoveryState;
};

type EscrowCheck = {
  service: string;
  escrow: string;
  fallback: string;
  state: RecoveryState;
};

type TimelineItem = {
  window: string;
  task: string;
  rollback: string;
  state: RecoveryState;
};

const assets: RecoveryAsset[] = [
  {
    name: 'Admin recovery key',
    kind: 'age identity',
    owner: 'Sean',
    lastVerified: '2026-04-28',
    location: 'offline vault card A',
    state: 'ready'
  },
  {
    name: 'Backup FIDO token',
    kind: 'hardware key',
    owner: 'Sean',
    lastVerified: '2026-04-21',
    location: 'travel pouch',
    state: 'drill'
  },
  {
    name: 'Emergency passphrase',
    kind: 'sealed phrase',
    owner: 'trusted contact',
    lastVerified: '2026-03-17',
    location: 'escrow envelope',
    state: 'ready'
  },
  {
    name: 'Workstation unlock note',
    kind: 'paper runbook',
    owner: 'Ops',
    lastVerified: 'missing',
    location: 'not filed',
    state: 'blocked'
  }
];

const drillSteps: DrillStep[] = [
  {
    title: 'Mount recovery vault read-only',
    command: 'systemd-run --user --scope recovery-vault --readonly',
    evidence: 'vault opens without exposing writable secrets',
    state: 'ready'
  },
  {
    title: 'Test backup token login',
    command: 'pamtester login sean authenticate',
    evidence: 'backup token accepted while password fallback remains live',
    state: 'drill'
  },
  {
    title: 'Decrypt canary backup',
    command: 'age -d -i recovery-key canary.tar.age',
    evidence: 'checksum matches last known recovery canary',
    state: 'ready'
  },
  {
    title: 'Restore missing runbook',
    command: 'install -m 0600 runbook.md offline-vault/',
    evidence: 'blocked until current instructions are reprinted',
    state: 'blocked'
  }
];

const escrowChecks: EscrowCheck[] = [
  {
    service: 'Password manager',
    escrow: 'sealed emergency kit',
    fallback: 'one-time codes remain unused',
    state: 'ready'
  },
  {
    service: 'SSH certificate CA',
    escrow: 'backup signing identity',
    fallback: 'disable cert login before rotation',
    state: 'drill'
  },
  {
    service: 'Disk unlock',
    escrow: 'LUKS recovery slot',
    fallback: 'bootable rescue USB',
    state: 'ready'
  },
  {
    service: 'Hardware token reset',
    escrow: 'vendor reset procedure',
    fallback: 'do not reset until passkeys are exported',
    state: 'blocked'
  }
];

const timeline: TimelineItem[] = [
  {
    window: 'T-7 days',
    task: 'Confirm trusted contact can locate the envelope without opening it.',
    rollback: 'cancel drill if envelope chain is unclear',
    state: 'ready'
  },
  {
    window: 'T-1 day',
    task: 'Snapshot auth config and preserve active login session.',
    rollback: 'restore snapshot and keep old token policy',
    state: 'ready'
  },
  {
    window: 'Drill',
    task: 'Recover canary data using only documented backup material.',
    rollback: 'abort before any destructive token reset',
    state: 'drill'
  }
];

const stateLabels: Record<RecoveryState, string> = {
  ready: 'Ready',
  drill: 'Drill',
  blocked: 'Blocked'
};

const readyCount = assets.filter((asset) => asset.state === 'ready').length;
const drillCount = assets.filter((asset) => asset.state === 'drill').length + drillSteps.filter((step) => step.state === 'drill').length;
const blockedCount = assets.filter((asset) => asset.state === 'blocked').length + escrowChecks.filter((check) => check.state === 'blocked').length;

export function App() {
  return (
    <main className="shell">
      <section className="workspace" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Recovery readiness</p>
            <h1 id="page-title">Backup Key Planner</h1>
          </div>
          <button type="button">Schedule Drill</button>
        </header>

        <section className="summary" aria-label="Recovery readiness summary">
          <article>
            <span>{assets.length}</span>
            <p>tracked assets</p>
          </article>
          <article>
            <span>{readyCount}</span>
            <p>ready keys</p>
          </article>
          <article>
            <span>{drillCount}</span>
            <p>drill items</p>
          </article>
          <article>
            <span>{blockedCount}</span>
            <p>blocked paths</p>
          </article>
        </section>

        <section className="recoveryMap" aria-label="Recovery key inventory">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Asset ledger</p>
              <h2>Recovery keys, backup tokens, emergency passphrases, escrow readiness, and rollback-safe recovery drills</h2>
            </div>
            <div className="readinessBadge">
              <span />
              escrow checked
            </div>
          </div>

          <div className="assetGrid" role="list">
            {assets.map((asset) => (
              <article className="assetCard" data-state={asset.state} key={asset.name} role="listitem" tabIndex={0}>
                <div className="assetStatus">
                  <span>{stateLabels[asset.state]}</span>
                  <strong>{asset.kind}</strong>
                </div>
                <h3>{asset.name}</h3>
                <dl>
                  <div>
                    <dt>Owner</dt>
                    <dd>{asset.owner}</dd>
                  </div>
                  <div>
                    <dt>Verified</dt>
                    <dd>{asset.lastVerified}</dd>
                  </div>
                  <div>
                    <dt>Location</dt>
                    <dd>{asset.location}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="split">
          <section className="drillPanel" aria-labelledby="drill-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Dry run</p>
              <h2 id="drill-title">Recovery drill steps</h2>
            </div>
            <div className="drillList" role="list">
              {drillSteps.map((step) => (
                <article data-state={step.state} key={step.title} role="listitem" tabIndex={0}>
                  <span>{stateLabels[step.state]}</span>
                  <h3>{step.title}</h3>
                  <code>{step.command}</code>
                  <p>{step.evidence}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="escrowPanel" aria-labelledby="escrow-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Escrow map</p>
              <h2 id="escrow-title">Fallback coverage</h2>
            </div>
            <div className="escrowList" role="list">
              {escrowChecks.map((check) => (
                <article data-state={check.state} key={check.service} role="listitem" tabIndex={0}>
                  <span>{stateLabels[check.state]}</span>
                  <h3>{check.service}</h3>
                  <p>{check.escrow}</p>
                  <strong>{check.fallback}</strong>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section className="timelinePanel" aria-labelledby="timeline-title">
          <div className="panelHeader compact">
            <p className="eyebrow">Rollback plan</p>
            <h2 id="timeline-title">Safe recovery drill window</h2>
          </div>
          <div className="timeline" role="list">
            {timeline.map((item) => (
              <article data-state={item.state} key={item.window} role="listitem" tabIndex={0}>
                <span>{item.window}</span>
                <p>{item.task}</p>
                <strong>{item.rollback}</strong>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
