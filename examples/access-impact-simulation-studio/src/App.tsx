type Tone = 'risk' | 'review' | 'ready' | 'guarded';

type Simulation = {
  title: string;
  change: string;
  principals: string;
  denyPath: string;
  confidence: string;
  tone: Tone;
};

type BlastDelta = {
  resource: string;
  before: string;
  after: string;
  delta: string;
  tone: Tone;
};

type Control = {
  name: string;
  owner: string;
  coverage: string;
  note: string;
};

type Evidence = {
  artifact: string;
  source: string;
  captured: string;
  rollback: string;
};

const metrics = [
  { label: 'proposed changes', value: '11', tone: 'review' },
  { label: 'high-risk deny paths', value: '4', tone: 'risk' },
  { label: 'guarded controls', value: '9', tone: 'guarded' },
  { label: 'ready simulations', value: '6', tone: 'ready' }
] satisfies Array<{ label: string; value: string; tone: Tone }>;

const simulations: Simulation[] = [
  {
    title: 'Remove legacy finance exception',
    change: 'Drop exception_group from warehouse reader policy',
    principals: '37 users, 4 service accounts',
    denyPath: 'Quarter-close notebook loses stale reader path',
    confidence: '94 percent',
    tone: 'ready'
  },
  {
    title: 'Constrain support escalation role',
    change: 'Require active incident binding for console entry',
    principals: '71 responders',
    denyPath: 'Two open incidents would lose commander override',
    confidence: '68 percent',
    tone: 'risk'
  },
  {
    title: 'Expire vendor VPN grant',
    change: 'Remove legacy_vendor_group from split tunnel',
    principals: '46 contractors',
    denyPath: 'Build vendor cannot reach package mirror',
    confidence: '81 percent',
    tone: 'review'
  },
  {
    title: 'Tighten signing quorum',
    change: 'Require two attested release captains',
    principals: '12 release captains',
    denyPath: 'Backup publisher remains available',
    confidence: '97 percent',
    tone: 'guarded'
  }
];

const blastDeltas: BlastDelta[] = [
  {
    resource: 'Finance warehouse',
    before: '449 effective readers',
    after: '412 effective readers',
    delta: '-37 stale readers',
    tone: 'ready'
  },
  {
    resource: 'Support console',
    before: '75 emergency activators',
    after: '66 incident-bound activators',
    delta: '-9 orphaned paths',
    tone: 'risk'
  },
  {
    resource: 'Vendor VPN',
    before: '58 network grants',
    after: '44 sponsored grants',
    delta: '-14 legacy grants',
    tone: 'review'
  }
];

const controls: Control[] = [
  {
    name: 'Temporary owner override',
    owner: 'Marisol Chen',
    coverage: '2 open incidents',
    note: 'keeps commander path while policy narrows'
  },
  {
    name: 'Package mirror allowlist',
    owner: 'Jon Bell',
    coverage: '1 vendor build lane',
    note: 'compensates for VPN grant expiry'
  },
  {
    name: 'Release backup quorum',
    owner: 'Avery Kim',
    coverage: '3 backup captains',
    note: 'preserves deploy path after signer change'
  }
];

const evidence: Evidence[] = [
  {
    artifact: 'Simulation principal set',
    source: 'access-sim run 2048',
    captured: '11:20',
    rollback: 'restore previous policy group edges'
  },
  {
    artifact: 'Deny-path trace',
    source: 'policy graph diff',
    captured: '11:24',
    rollback: 're-enable incident override claim'
  },
  {
    artifact: 'Blast-radius delta',
    source: 'review ledger snapshot',
    captured: '11:30',
    rollback: 'replay baseline entitlement export'
  }
];

const guardrails = [
  'Snapshot affected principals before running the simulation',
  'Record deny paths with compensating control owners',
  'Bind confidence score to reviewer approval evidence',
  'Keep rollback commands beside the simulation artifact'
];

function toneLabel(tone: Tone) {
  return {
    risk: 'risk',
    review: 'review',
    ready: 'ready',
    guarded: 'guarded'
  }[tone];
}

export function App() {
  return (
    <main className="shell">
      <section className="masthead" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">Access impact simulation</p>
          <h1 id="page-title">Studio for proposed access changes.</h1>
          <p className="lede">
            Inspect proposed access changes, simulated deny paths, impacted principals,
            compensating controls, reviewer confidence, blast-radius deltas, and rollback-safe
            simulation evidence.
          </p>
        </div>

        <div className="actions" aria-label="Simulation actions">
          <button type="button">Run simulation</button>
          <button type="button">Export evidence</button>
        </div>
      </section>

      <section className="metrics" aria-label="Simulation summary">
        {metrics.map((metric) => (
          <article className="metric" data-tone={metric.tone} key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </article>
        ))}
      </section>

      <section className="studio-layout">
        <div className="panel simulation-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Proposals</p>
              <h2>Change simulations</h2>
            </div>
            <span>evidence linked</span>
          </div>

          <div className="simulation-list" role="list" aria-label="Proposed access change simulations">
            {simulations.map((simulation) => (
              <button className="simulation-row" data-tone={simulation.tone} key={simulation.title} type="button">
                <span className="status-dot" aria-hidden="true" />
                <span>
                  <strong>{simulation.title}</strong>
                  <small>{simulation.change}</small>
                </span>
                <span>{simulation.principals}</span>
                <em>{simulation.confidence}</em>
                <small>{simulation.denyPath}</small>
              </button>
            ))}
          </div>
        </div>

        <aside className="panel blast-panel" aria-label="Blast-radius deltas">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Blast radius</p>
              <h2>Before and after</h2>
            </div>
          </div>

          <div className="blast-list">
            {blastDeltas.map((delta) => (
              <article className="blast-card" data-tone={delta.tone} key={delta.resource}>
                <span>{toneLabel(delta.tone)}</span>
                <strong>{delta.resource}</strong>
                <p>{delta.before}</p>
                <p>{delta.after}</p>
                <small>{delta.delta}</small>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="detail-grid">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Controls</p>
              <h2>Compensating controls</h2>
            </div>
          </div>

          <div className="control-table" role="table" aria-label="Compensating controls">
            {controls.map((control) => (
              <div className="control-row" role="row" key={control.name}>
                <strong>{control.name}</strong>
                <span>{control.owner}</span>
                <small>{control.coverage}</small>
                <em>{control.note}</em>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Evidence</p>
              <h2>Rollback artifacts</h2>
            </div>
          </div>

          <div className="evidence-list">
            {evidence.map((item) => (
              <article className="evidence-card" key={item.artifact}>
                <span>{item.captured}</span>
                <strong>{item.artifact}</strong>
                <p>{item.source}</p>
                <small>{item.rollback}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="panel guardrail-panel" aria-label="Rollback-safe simulation guardrails">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Guardrails</p>
            <h2>Simulation evidence checklist</h2>
          </div>
          <button type="button" className="primary-action">
            Seal simulation evidence
          </button>
        </div>

        <ol className="guardrail-list">
          {guardrails.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </main>
  );
}
