type Tone = 'sealed' | 'review' | 'warning' | 'ready';

type EvidenceBundle = {
  title: string;
  campaign: string;
  owner: string;
  status: string;
  contents: string;
  tone: Tone;
};

type Attestation = {
  reviewer: string;
  scope: string;
  decision: string;
  signed: string;
  tone: Tone;
};

type Snapshot = {
  source: string;
  exported: string;
  hash: string;
  coverage: string;
};

type CustodyEvent = {
  actor: string;
  event: string;
  time: string;
  note: string;
};

const metrics = [
  { label: 'sealed bundles', value: '31', tone: 'sealed' },
  { label: 'awaiting attestations', value: '8', tone: 'review' },
  { label: 'rationale gaps', value: '5', tone: 'warning' },
  { label: 'retention windows', value: '12', tone: 'ready' }
] satisfies Array<{ label: string; value: string; tone: Tone }>;

const bundles: EvidenceBundle[] = [
  {
    title: 'Q2 Finance access review',
    campaign: 'SOX quarterly',
    owner: 'Rina Patel',
    status: 'ready to seal',
    contents: 'membership export, reviewer notes, exception rationale',
    tone: 'ready'
  },
  {
    title: 'Support break-glass review',
    campaign: 'Incident access',
    owner: 'Marisol Chen',
    status: 'attestation missing',
    contents: 'temporary roles, session revocations, manager decisions',
    tone: 'review'
  },
  {
    title: 'Vendor VPN entitlement audit',
    campaign: 'Third-party access',
    owner: 'Jon Bell',
    status: 'rationale stale',
    contents: 'VPN exports, sponsor approvals, expiration evidence',
    tone: 'warning'
  },
  {
    title: 'Release signing access',
    campaign: 'Platform release',
    owner: 'Avery Kim',
    status: 'sealed',
    contents: 'key custody, reviewer signatures, rollback notes',
    tone: 'sealed'
  }
];

const attestations: Attestation[] = [
  {
    reviewer: 'Nina Walsh',
    scope: 'Finance warehouse readers',
    decision: 'approved with exception note',
    signed: 'today 10:42',
    tone: 'ready'
  },
  {
    reviewer: 'Cal Mateo',
    scope: 'Support privileged roles',
    decision: 'needs incident commander signature',
    signed: 'pending',
    tone: 'review'
  },
  {
    reviewer: 'Priya Rao',
    scope: 'Vendor connectivity',
    decision: 'reject stale sponsor rationale',
    signed: 'pending legal note',
    tone: 'warning'
  }
];

const snapshots: Snapshot[] = [
  {
    source: 'Directory groups',
    exported: '2026-05-01 08:00',
    hash: 'sha256:9b4a...31e0',
    coverage: 'all nested access edges'
  },
  {
    source: 'SaaS entitlements',
    exported: '2026-05-01 08:12',
    hash: 'sha256:52ce...8a70',
    coverage: 'owner, app, role, exception'
  },
  {
    source: 'Review decisions',
    exported: '2026-05-01 09:40',
    hash: 'sha256:c180...74de',
    coverage: 'attestation and rationale'
  }
];

const custody: CustodyEvent[] = [
  {
    actor: 'review-bot',
    event: 'Bundle assembled',
    time: '08:18',
    note: 'normalized exports and attached source hashes'
  },
  {
    actor: 'Rina Patel',
    event: 'Reviewer attested',
    time: '10:42',
    note: 'approved finance exceptions with close ticket'
  },
  {
    actor: 'security-review',
    event: 'Seal requested',
    time: '11:05',
    note: 'retention policy and rollback evidence verified'
  }
];

const sealingSteps = [
  'Verify every export has a source hash and timestamp',
  'Lock reviewer attestations against the campaign scope',
  'Bind exception rationale to the retained access snapshot',
  'Seal bundle with retention date and restoration note'
];

function toneLabel(tone: Tone) {
  return {
    sealed: 'sealed',
    review: 'review',
    warning: 'gap',
    ready: 'ready'
  }[tone];
}

export function App() {
  return (
    <main className="shell">
      <section className="masthead" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">Access review evidence</p>
          <h1 id="page-title">Locker for defensible review bundles.</h1>
          <p className="lede">
            Inspect review evidence bundles, reviewer attestations, exported access snapshots,
            exception rationale, chain-of-custody notes, retention windows, and rollback-safe
            evidence sealing.
          </p>
        </div>

        <div className="actions" aria-label="Locker actions">
          <button type="button">Seal selected</button>
          <button type="button">Export manifest</button>
        </div>
      </section>

      <section className="metrics" aria-label="Evidence locker summary">
        {metrics.map((metric) => (
          <article className="metric" data-tone={metric.tone} key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </article>
        ))}
      </section>

      <section className="review-layout">
        <div className="panel bundle-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Bundles</p>
              <h2>Evidence packages</h2>
            </div>
            <span>chain checked</span>
          </div>

          <div className="bundle-list" role="list" aria-label="Access review evidence bundles">
            {bundles.map((bundle) => (
              <button className="bundle-row" data-tone={bundle.tone} type="button" key={bundle.title}>
                <span className="status-dot" aria-hidden="true" />
                <span>
                  <strong>{bundle.title}</strong>
                  <small>{bundle.campaign}</small>
                </span>
                <span>{bundle.owner}</span>
                <em>{bundle.status}</em>
                <small>{bundle.contents}</small>
              </button>
            ))}
          </div>
        </div>

        <aside className="panel attest-panel" aria-label="Reviewer attestations">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Attestations</p>
              <h2>Reviewer signatures</h2>
            </div>
          </div>

          <div className="attestation-list">
            {attestations.map((item) => (
              <article className="attestation-card" data-tone={item.tone} key={item.reviewer}>
                <span>{toneLabel(item.tone)}</span>
                <strong>{item.reviewer}</strong>
                <p>{item.scope}</p>
                <small>{item.decision}</small>
                <em>{item.signed}</em>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="detail-grid">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Snapshots</p>
              <h2>Exported access state</h2>
            </div>
          </div>

          <div className="snapshot-table" role="table" aria-label="Exported access snapshots">
            {snapshots.map((snapshot) => (
              <div className="snapshot-row" role="row" key={snapshot.source}>
                <strong>{snapshot.source}</strong>
                <span>{snapshot.exported}</span>
                <small>{snapshot.hash}</small>
                <em>{snapshot.coverage}</em>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Custody</p>
              <h2>Chain of custody</h2>
            </div>
          </div>

          <div className="custody-list">
            {custody.map((event) => (
              <article className="custody-card" key={`${event.actor}-${event.time}`}>
                <span>{event.time}</span>
                <strong>{event.event}</strong>
                <p>{event.actor}</p>
                <small>{event.note}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="panel seal-panel" aria-label="Rollback-safe evidence sealing">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Retention</p>
            <h2>Safe sealing checklist</h2>
          </div>
          <button type="button" className="primary-action">
            Lock retention window
          </button>
        </div>

        <ol className="seal-list">
          {sealingSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </main>
  );
}
