type Tone = 'critical' | 'late' | 'blocked' | 'ready';

type Candidate = {
  title: string;
  risk: string;
  owner: string;
  sla: string;
  blocker: string;
  batch: string;
  tone: Tone;
};

type OwnerLane = {
  owner: string;
  queue: string;
  assigned: string;
  note: string;
};

type ReviewerNote = {
  reviewer: string;
  candidate: string;
  note: string;
  decision: string;
};

type CleanupBatch = {
  name: string;
  removals: string;
  rollback: string;
  window: string;
  tone: Tone;
};

const metrics = [
  { label: 'critical removals', value: '13', tone: 'critical' },
  { label: 'missed SLA windows', value: '7', tone: 'late' },
  { label: 'dependency blockers', value: '5', tone: 'blocked' },
  { label: 'ready batches', value: '9', tone: 'ready' }
] satisfies Array<{ label: string; value: string; tone: Tone }>;

const candidates: Candidate[] = [
  {
    title: 'Remove stale finance warehouse exception',
    risk: 'SOX high',
    owner: 'Rina Patel',
    sla: 'missed by 2d',
    blocker: 'quarter-close export signed',
    batch: 'Finance cleanup A',
    tone: 'critical'
  },
  {
    title: 'Revoke support console orphan role',
    risk: 'incident access',
    owner: 'Marisol Chen',
    sla: 'due today',
    blocker: 'incident owner missing',
    batch: 'Support cleanup B',
    tone: 'blocked'
  },
  {
    title: 'Expire legacy vendor VPN grant',
    risk: 'network path',
    owner: 'Jon Bell',
    sla: 'missed by 5d',
    blocker: 'sponsor rationale stale',
    batch: 'Vendor cleanup C',
    tone: 'late'
  },
  {
    title: 'Retire old release signing backup',
    risk: 'key custody',
    owner: 'Avery Kim',
    sla: 'on track',
    blocker: 'rollback command ready',
    batch: 'Release cleanup D',
    tone: 'ready'
  }
];

const owners: OwnerLane[] = [
  {
    owner: 'Rina Patel',
    queue: 'Finance remediation',
    assigned: '18 removals',
    note: 'prioritize SOX exceptions before close'
  },
  {
    owner: 'Marisol Chen',
    queue: 'Support break-glass',
    assigned: '11 removals',
    note: 'needs incident commander delegate'
  },
  {
    owner: 'Jon Bell',
    queue: 'Vendor programs',
    assigned: '14 removals',
    note: 'bundle VPN and SaaS removals together'
  }
];

const reviewerNotes: ReviewerNote[] = [
  {
    reviewer: 'Nina Walsh',
    candidate: 'Finance exception',
    note: 'Remove after export snapshot is attached.',
    decision: 'approved with rollback'
  },
  {
    reviewer: 'Cal Mateo',
    candidate: 'Support orphan role',
    note: 'Block until commander delegate is named.',
    decision: 'needs owner'
  },
  {
    reviewer: 'Priya Rao',
    candidate: 'Vendor VPN',
    note: 'Sponsor rationale is stale and should expire.',
    decision: 'approved removal'
  }
];

const batches: CleanupBatch[] = [
  {
    name: 'Finance cleanup A',
    removals: '37 entitlements',
    rollback: 'restore exception group edge',
    window: 'today 16:30',
    tone: 'critical'
  },
  {
    name: 'Support cleanup B',
    removals: '9 orphan roles',
    rollback: 're-enable commander override',
    window: 'blocked',
    tone: 'blocked'
  },
  {
    name: 'Release cleanup D',
    removals: '3 signing grants',
    rollback: 'restore backup signer set',
    window: 'May 03',
    tone: 'ready'
  }
];

const guardrails = [
  'Snapshot current entitlements before cleanup',
  'Group removals by owner and dependency blocker',
  'Attach reviewer notes to each cleanup batch',
  'Keep rollback commands staged until SLA closeout'
];

function toneLabel(tone: Tone) {
  return {
    critical: 'critical',
    late: 'late',
    blocked: 'blocked',
    ready: 'ready'
  }[tone];
}

export function App() {
  return (
    <main className="shell">
      <section className="masthead" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">Access remediation</p>
          <h1 id="page-title">Priority board for cleanup batches.</h1>
          <p className="lede">
            Inspect access remediation candidates, risk-ranked removals, owner assignments, missed
            SLA windows, dependency blockers, reviewer notes, and rollback-safe cleanup batches.
          </p>
        </div>

        <div className="actions" aria-label="Remediation actions">
          <button type="button">Stage cleanup</button>
          <button type="button">Export queue</button>
        </div>
      </section>

      <section className="metrics" aria-label="Remediation summary">
        {metrics.map((metric) => (
          <article className="metric" data-tone={metric.tone} key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </article>
        ))}
      </section>

      <section className="board-layout">
        <div className="panel candidate-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Candidates</p>
              <h2>Risk-ranked removals</h2>
            </div>
            <span>batch aware</span>
          </div>

          <div className="candidate-list" role="list" aria-label="Access remediation candidates">
            {candidates.map((candidate) => (
              <button className="candidate-row" data-tone={candidate.tone} key={candidate.title} type="button">
                <span className="status-dot" aria-hidden="true" />
                <span>
                  <strong>{candidate.title}</strong>
                  <small>{candidate.risk}</small>
                </span>
                <span>{candidate.owner}</span>
                <em>{candidate.sla}</em>
                <span>{candidate.batch}</span>
                <small>{candidate.blocker}</small>
              </button>
            ))}
          </div>
        </div>

        <aside className="panel owner-panel" aria-label="Owner assignments">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Owners</p>
              <h2>Assignment lanes</h2>
            </div>
          </div>

          <div className="owner-list">
            {owners.map((owner) => (
              <article className="owner-card" key={owner.owner}>
                <span>{owner.assigned}</span>
                <strong>{owner.owner}</strong>
                <p>{owner.queue}</p>
                <small>{owner.note}</small>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="detail-grid">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Review</p>
              <h2>Reviewer notes</h2>
            </div>
          </div>

          <div className="note-table" role="table" aria-label="Reviewer remediation notes">
            {reviewerNotes.map((note) => (
              <div className="note-row" role="row" key={`${note.reviewer}-${note.candidate}`}>
                <strong>{note.reviewer}</strong>
                <span>{note.candidate}</span>
                <small>{note.note}</small>
                <em>{note.decision}</em>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Batches</p>
              <h2>Cleanup windows</h2>
            </div>
          </div>

          <div className="batch-list">
            {batches.map((batch) => (
              <article className="batch-card" data-tone={batch.tone} key={batch.name}>
                <span>{toneLabel(batch.tone)}</span>
                <strong>{batch.name}</strong>
                <p>{batch.removals}</p>
                <small>{batch.rollback}</small>
                <em>{batch.window}</em>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="panel guardrail-panel" aria-label="Rollback-safe cleanup guardrails">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Rollback safe</p>
            <h2>Cleanup batch checklist</h2>
          </div>
          <button type="button" className="primary-action">
            Approve cleanup batch
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
