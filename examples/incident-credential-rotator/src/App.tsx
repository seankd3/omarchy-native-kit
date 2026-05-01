type RotationState = 'rotated' | 'staged' | 'blocked';

type CredentialReport = {
  name: string;
  source: string;
  owner: string;
  age: string;
  state: RotationState;
};

type RotationBatch = {
  title: string;
  services: string;
  owner: string;
  window: string;
  state: RotationState;
};

type Snapshot = {
  label: string;
  command: string;
  rollback: string;
  state: RotationState;
};

type CleanupTask = {
  title: string;
  action: string;
  evidence: string;
  state: RotationState;
};

const reports: CredentialReport[] = [
  {
    name: 'Git deploy token',
    source: 'public leak scanner',
    owner: 'release',
    age: '184 days',
    state: 'staged'
  },
  {
    name: 'Database readonly',
    source: 'incident ticket INC-0428',
    owner: 'data',
    age: '92 days',
    state: 'rotated'
  },
  {
    name: 'Object storage key',
    source: 'access log anomaly',
    owner: 'infra',
    age: '311 days',
    state: 'staged'
  },
  {
    name: 'Legacy webhook secret',
    source: 'unknown owner report',
    owner: 'unassigned',
    age: 'missing',
    state: 'blocked'
  }
];

const batches: RotationBatch[] = [
  {
    title: 'Repository automation',
    services: 'Git deploy token, package publisher, release webhook',
    owner: 'Release desk',
    window: '22:00-22:30',
    state: 'staged'
  },
  {
    title: 'Data plane readers',
    services: 'readonly database, metrics exporter, report replica',
    owner: 'Data team',
    window: 'complete',
    state: 'rotated'
  },
  {
    title: 'Storage edge',
    services: 'object storage key, CDN purge token',
    owner: 'Infra',
    window: '23:00-23:20',
    state: 'staged'
  },
  {
    title: 'Webhook cleanup',
    services: 'legacy webhook secret',
    owner: 'needs owner',
    window: 'blocked',
    state: 'blocked'
  }
];

const snapshots: Snapshot[] = [
  {
    label: 'Secrets inventory',
    command: 'omarchy-native agent json > incident-context.json',
    rollback: 'restore previous credential inventory before write',
    state: 'rotated'
  },
  {
    label: 'Service config',
    command: 'systemctl --user cat release-worker > release-worker.snapshot',
    rollback: 'reload saved unit and previous env file',
    state: 'staged'
  },
  {
    label: 'Vault export',
    command: 'vault kv metadata get secret/release',
    rollback: 're-enable previous secret version until consumers reload',
    state: 'staged'
  },
  {
    label: 'Webhook owner map',
    command: 'rg legacy-webhook owner-index.md',
    rollback: 'blocked until owner signs rotation',
    state: 'blocked'
  }
];

const cleanupTasks: CleanupTask[] = [
  {
    title: 'Revoke exposed token',
    action: 'remove old deploy token after new release worker confirms auth',
    evidence: 'old token rejected in audit probe',
    state: 'staged'
  },
  {
    title: 'Rotate dependent configs',
    action: 'update consumers and reload services in dependency order',
    evidence: 'all health probes pass with new secret version',
    state: 'rotated'
  },
  {
    title: 'Purge local traces',
    action: 'remove copied secret values from shells, logs, and scratch files',
    evidence: 'secret scanner returns no local hits',
    state: 'staged'
  },
  {
    title: 'Close unknown owner gap',
    action: 'assign legacy webhook owner before destructive revoke',
    evidence: 'blocked rotation has accountable service owner',
    state: 'blocked'
  }
];

const stateLabels: Record<RotationState, string> = {
  rotated: 'Rotated',
  staged: 'Staged',
  blocked: 'Blocked'
};

const rotatedCount = reports.filter((report) => report.state === 'rotated').length + batches.filter((batch) => batch.state === 'rotated').length;
const stagedCount = reports.filter((report) => report.state === 'staged').length + batches.filter((batch) => batch.state === 'staged').length;
const blockedCount = reports.filter((report) => report.state === 'blocked').length + cleanupTasks.filter((task) => task.state === 'blocked').length;

export function App() {
  return (
    <main className="shell">
      <section className="workspace" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Incident response</p>
            <h1 id="page-title">Credential Rotator</h1>
          </div>
          <button type="button">Stage Rotation</button>
        </header>

        <section className="summary" aria-label="Credential rotation summary">
          <article>
            <span>{reports.length}</span>
            <p>credential reports</p>
          </article>
          <article>
            <span>{rotatedCount}</span>
            <p>rotated paths</p>
          </article>
          <article>
            <span>{stagedCount}</span>
            <p>staged changes</p>
          </article>
          <article>
            <span>{blockedCount}</span>
            <p>blocked revokes</p>
          </article>
        </section>

        <section className="reportPanel" aria-label="Compromised credential reports">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Exposure ledger</p>
              <h2>Compromised credential reports, rotation batches, service owners, secret age, rollback snapshots, and post-incident access cleanup</h2>
            </div>
            <div className="rotationBadge">
              <span />
              rollback first
            </div>
          </div>

          <div className="reportGrid" role="list">
            {reports.map((report) => (
              <article className="reportCard" data-state={report.state} key={report.name} role="listitem" tabIndex={0}>
                <div className="cardStatus">
                  <span>{stateLabels[report.state]}</span>
                  <strong>{report.age}</strong>
                </div>
                <h3>{report.name}</h3>
                <dl>
                  <div>
                    <dt>Source</dt>
                    <dd>{report.source}</dd>
                  </div>
                  <div>
                    <dt>Owner</dt>
                    <dd>{report.owner}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="split">
          <section className="batchPanel" aria-labelledby="batch-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Batches</p>
              <h2 id="batch-title">Rotation windows</h2>
            </div>
            <div className="batchList" role="list">
              {batches.map((batch) => (
                <article data-state={batch.state} key={batch.title} role="listitem" tabIndex={0}>
                  <span>{stateLabels[batch.state]}</span>
                  <h3>{batch.title}</h3>
                  <p>{batch.services}</p>
                  <strong>{batch.owner}</strong>
                  <small>{batch.window}</small>
                </article>
              ))}
            </div>
          </section>

          <section className="snapshotPanel" aria-labelledby="snapshot-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Snapshots</p>
              <h2 id="snapshot-title">Rollback anchors</h2>
            </div>
            <div className="snapshotList" role="list">
              {snapshots.map((snapshot) => (
                <article data-state={snapshot.state} key={snapshot.label} role="listitem" tabIndex={0}>
                  <span>{stateLabels[snapshot.state]}</span>
                  <h3>{snapshot.label}</h3>
                  <code>{snapshot.command}</code>
                  <strong>{snapshot.rollback}</strong>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section className="cleanupPanel" aria-labelledby="cleanup-title">
          <div className="panelHeader compact">
            <p className="eyebrow">Cleanup</p>
            <h2 id="cleanup-title">Post-incident access cleanup</h2>
          </div>
          <div className="cleanupList" role="list">
            {cleanupTasks.map((task) => (
              <article data-state={task.state} key={task.title} role="listitem" tabIndex={0}>
                <span>{stateLabels[task.state]}</span>
                <h3>{task.title}</h3>
                <p>{task.action}</p>
                <strong>{task.evidence}</strong>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
