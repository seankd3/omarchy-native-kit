const metrics = [
  { label: 'Receipts tracked', value: '74', note: '58 sealed for audit', tone: 'info' },
  { label: 'Delegated signoffs', value: '21', note: 'all tied to owner roster', tone: 'good' },
  { label: 'Missing acks', value: '9', note: '4 past reminder window', tone: 'danger' },
  { label: 'Packets sealed', value: '86%', note: 'rollback trails attached', tone: 'warn' }
];

const receipts = [
  {
    title: 'Payroll cache cleanup receipt',
    owner: 'Finance platform',
    status: 'Sealed',
    evidence: 'stale credential purge transcript',
    signoff: 'Rina Shah',
    progress: '94%',
    detail: 'Owner acknowledged cleanup, delegated backup reviewed the purge proof, and audit packet is sealed.'
  },
  {
    title: 'Cluster bootstrap cleanup receipt',
    owner: 'Platform SRE',
    status: 'Missing',
    evidence: 'node credential leftover report',
    signoff: 'Backup pending',
    progress: '38%',
    detail: 'Primary owner missed the acknowledgement window after retry; delegated signoff is now required.'
  },
  {
    title: 'Release signer rollback receipt',
    owner: 'Release engineering',
    status: 'Review',
    evidence: 'dry-run signature hash',
    signoff: 'Iris Chen',
    progress: '71%',
    detail: 'Owner receipt is present, but audit wants the rollback command output sealed with the signer hash.'
  },
  {
    title: 'Support tenant revoke receipt',
    owner: 'Support operations',
    status: 'Sealed',
    evidence: 'tenant token revoke transcript',
    signoff: 'Kai Morgan',
    progress: '88%',
    detail: 'Cleanup receipt, delegated acknowledgement, and tenant revoke proof are ready for audit export.'
  }
];

const acknowledgements = [
  { owner: 'Finance platform', receipt: 'payroll-cache-cleanup', due: 'complete', state: 'Sealed' },
  { owner: 'Platform SRE', receipt: 'cluster-bootstrap-cleanup', due: '18m late', state: 'Missing' },
  { owner: 'Release engineering', receipt: 'release-signer-rollback', due: 'review', state: 'Review' },
  { owner: 'Support operations', receipt: 'support-tenant-revoke', due: 'complete', state: 'Sealed' }
];

const delegated = [
  { delegate: 'Marta Lin', owner: 'Finance platform', scope: 'Payroll emergency cleanup', state: 'Ready' },
  { delegate: 'Noah Kim', owner: 'Platform SRE', scope: 'Bootstrap credential purge', state: 'Queued' },
  { delegate: 'Eli Novak', owner: 'Release engineering', scope: 'Signer rollback evidence', state: 'Review' },
  { delegate: 'Tess Vale', owner: 'Support operations', scope: 'Tenant revoke proof', state: 'Ready' }
];

const retries = [
  { item: 'cluster-bootstrap-cleanup', cause: 'Owner receipt missing after second reminder', fix: 'Escalate to delegated signer', severity: 'Blocker' },
  { item: 'node-leftover-report', cause: 'Stale credential evidence not attached', fix: 'Attach purge transcript hash', severity: 'High' },
  { item: 'release-signer-rollback', cause: 'Rollback output not sealed', fix: 'Rerun dry-run seal command', severity: 'Medium' },
  { item: 'support-token-revoke', cause: 'Audit packet missing reviewer note', fix: 'Attach owner note before export', severity: 'Medium' }
];

const evidence = [
  { artifact: 'Credential purge transcript', source: 'finance/payroll-db', state: 'Sealed', age: '12m ago' },
  { artifact: 'Leftover credential report', source: 'cluster/bootstrap-token', state: 'Open', age: '7m ago' },
  { artifact: 'Rollback dry-run output', source: 'release/signing-fallback', state: 'Review', age: '19m ago' },
  { artifact: 'Tenant revoke transcript', source: 'support/recovery-secret', state: 'Sealed', age: '15m ago' }
];

const packet = [
  { label: 'Audit packet', value: 'owner receipt, delegated signoff, stale credential evidence, retry log' },
  { label: 'Rollback trail', value: 'previous state hash, cleanup dry-run, accountability chain' },
  { label: 'Seal command', value: 'receipt-ledger seal --include-retries --rollback-safe' }
];

const checklist = [
  'Match cleanup receipt to primary owner',
  'Attach stale credential evidence and purge proof',
  'Route missing acknowledgement to delegated signer',
  'Seal retry queue actions into the audit packet',
  'Export rollback-safe accountability trail'
];

function statusClass(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-');
}

export function App() {
  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Owner receipt ledger</p>
          <h1>Track cleanup accountability from owner receipt to sealed audit trail.</h1>
          <p className="lede">
            Inspect access cleanup owner receipts, missing acknowledgements, stale credential evidence,
            delegated signoffs, retry queues, audit packet sealing, and rollback-safe accountability trails.
          </p>
        </div>
        <button type="button">Seal audit packet</button>
      </header>

      <section className="metrics" aria-label="Owner receipt summary">
        {metrics.map((metric) => (
          <article className={`metric ${metric.tone}`} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.note}</small>
          </article>
        ))}
      </section>

      <section className="receiptGrid" aria-label="Owner cleanup receipts">
        {receipts.map((receipt) => (
          <article className="receiptCard" key={receipt.title}>
            <div className="cardTop">
              <div>
                <p>{receipt.owner}</p>
                <h2>{receipt.title}</h2>
              </div>
              <span className={`chip ${statusClass(receipt.status)}`}>{receipt.status}</span>
            </div>
            <p className="summary">{receipt.detail}</p>
            <div className="facts">
              <span>{receipt.evidence}</span>
              <span>{receipt.signoff}</span>
            </div>
            <div className="progress" aria-label={`${receipt.title} progress ${receipt.progress}`}>
              <span style={{ inlineSize: receipt.progress }} />
            </div>
          </article>
        ))}
      </section>

      <section className="workspace">
        <div className="panel wide">
          <div className="sectionTitle">
            <p>Missing acknowledgements</p>
            <span>owner queue</span>
          </div>
          <div className="rowList">
            {acknowledgements.map((ack) => (
              <div className="row" key={ack.receipt}>
                <div>
                  <strong>{ack.owner}</strong>
                  <span>{ack.receipt}</span>
                </div>
                <span>{ack.due}</span>
                <small className={statusClass(ack.state)}>{ack.state}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Delegated signoffs</p>
            <span>backup owners</span>
          </div>
          <div className="delegateList">
            {delegated.map((item) => (
              <div className="delegate" key={item.delegate}>
                <div>
                  <strong>{item.delegate}</strong>
                  <span>{item.owner}</span>
                </div>
                <span>{item.scope}</span>
                <small className={statusClass(item.state)}>{item.state}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="evidenceGrid">
        <div className="panel">
          <div className="sectionTitle">
            <p>Retry queue</p>
            <span>repair actions</span>
          </div>
          <div className="retryGrid">
            {retries.map((retry) => (
              <article className="retry" key={retry.item}>
                <span className={`badge ${statusClass(retry.severity)}`}>{retry.severity}</span>
                <h3>{retry.item}</h3>
                <p>{retry.cause}</p>
                <small>{retry.fix}</small>
              </article>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Stale credential evidence</p>
            <span>audit readiness</span>
          </div>
          <div className="evidenceList">
            {evidence.map((item) => (
              <div className="evidence" key={item.artifact}>
                <div>
                  <strong>{item.artifact}</strong>
                  <span>{item.source}</span>
                </div>
                <span>{item.age}</span>
                <small className={statusClass(item.state)}>{item.state}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bottomGrid">
        <div className="panel packet">
          <div className="sectionTitle">
            <p>Audit packet</p>
            <span>rollback-safe accountability</span>
          </div>
          {packet.map((item) => (
            <div className="packetRow" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>

        <div className="panel checklist">
          <div className="sectionTitle">
            <p>Ledger checklist</p>
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
