const metrics = [
  { label: 'Policies modeled', value: '12', note: '5 active archive classes', tone: 'info' },
  { label: 'Ledgers expiring', value: '18', note: 'next 90 days', tone: 'warn' },
  { label: 'Closeout holds', value: '7', note: 'receipt evidence locked', tone: 'danger' },
  { label: 'Safe purges', value: '42', note: 'rollback preview ready', tone: 'good' }
];

const policies = [
  {
    title: 'Quarterly certification archive',
    owner: 'Identity governance',
    status: 'Compliant',
    window: '7 year retention',
    preview: '42 ledgers purge-safe',
    progress: '94%',
    detail: 'Owner acknowledgement history, retry hashes, and checksum repairs are retained through policy expiry.'
  },
  {
    title: 'Incident receipt hold policy',
    owner: 'Security operations',
    status: 'Hold',
    window: 'legal hold active',
    preview: 'no purge allowed',
    progress: '52%',
    detail: 'Receipt closeout holds block purge until incident archive acknowledgements are released.'
  },
  {
    title: 'Signer drift repair archive',
    owner: 'Release engineering',
    status: 'Review',
    window: '18 months left',
    preview: 'repair proof partial',
    progress: '73%',
    detail: 'Retry hash preservation is complete, but checksum repair retention needs reviewer confirmation.'
  },
  {
    title: 'Customer trust ledger class',
    owner: 'Support platform',
    status: 'Compliant',
    window: '5 year retention',
    preview: 'archive purge preview clean',
    progress: '89%',
    detail: 'Export labels, closeout receipts, and rollback-safe retrieval pointers are retained.'
  }
];

const windows = [
  { ledger: 'q2-certification-ledger', expires: '2033-06-30', className: 'governance', state: 'Compliant' },
  { ledger: 'lease-cleanup-breach', expires: 'hold', className: 'incident', state: 'Hold' },
  { ledger: 'signer-drift-repair', expires: '2027-11-15', className: 'release', state: 'Review' },
  { ledger: 'tenant-removal-trust', expires: '2031-01-12', className: 'support', state: 'Compliant' }
];

const holds = [
  { item: 'incident archive receipt', owner: 'Dante Moore', reason: 'legal hold', state: 'Hold' },
  { item: 'checksum witness note', owner: 'Mira Olsen', reason: 'repair proof pending', state: 'Review' },
  { item: 'trust archive receipt', owner: 'Jun Park', reason: 'customer request', state: 'Compliant' },
  { item: 'GRC evidence receipt', owner: 'Priya Shah', reason: 'retention class sealed', state: 'Compliant' }
];

const hashes = [
  { id: 'retry-vault-01', hash: 'rty-91bc', preserved: '7 years', state: 'Preserved' },
  { id: 'retry-archive-03', hash: 'rty-81ac', preserved: 'hold locked', state: 'Hold' },
  { id: 'retry-board-04', hash: 'rty-884a', preserved: 'review pending', state: 'Review' },
  { id: 'retry-trust-02', hash: 'rty-62fb', preserved: '5 years', state: 'Preserved' }
];

const repairs = [
  { packet: 'lease-cleanup-2026-q2', record: 'repair-771', retention: 'hold until release', state: 'Hold' },
  { packet: 'signer-rotation-fallback', record: 'repair-884', retention: 'review retention', state: 'Review' },
  { packet: 'support-removal-east', record: 'repair-806', retention: '5 years', state: 'Preserved' },
  { packet: 'quarterly-certification', record: 'repair-none', retention: '7 years', state: 'Preserved' }
];

const purgePreviews = [
  { label: 'governance/q2-2018', impact: '42 ledgers purge-safe', rollback: 'snapshot retained', state: 'Safe' },
  { label: 'incident/lease-cleanup', impact: 'blocked by hold', rollback: 'no purge', state: 'Blocked' },
  { label: 'release/signers-2024', impact: 'checksum proof partial', rollback: 'repair replay', state: 'Review' },
  { label: 'trust/tenant-removal', impact: '9 ledgers purge-safe', rollback: 'receipt bundle retained', state: 'Safe' }
];

const commandRows = [
  { label: 'Preview command', value: 'access-review archive retention preview --include-holds --rollback-plan' },
  { label: 'Policy inputs', value: 'expiry window, receipt hold, owner acknowledgement, retry hash, checksum repair' },
  { label: 'Rollback bundle', value: 'archive snapshot, purge manifest, retained proof, retrieval command' }
];

const checklist = [
  'Compare ledger expiry windows against retention policy',
  'Respect receipt closeout holds before purge preview',
  'Preserve owner acknowledgement history and retry hashes',
  'Retain checksum repair proof for every drift record',
  'Generate rollback-safe archive purge preview'
];

function statusClass(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-');
}

export function App() {
  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Archive retention policy lab</p>
          <h1>Preview archive purges without losing the proof trail.</h1>
          <p className="lede">
            Inspect access review archive retention policies, ledger expiry windows, receipt closeout
            holds, owner acknowledgement history, retry hash preservation, checksum repair retention,
            and rollback-safe archive purge previews.
          </p>
        </div>
        <button type="button">Preview purge</button>
      </header>

      <section className="metrics" aria-label="Retention policy summary">
        {metrics.map((metric) => (
          <article className={`metric ${metric.tone}`} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.note}</small>
          </article>
        ))}
      </section>

      <section className="policyGrid" aria-label="Archive retention policies">
        {policies.map((policy) => (
          <article className="policyCard" key={policy.title}>
            <div className="cardTop">
              <div>
                <p>{policy.owner}</p>
                <h2>{policy.title}</h2>
              </div>
              <span className={`chip ${statusClass(policy.status)}`}>{policy.status}</span>
            </div>
            <p className="summary">{policy.detail}</p>
            <div className="facts">
              <span>{policy.window}</span>
              <span>{policy.preview}</span>
            </div>
            <div className="progress" aria-label={`${policy.title} policy readiness ${policy.progress}`}>
              <span style={{ inlineSize: policy.progress }} />
            </div>
          </article>
        ))}
      </section>

      <section className="workspace">
        <div className="panel wide">
          <div className="sectionTitle">
            <p>Ledger expiry windows</p>
            <span>policy classes</span>
          </div>
          <div className="rowList">
            {windows.map((window) => (
              <div className="row" key={window.ledger}>
                <div>
                  <strong>{window.ledger}</strong>
                  <span>{window.className}</span>
                </div>
                <span>{window.expires}</span>
                <small className={statusClass(window.state)}>{window.state}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Receipt closeout holds</p>
            <span>purge blockers</span>
          </div>
          <div className="rowList">
            {holds.map((hold) => (
              <div className="row" key={hold.item}>
                <div>
                  <strong>{hold.item}</strong>
                  <span>{hold.owner}</span>
                </div>
                <span>{hold.reason}</span>
                <small className={statusClass(hold.state)}>{hold.state}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="signalGrid">
        <div className="panel">
          <div className="sectionTitle">
            <p>Retry hash preservation</p>
            <span>transcript retention</span>
          </div>
          <div className="hashGrid">
            {hashes.map((hash) => (
              <article className="hashCard" key={hash.id}>
                <span className={`badge ${statusClass(hash.state)}`}>{hash.state}</span>
                <h3>{hash.id}</h3>
                <p>{hash.preserved}</p>
                <strong>{hash.hash}</strong>
              </article>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Checksum repair retention</p>
            <span>drift records</span>
          </div>
          <div className="rowList">
            {repairs.map((repair) => (
              <div className="row" key={repair.packet}>
                <div>
                  <strong>{repair.packet}</strong>
                  <span>{repair.record}</span>
                </div>
                <span>{repair.retention}</span>
                <small className={statusClass(repair.state)}>{repair.state}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bottomGrid">
        <div className="panel previews">
          <div className="sectionTitle">
            <p>Purge previews</p>
            <span>rollback impact</span>
          </div>
          {purgePreviews.map((preview) => (
            <div className="previewRow" key={preview.label}>
              <div>
                <strong>{preview.label}</strong>
                <span>{preview.impact}</span>
              </div>
              <span>{preview.rollback}</span>
              <small className={statusClass(preview.state)}>{preview.state}</small>
            </div>
          ))}
        </div>

        <div className="panel command">
          <div className="sectionTitle">
            <p>Rollback-safe purge</p>
            <span>preview command</span>
          </div>
          {commandRows.map((row) => (
            <div className="commandRow" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>

        <div className="panel checklist">
          <div className="sectionTitle">
            <p>Retention checklist</p>
            <span>before purge</span>
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
