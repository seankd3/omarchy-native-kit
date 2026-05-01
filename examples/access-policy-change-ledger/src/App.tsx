type Tone = 'blocked' | 'review' | 'ready' | 'scheduled';

type PolicyChange = {
  title: string;
  policy: string;
  approver: string;
  principals: string;
  publish: string;
  status: string;
  tone: Tone;
};

type RuleDiff = {
  rule: string;
  before: string;
  after: string;
  impact: string;
  tone: Tone;
};

type Simulation = {
  name: string;
  result: string;
  affected: string;
  signal: string;
};

type History = {
  event: string;
  actor: string;
  time: string;
  rollback: string;
};

const metrics = [
  { label: 'open edits', value: '16', tone: 'review' },
  { label: 'blocked publishes', value: '3', tone: 'blocked' },
  { label: 'ready windows', value: '8', tone: 'ready' },
  { label: 'scheduled rollbacks', value: '5', tone: 'scheduled' }
] satisfies Array<{ label: string; value: string; tone: Tone }>;

const changes: PolicyChange[] = [
  {
    title: 'Tighten finance warehouse access',
    policy: 'Finance reader exception',
    approver: 'Rina Patel',
    principals: '412 users, 18 groups',
    publish: 'today 16:00',
    status: 'simulation clean',
    tone: 'ready'
  },
  {
    title: 'Restrict support break-glass console',
    policy: 'Emergency support access',
    approver: 'Marisol Chen',
    principals: '71 users, 4 roles',
    publish: 'blocked',
    status: 'missing incident owner',
    tone: 'blocked'
  },
  {
    title: 'Retire vendor VPN exception',
    policy: 'Third-party network access',
    approver: 'Jon Bell',
    principals: '46 contractors',
    publish: 'May 02 09:00',
    status: 'awaiting sponsor sign-off',
    tone: 'review'
  },
  {
    title: 'Update release signing quorum',
    policy: 'Artifact publishing',
    approver: 'Avery Kim',
    principals: '12 release captains',
    publish: 'May 03 10:30',
    status: 'rollback staged',
    tone: 'scheduled'
  }
];

const diffs: RuleDiff[] = [
  {
    rule: 'Finance reader exception',
    before: 'Allow finance_readers plus exception_group',
    after: 'Allow finance_readers only when review attested',
    impact: 'removes 37 stale exceptions',
    tone: 'ready'
  },
  {
    rule: 'Support break-glass',
    before: 'Allow emergency_role without incident binding',
    after: 'Require active incident commander approval',
    impact: 'blocks 9 orphaned activations',
    tone: 'blocked'
  },
  {
    rule: 'Vendor VPN',
    before: 'Allow sponsor_group and legacy_vendor_group',
    after: 'Allow sponsor_group until contract expiry',
    impact: 'expires 14 legacy accounts',
    tone: 'review'
  }
];

const simulations: Simulation[] = [
  {
    name: 'Finance warehouse publish',
    result: 'no critical breakage',
    affected: '37 removals',
    signal: 'owners acknowledged'
  },
  {
    name: 'Support console publish',
    result: 'would block active incident',
    affected: '2 responders',
    signal: 'publish blocked'
  },
  {
    name: 'Release signing quorum',
    result: 'backup path retained',
    affected: '3 quorum changes',
    signal: 'rollback command generated'
  }
];

const history: History[] = [
  {
    event: 'Draft opened',
    actor: 'policy-bot',
    time: '08:22',
    rollback: 'captured current rule set'
  },
  {
    event: 'Approver reviewed diff',
    actor: 'Rina Patel',
    time: '10:14',
    rollback: 'approved finance restore plan'
  },
  {
    event: 'Simulation snapshot sealed',
    actor: 'access-sim',
    time: '11:38',
    rollback: 'stored affected principal list'
  }
];

const rollbackSteps = [
  'Snapshot current policy rules before publish',
  'Bind simulation output to affected principals',
  'Publish only inside approved maintenance window',
  'Keep previous rule set restorable until audit close'
];

function toneLabel(tone: Tone) {
  return {
    blocked: 'blocked',
    review: 'review',
    ready: 'ready',
    scheduled: 'scheduled'
  }[tone];
}

export function App() {
  return (
    <main className="shell">
      <section className="masthead" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">Access policy ledger</p>
          <h1 id="page-title">Change history for policy publishes.</h1>
          <p className="lede">
            Inspect access policy edits, approver chains, diffed rule changes, affected principals,
            simulation snapshots, publish windows, and rollback-safe policy history.
          </p>
        </div>

        <div className="actions" aria-label="Ledger actions">
          <button type="button">Approve window</button>
          <button type="button">Export ledger</button>
        </div>
      </section>

      <section className="metrics" aria-label="Policy change summary">
        {metrics.map((metric) => (
          <article className="metric" data-tone={metric.tone} key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </article>
        ))}
      </section>

      <section className="ledger-layout">
        <div className="panel change-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Changes</p>
              <h2>Policy edit ledger</h2>
            </div>
            <span>publish guarded</span>
          </div>

          <div className="change-list" role="list" aria-label="Access policy changes">
            {changes.map((change) => (
              <button className="change-row" data-tone={change.tone} key={change.title} type="button">
                <span className="status-dot" aria-hidden="true" />
                <span>
                  <strong>{change.title}</strong>
                  <small>{change.policy}</small>
                </span>
                <span>{change.approver}</span>
                <span>{change.principals}</span>
                <em>{change.publish}</em>
                <small>{change.status}</small>
              </button>
            ))}
          </div>
        </div>

        <aside className="panel diff-panel" aria-label="Diffed rule changes">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Rule diffs</p>
              <h2>Before and after</h2>
            </div>
          </div>

          <div className="diff-list">
            {diffs.map((diff) => (
              <article className="diff-card" data-tone={diff.tone} key={diff.rule}>
                <span>{toneLabel(diff.tone)}</span>
                <strong>{diff.rule}</strong>
                <p>{diff.before}</p>
                <p>{diff.after}</p>
                <small>{diff.impact}</small>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="detail-grid">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Simulation</p>
              <h2>Publish snapshots</h2>
            </div>
          </div>

          <div className="simulation-table" role="table" aria-label="Policy simulation snapshots">
            {simulations.map((simulation) => (
              <div className="simulation-row" role="row" key={simulation.name}>
                <strong>{simulation.name}</strong>
                <span>{simulation.result}</span>
                <small>{simulation.affected}</small>
                <em>{simulation.signal}</em>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">History</p>
              <h2>Rollback chain</h2>
            </div>
          </div>

          <div className="history-list">
            {history.map((item) => (
              <article className="history-card" key={`${item.event}-${item.time}`}>
                <span>{item.time}</span>
                <strong>{item.event}</strong>
                <p>{item.actor}</p>
                <small>{item.rollback}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="panel rollback-panel" aria-label="Rollback-safe policy history">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Rollback safe</p>
            <h2>Policy publish checklist</h2>
          </div>
          <button type="button" className="primary-action">
            Stage policy publish
          </button>
        </div>

        <ol className="rollback-list">
          {rollbackSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </main>
  );
}
