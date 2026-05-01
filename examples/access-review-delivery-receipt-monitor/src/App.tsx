const metrics = [
  { label: 'Receipts tracked', value: '58', note: '44 sealed by destination', tone: 'info' },
  { label: 'Acknowledged', value: '76%', note: 'audit lanes confirmed', tone: 'good' },
  { label: 'Failed retries', value: '9', note: '4 require owner action', tone: 'danger' },
  { label: 'Checksum drift', value: '3', note: 'delivery packet mismatch', tone: 'warn' }
];

const deliveries = [
  {
    title: 'Quarterly access review packet',
    owner: 'Identity governance',
    status: 'Acknowledged',
    destination: 'GRC evidence vault',
    receipt: 'vault-ack-2841',
    progress: '94%',
    detail: 'Destination receipt matches the sealed packet checksum and rollback delivery trail.'
  },
  {
    title: 'Emergency lease cleanup packet',
    owner: 'Security operations',
    status: 'Retrying',
    destination: 'Incident archive',
    receipt: 'archive-pending-119',
    progress: '52%',
    detail: 'Archive acknowledgement failed twice because the stale token evidence label changed after sealing.'
  },
  {
    title: 'Privileged signer rotation packet',
    owner: 'Release engineering',
    status: 'Review',
    destination: 'Audit board bundle',
    receipt: 'board-draft-772',
    progress: '78%',
    detail: 'Reviewer closeout note is attached, but the receipt checksum needs a second verifier.'
  },
  {
    title: 'Support tenant removal packet',
    owner: 'Support platform',
    status: 'Escalated',
    destination: 'Customer trust archive',
    receipt: 'trust-late-044',
    progress: '61%',
    detail: 'Delegated owner escalation is open while the destination acknowledgement remains delayed.'
  }
];

const receipts = [
  { destination: 'GRC evidence vault', lane: 'access-review/quarterly', ack: 'sealed', age: '6m ago', state: 'Acknowledged' },
  { destination: 'Incident archive', lane: 'secops/lease-cleanup', ack: 'retry 3', age: '28m late', state: 'Failed' },
  { destination: 'Audit board bundle', lane: 'release/signers', ack: 'draft', age: '12m ago', state: 'Review' },
  { destination: 'Customer trust archive', lane: 'support/tenant-removal', ack: 'waiting', age: '41m late', state: 'Escalated' }
];

const retries = [
  { id: 'delivery-retry-611', packet: 'lease cleanup', reason: 'evidence label drift', action: 'reconcile manifest', state: 'Failed' },
  { id: 'delivery-retry-618', packet: 'tenant removal', reason: 'destination timeout', action: 'escalate owner', state: 'Escalated' },
  { id: 'delivery-retry-622', packet: 'signer rotation', reason: 'checksum reviewer missing', action: 'request verifier', state: 'Review' },
  { id: 'delivery-retry-625', packet: 'quarterly review', reason: 'receipt poll slow', action: 'watch ack lane', state: 'Queued' }
];

const checksums = [
  { packet: 'lease-cleanup-2026-q2', sealed: 'b9c4', delivered: 'b9d1', state: 'Drift' },
  { packet: 'support-removal-east', sealed: 'f144', delivered: 'pending', state: 'Missing' },
  { packet: 'signer-rotation-fallback', sealed: 'a731', delivered: 'a731', state: 'Matched' },
  { packet: 'quarterly-certification', sealed: '91bc', delivered: '91bc', state: 'Matched' }
];

const notes = [
  { reviewer: 'Avery Cho', packet: 'quarterly review', note: 'delivery trail sealed', state: 'Closed' },
  { reviewer: 'Nina Patel', packet: 'lease cleanup', note: 'label drift blocks receipt', state: 'Open' },
  { reviewer: 'Theo Grant', packet: 'signer rotation', note: 'needs checksum witness', state: 'Review' },
  { reviewer: 'Lena Ortiz', packet: 'tenant removal', note: 'delegated owner paged', state: 'Escalated' }
];

const escalations = [
  { owner: 'Dante Moore', scope: 'incident archive acknowledgement', channel: 'backup owner', state: 'Escalated' },
  { owner: 'Mira Olsen', scope: 'checksum witness', channel: 'review desk', state: 'Review' },
  { owner: 'Jun Park', scope: 'trust archive receipt', channel: 'support lead', state: 'Escalated' },
  { owner: 'Priya Shah', scope: 'vault delivery confirmation', channel: 'primary owner', state: 'Closed' }
];

const evidence = [
  { label: 'Receipt poll command', value: 'access-review receipts poll --include-failed --verify-checksum' },
  { label: 'Escalation gate', value: 'late acknowledgement, failed retry, checksum drift, missing reviewer closeout' },
  { label: 'Rollback evidence', value: 'sealed manifest, destination receipt, retry transcript, owner escalation note' }
];

const checklist = [
  'Match destination acknowledgements to sealed packet manifests',
  'Investigate failed export retries before closing review',
  'Compare delivered checksum against the sealed packet hash',
  'Attach reviewer closeout notes and delegated owner escalations',
  'Seal rollback-safe delivery evidence after receipt confirmation'
];

function statusClass(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-');
}

export function App() {
  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Access review delivery receipts</p>
          <h1>Watch every exported review packet until the destination receipt is sealed.</h1>
          <p className="lede">
            Inspect access review delivery receipts, audit destination acknowledgements, failed export
            retries, reviewer closeout notes, packet checksum drift, delegated owner escalations, and
            rollback-safe delivery evidence.
          </p>
        </div>
        <button type="button">Poll receipts</button>
      </header>

      <section className="metrics" aria-label="Delivery receipt summary">
        {metrics.map((metric) => (
          <article className={`metric ${metric.tone}`} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.note}</small>
          </article>
        ))}
      </section>

      <section className="deliveryGrid" aria-label="Review delivery packets">
        {deliveries.map((delivery) => (
          <article className="deliveryCard" key={delivery.title}>
            <div className="cardTop">
              <div>
                <p>{delivery.owner}</p>
                <h2>{delivery.title}</h2>
              </div>
              <span className={`chip ${statusClass(delivery.status)}`}>{delivery.status}</span>
            </div>
            <p className="summary">{delivery.detail}</p>
            <div className="facts">
              <span>{delivery.destination}</span>
              <span>{delivery.receipt}</span>
            </div>
            <div className="progress" aria-label={`${delivery.title} delivery ${delivery.progress}`}>
              <span style={{ inlineSize: delivery.progress }} />
            </div>
          </article>
        ))}
      </section>

      <section className="workspace">
        <div className="panel wide">
          <div className="sectionTitle">
            <p>Destination acknowledgements</p>
            <span>receipt lanes</span>
          </div>
          <div className="receiptList">
            {receipts.map((receipt) => (
              <div className="receiptRow" key={receipt.destination}>
                <div>
                  <strong>{receipt.destination}</strong>
                  <span>{receipt.lane}</span>
                </div>
                <span>{receipt.ack}</span>
                <span>{receipt.age}</span>
                <small className={statusClass(receipt.state)}>{receipt.state}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Checksum drift</p>
            <span>packet hashes</span>
          </div>
          <div className="checksumList">
            {checksums.map((checksum) => (
              <div className="checksum" key={checksum.packet}>
                <div>
                  <strong>{checksum.packet}</strong>
                  <span>sealed {checksum.sealed}</span>
                </div>
                <span>delivered {checksum.delivered}</span>
                <small className={statusClass(checksum.state)}>{checksum.state}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="signalGrid">
        <div className="panel">
          <div className="sectionTitle">
            <p>Failed export retries</p>
            <span>delivery queue</span>
          </div>
          <div className="retryGrid">
            {retries.map((retry) => (
              <article className="retry" key={retry.id}>
                <span className={`badge ${statusClass(retry.state)}`}>{retry.state}</span>
                <h3>{retry.id}</h3>
                <p>{retry.packet}</p>
                <strong>{retry.reason}</strong>
                <small>{retry.action}</small>
              </article>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Reviewer closeout notes</p>
            <span>evidence text</span>
          </div>
          <div className="noteList">
            {notes.map((note) => (
              <div className="note" key={`${note.reviewer}-${note.packet}`}>
                <div>
                  <strong>{note.reviewer}</strong>
                  <span>{note.packet}</span>
                </div>
                <p>{note.note}</p>
                <small className={statusClass(note.state)}>{note.state}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bottomGrid">
        <div className="panel escalations">
          <div className="sectionTitle">
            <p>Delegated owner escalations</p>
            <span>receipt owners</span>
          </div>
          {escalations.map((escalation) => (
            <div className="escalationRow" key={`${escalation.owner}-${escalation.scope}`}>
              <div>
                <strong>{escalation.owner}</strong>
                <span>{escalation.scope}</span>
              </div>
              <span>{escalation.channel}</span>
              <small className={statusClass(escalation.state)}>{escalation.state}</small>
            </div>
          ))}
        </div>

        <div className="panel evidence">
          <div className="sectionTitle">
            <p>Rollback delivery evidence</p>
            <span>receipt packet</span>
          </div>
          {evidence.map((row) => (
            <div className="evidenceRow" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>

        <div className="panel checklist">
          <div className="sectionTitle">
            <p>Monitor checklist</p>
            <span>close safely</span>
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
