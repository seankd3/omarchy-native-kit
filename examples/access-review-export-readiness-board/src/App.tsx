const metrics = [
  { label: 'Export candidates', value: '46', note: '31 sealed and routed', tone: 'info' },
  { label: 'Packet coverage', value: '82%', note: 'owner receipts included', tone: 'good' },
  { label: 'Reviewer blockers', value: '7', note: '3 block delivery', tone: 'danger' },
  { label: 'Destinations ready', value: '5/8', note: 'vault, GRC, archive', tone: 'warn' }
];

const reviews = [
  {
    title: 'Quarterly access certification',
    owner: 'Identity governance',
    status: 'Ready',
    sealed: '28 of 31 packets',
    blocker: 'Legal hold labels need final checksum',
    destination: 'GRC evidence vault',
    progress: '90%',
    detail: 'Most review packets are sealed with owner receipts, delegated approvals, and rollback trails.'
  },
  {
    title: 'Emergency lease cleanup',
    owner: 'Security operations',
    status: 'Blocked',
    sealed: '8 of 14 packets',
    blocker: 'Missing stale token evidence',
    destination: 'Incident archive',
    progress: '48%',
    detail: 'Export is paused until late evidence and retry exceptions are attached to the delivery packet.'
  },
  {
    title: 'Privileged signer rotation',
    owner: 'Release engineering',
    status: 'Review',
    sealed: '11 of 13 packets',
    blocker: 'Reviewer note pending',
    destination: 'Audit board packet',
    progress: '74%',
    detail: 'Rollback commands are sealed, but the board export still needs reviewer signoff text.'
  },
  {
    title: 'Support tenant removal',
    owner: 'Support platform',
    status: 'Ready',
    sealed: '19 of 20 packets',
    blocker: 'One destination receipt queued',
    destination: 'Customer trust archive',
    progress: '86%',
    detail: 'Delegated approvals and removal evidence are complete; delivery trail is waiting on archive receipt.'
  }
];

const coverage = [
  { item: 'sealed packet manifest', total: '46', ready: '38', state: 'Covered' },
  { item: 'owner receipt bundle', total: '46', ready: '41', state: 'Gap' },
  { item: 'stale evidence attachments', total: '32', ready: '25', state: 'Gap' },
  { item: 'rollback delivery trail', total: '46', ready: '39', state: 'Covered' }
];

const blockers = [
  { name: 'stale-token-proof', owner: 'Security operations', age: '42m', severity: 'Blocker' },
  { name: 'legal-hold-checksum', owner: 'Identity governance', age: '18m', severity: 'High' },
  { name: 'signer-note-review', owner: 'Release engineering', age: '24m', severity: 'Medium' },
  { name: 'archive-receipt-queue', owner: 'Support platform', age: '9m', severity: 'Queued' }
];

const approvals = [
  { delegate: 'Priya Shah', scope: 'certification export', approval: 'signed', state: 'Ready' },
  { delegate: 'Dante Moore', scope: 'lease cleanup packet', approval: 'requested', state: 'Queued' },
  { delegate: 'Mira Olsen', scope: 'signer rotation', approval: 'needs note', state: 'Review' },
  { delegate: 'Jun Park', scope: 'tenant removal', approval: 'signed', state: 'Ready' }
];

const retries = [
  { id: 'retry-412', packet: 'emergency lease cleanup', reason: 'missing stale token hash', next: 'attach evidence', state: 'Blocked' },
  { id: 'retry-417', packet: 'quarterly certification', reason: 'checksum mismatch', next: 'rerun seal job', state: 'Review' },
  { id: 'retry-421', packet: 'support tenant removal', reason: 'archive receipt late', next: 'poll destination', state: 'Queued' },
  { id: 'retry-428', packet: 'signer rotation', reason: 'review note unclear', next: 'rewrite closeout', state: 'Review' }
];

const destinations = [
  { target: 'GRC evidence vault', lane: 'access-review/quarterly', state: 'Ready', receipt: 'sealed' },
  { target: 'Incident archive', lane: 'secops/lease-cleanup', state: 'Blocked', receipt: 'waiting' },
  { target: 'Audit board packet', lane: 'release/signers', state: 'Review', receipt: 'draft' },
  { target: 'Customer trust archive', lane: 'support/tenant-removal', state: 'Queued', receipt: 'pending' },
  { target: 'Rollback trail index', lane: 'platform/rollback-ledger', state: 'Ready', receipt: 'sealed' }
];

const deliveryTrail = [
  { label: 'Bundle command', value: 'access-review export --sealed --include-trails --receipt-required' },
  { label: 'Gate rule', value: 'sealed packet, owner receipt, reviewer note, destination receipt' },
  { label: 'Rollback proof', value: 'delivery checksum, manifest snapshot, retry exception ledger' }
];

const checklist = [
  'Compare sealed packet coverage against export candidates',
  'Attach missing stale evidence before destination routing',
  'Resolve reviewer blockers or record delegated approval',
  'Retry blocked destinations with receipt polling enabled',
  'Seal rollback-safe delivery trail after every export'
];

function statusClass(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-');
}

export function App() {
  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Access review export readiness</p>
          <h1>Route sealed review packets only when the evidence trail is complete.</h1>
          <p className="lede">
            Inspect access review export readiness, sealed packet coverage, missing evidence,
            reviewer blockers, delegated approvals, retry exceptions, audit destinations, and
            rollback-safe delivery trails.
          </p>
        </div>
        <button type="button">Queue export</button>
      </header>

      <section className="metrics" aria-label="Export readiness summary">
        {metrics.map((metric) => (
          <article className={`metric ${metric.tone}`} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.note}</small>
          </article>
        ))}
      </section>

      <section className="reviewGrid" aria-label="Access review exports">
        {reviews.map((review) => (
          <article className="reviewCard" key={review.title}>
            <div className="cardTop">
              <div>
                <p>{review.owner}</p>
                <h2>{review.title}</h2>
              </div>
              <span className={`chip ${statusClass(review.status)}`}>{review.status}</span>
            </div>
            <p className="summary">{review.detail}</p>
            <div className="facts">
              <span>{review.sealed}</span>
              <span>{review.destination}</span>
            </div>
            <strong className="blocker">{review.blocker}</strong>
            <div className="progress" aria-label={`${review.title} readiness ${review.progress}`}>
              <span style={{ inlineSize: review.progress }} />
            </div>
          </article>
        ))}
      </section>

      <section className="workspace">
        <div className="panel wide">
          <div className="sectionTitle">
            <p>Sealed packet coverage</p>
            <span>manifest comparison</span>
          </div>
          <div className="coverageGrid">
            {coverage.map((item) => (
              <div className="coverage" key={item.item}>
                <div>
                  <strong>{item.item}</strong>
                  <span>{item.ready} ready</span>
                </div>
                <b>{item.total}</b>
                <small className={statusClass(item.state)}>{item.state}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Reviewer blockers</p>
            <span>delivery gates</span>
          </div>
          <div className="blockerList">
            {blockers.map((blocker) => (
              <div className="blockerRow" key={blocker.name}>
                <div>
                  <strong>{blocker.name}</strong>
                  <span>{blocker.owner}</span>
                </div>
                <span>{blocker.age}</span>
                <small className={statusClass(blocker.severity)}>{blocker.severity}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="evidenceGrid">
        <div className="panel">
          <div className="sectionTitle">
            <p>Delegated approvals</p>
            <span>backup owners</span>
          </div>
          <div className="approvalList">
            {approvals.map((approval) => (
              <div className="approval" key={approval.delegate}>
                <div>
                  <strong>{approval.delegate}</strong>
                  <span>{approval.scope}</span>
                </div>
                <span>{approval.approval}</span>
                <small className={statusClass(approval.state)}>{approval.state}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Retry exceptions</p>
            <span>export queue</span>
          </div>
          <div className="retryList">
            {retries.map((retry) => (
              <article className="retry" key={retry.id}>
                <span className={`badge ${statusClass(retry.state)}`}>{retry.state}</span>
                <h3>{retry.id}</h3>
                <p>{retry.packet}</p>
                <strong>{retry.reason}</strong>
                <small>{retry.next}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bottomGrid">
        <div className="panel destinations">
          <div className="sectionTitle">
            <p>Audit destinations</p>
            <span>receipt routing</span>
          </div>
          {destinations.map((destination) => (
            <div className="destinationRow" key={destination.target}>
              <div>
                <strong>{destination.target}</strong>
                <span>{destination.lane}</span>
              </div>
              <span>{destination.receipt}</span>
              <small className={statusClass(destination.state)}>{destination.state}</small>
            </div>
          ))}
        </div>

        <div className="panel delivery">
          <div className="sectionTitle">
            <p>Delivery trail</p>
            <span>rollback-safe export</span>
          </div>
          {deliveryTrail.map((row) => (
            <div className="deliveryRow" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>

        <div className="panel checklist">
          <div className="sectionTitle">
            <p>Closeout checklist</p>
            <span>before delivery</span>
          </div>
          <ol>
            {checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
