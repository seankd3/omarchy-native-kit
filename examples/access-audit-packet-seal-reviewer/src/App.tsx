const metrics = [
  { label: 'Packets reviewed', value: '32', note: '24 sealed for export', tone: 'info' },
  { label: 'Receipts complete', value: '88%', note: 'owner and delegate proof', tone: 'good' },
  { label: 'Retry exceptions', value: '6', note: '2 block packet sealing', tone: 'danger' },
  { label: 'Export ready', value: '19', note: 'rollback trails included', tone: 'warn' }
];

const packets = [
  {
    title: 'Payroll cleanup audit packet',
    owner: 'Finance platform',
    status: 'Sealed',
    completeness: 'Owner receipt, purge transcript, rollback hash',
    reviewer: 'Mina Rao',
    progress: '96%',
    detail: 'All receipts are present, delegated approval is signed, and the rollback trail is sealed.'
  },
  {
    title: 'Cluster bootstrap exception packet',
    owner: 'Platform SRE',
    status: 'Blocked',
    completeness: 'Missing stale access evidence',
    reviewer: 'Owen Pierce',
    progress: '44%',
    detail: 'Retry exception cannot close until the stale credential report is attached and acknowledged.'
  },
  {
    title: 'Release signer rollback packet',
    owner: 'Release engineering',
    status: 'Review',
    completeness: 'Receipt complete, reviewer note pending',
    reviewer: 'Iris Chen',
    progress: '73%',
    detail: 'Reviewer asked for a clearer rollback command note before export readiness is granted.'
  },
  {
    title: 'Support tenant revoke packet',
    owner: 'Support operations',
    status: 'Sealed',
    completeness: 'Receipt, revoke transcript, delegate approval',
    reviewer: 'Kai Morgan',
    progress: '91%',
    detail: 'Tenant revoke evidence and delegated approval are sealed with the accountability trail.'
  }
];

const receipts = [
  { item: 'owner cleanup receipt', source: 'finance/payroll-db', state: 'Complete', age: '12m ago' },
  { item: 'stale access evidence', source: 'cluster/bootstrap-token', state: 'Missing', age: '7m late' },
  { item: 'reviewer rollback note', source: 'release/signing-fallback', state: 'Review', age: '18m ago' },
  { item: 'delegated approval', source: 'support/recovery-secret', state: 'Complete', age: '15m ago' }
];

const approvals = [
  { delegate: 'Marta Lin', packet: 'payroll cleanup', approval: 'signed', state: 'Ready' },
  { delegate: 'Noah Kim', packet: 'cluster bootstrap', approval: 'requested', state: 'Queued' },
  { delegate: 'Eli Novak', packet: 'release signer', approval: 'needs note', state: 'Review' },
  { delegate: 'Tess Vale', packet: 'support revoke', approval: 'signed', state: 'Ready' }
];

const exceptions = [
  { name: 'cluster-bootstrap-stale-proof', cause: 'Evidence hash missing from audit packet', fix: 'Attach leftover credential report', severity: 'Blocker' },
  { name: 'cluster-owner-ack', cause: 'Delegated owner has not acknowledged retry', fix: 'Escalate backup signer', severity: 'High' },
  { name: 'signer-review-note', cause: 'Rollback note lacks command transcript', fix: 'Add dry-run output excerpt', severity: 'Medium' },
  { name: 'support-export-label', cause: 'Export label differs from receipt ledger', fix: 'Normalize audit packet label', severity: 'Medium' }
];

const exports = [
  { target: 'Internal audit vault', contents: '24 sealed packets', state: 'Ready' },
  { target: 'Quarterly access review', contents: '6 packets waiting', state: 'Review' },
  { target: 'Incident evidence archive', contents: '2 blocked exceptions', state: 'Blocked' },
  { target: 'Rollback trail index', contents: '19 trails ready', state: 'Ready' }
];

const sealRows = [
  { label: 'Seal command', value: 'audit-packet seal --include-receipts --rollback-safe' },
  { label: 'Completeness rule', value: 'owner receipt, stale evidence, delegated approval, reviewer note' },
  { label: 'Export bundle', value: 'sealed packet, exception log, rollback trail, accountability checksum' }
];

const checklist = [
  'Verify receipt completeness against packet manifest',
  'Attach stale access evidence and reviewer notes',
  'Resolve retry exceptions or mark delegated approval',
  'Seal rollback-safe accountability trail',
  'Export audit packet with checksum'
];

function statusClass(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-');
}

export function App() {
  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Audit packet seal reviewer</p>
          <h1>Review access evidence, resolve exceptions, and seal audit-ready packets.</h1>
          <p className="lede">
            Inspect audit packet sealing, receipt completeness, stale access evidence, reviewer notes,
            delegated approvals, retry exceptions, export readiness, and rollback-safe accountability trails.
          </p>
        </div>
        <button type="button">Seal selected</button>
      </header>

      <section className="metrics" aria-label="Audit packet summary">
        {metrics.map((metric) => (
          <article className={`metric ${metric.tone}`} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.note}</small>
          </article>
        ))}
      </section>

      <section className="packetGrid" aria-label="Audit packets">
        {packets.map((packet) => (
          <article className="packetCard" key={packet.title}>
            <div className="cardTop">
              <div>
                <p>{packet.owner}</p>
                <h2>{packet.title}</h2>
              </div>
              <span className={`chip ${statusClass(packet.status)}`}>{packet.status}</span>
            </div>
            <p className="summary">{packet.detail}</p>
            <div className="facts">
              <span>{packet.completeness}</span>
              <span>{packet.reviewer}</span>
            </div>
            <div className="progress" aria-label={`${packet.title} progress ${packet.progress}`}>
              <span style={{ inlineSize: packet.progress }} />
            </div>
          </article>
        ))}
      </section>

      <section className="workspace">
        <div className="panel wide">
          <div className="sectionTitle">
            <p>Receipt completeness</p>
            <span>manifest check</span>
          </div>
          <div className="rowList">
            {receipts.map((receipt) => (
              <div className="row" key={receipt.item}>
                <div>
                  <strong>{receipt.item}</strong>
                  <span>{receipt.source}</span>
                </div>
                <span>{receipt.age}</span>
                <small className={statusClass(receipt.state)}>{receipt.state}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Delegated approvals</p>
            <span>backup signoff</span>
          </div>
          <div className="approvalList">
            {approvals.map((approval) => (
              <div className="approval" key={approval.delegate}>
                <div>
                  <strong>{approval.delegate}</strong>
                  <span>{approval.packet}</span>
                </div>
                <span>{approval.approval}</span>
                <small className={statusClass(approval.state)}>{approval.state}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="evidenceGrid">
        <div className="panel">
          <div className="sectionTitle">
            <p>Retry exceptions</p>
            <span>sealing blockers</span>
          </div>
          <div className="exceptionGrid">
            {exceptions.map((exception) => (
              <article className="exception" key={exception.name}>
                <span className={`badge ${statusClass(exception.severity)}`}>{exception.severity}</span>
                <h3>{exception.name}</h3>
                <p>{exception.cause}</p>
                <small>{exception.fix}</small>
              </article>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Export readiness</p>
            <span>destinations</span>
          </div>
          <div className="exportList">
            {exports.map((item) => (
              <div className="exportRow" key={item.target}>
                <div>
                  <strong>{item.target}</strong>
                  <span>{item.contents}</span>
                </div>
                <small className={statusClass(item.state)}>{item.state}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bottomGrid">
        <div className="panel seal">
          <div className="sectionTitle">
            <p>Seal packet</p>
            <span>rollback-safe bundle</span>
          </div>
          {sealRows.map((row) => (
            <div className="sealRow" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>

        <div className="panel checklist">
          <div className="sectionTitle">
            <p>Reviewer checklist</p>
            <span>closeout steps</span>
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
