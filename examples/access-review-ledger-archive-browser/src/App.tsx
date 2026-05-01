const metrics = [
  { label: 'Archived ledgers', value: '128', note: '44 queried this week', tone: 'info' },
  { label: 'Receipt closeouts', value: '96%', note: 'retention proof present', tone: 'good' },
  { label: 'Hash mismatches', value: '4', note: '2 repair records open', tone: 'danger' },
  { label: 'Export labels', value: '17', note: 'audit destinations indexed', tone: 'warn' }
];

const ledgers = [
  {
    title: 'Quarterly certification closeout',
    owner: 'Identity governance',
    status: 'Archived',
    label: 'grc/q2-access-review',
    retrieval: 'rollback replay ready',
    progress: '98%',
    detail: 'Owner acknowledgements, retry transcript hashes, receipt snapshots, and export labels are retained.'
  },
  {
    title: 'Emergency lease receipt breach',
    owner: 'Security operations',
    status: 'Repair',
    label: 'incident/lease-cleanup',
    retrieval: 'checksum repair pending',
    progress: '71%',
    detail: 'Archive retrieval is available, but one checksum repair record still needs witness proof.'
  },
  {
    title: 'Signer drift evidence packet',
    owner: 'Release engineering',
    status: 'Review',
    label: 'audit-board/signers',
    retrieval: 'reviewer closeout requested',
    progress: '82%',
    detail: 'Retry transcript hash is retained while reviewer closeout evidence waits for final tagging.'
  },
  {
    title: 'Customer trust receipt ledger',
    owner: 'Support platform',
    status: 'Archived',
    label: 'trust/tenant-removal',
    retrieval: 'archive bundle sealed',
    progress: '94%',
    detail: 'Destination receipt, owner acknowledgement, and rollback-safe archive pointer are sealed.'
  }
];

const closeouts = [
  { item: 'vault closeout packet', owner: 'Priya Shah', retained: '7 years', state: 'Archived' },
  { item: 'lease cleanup breach note', owner: 'Dante Moore', retained: 'repair hold', state: 'Repair' },
  { item: 'signer drift closeout', owner: 'Theo Grant', retained: 'review queue', state: 'Review' },
  { item: 'tenant removal receipt', owner: 'Jun Park', retained: '7 years', state: 'Archived' }
];

const acknowledgements = [
  { person: 'Priya Shah', scope: 'quarterly certification', ack: 'signed final ledger', state: 'Archived' },
  { person: 'Dante Moore', scope: 'lease cleanup breach', ack: 'accepted late receipt', state: 'Repair' },
  { person: 'Mira Olsen', scope: 'signer drift witness', ack: 'requested label fix', state: 'Review' },
  { person: 'Jun Park', scope: 'tenant removal archive', ack: 'signed archive bundle', state: 'Archived' }
];

const retryHashes = [
  { id: 'retry-vault-01', hash: 'rty-91bc', ledger: 'quarterly certification', state: 'Matched' },
  { id: 'retry-archive-03', hash: 'rty-81ac', ledger: 'lease cleanup', state: 'Repair' },
  { id: 'retry-board-04', hash: 'rty-pending', ledger: 'signer drift', state: 'Review' },
  { id: 'retry-trust-02', hash: 'rty-62fb', ledger: 'tenant removal', state: 'Matched' }
];

const repairs = [
  { packet: 'lease-cleanup-2026-q2', record: 'repair-771', proof: 'witness pending', state: 'Repair' },
  { packet: 'signer-rotation-fallback', record: 'repair-884', proof: 'label mismatch', state: 'Review' },
  { packet: 'support-removal-east', record: 'repair-806', proof: 'receipt replayed', state: 'Closed' },
  { packet: 'quarterly-certification', record: 'repair-none', proof: 'no drift', state: 'Closed' }
];

const exports = [
  { label: 'grc/q2-access-review', destination: 'GRC evidence vault', retrieval: 'sealed bundle', state: 'Archived' },
  { label: 'incident/lease-cleanup', destination: 'Incident archive', retrieval: 'repair hold', state: 'Repair' },
  { label: 'audit-board/signers', destination: 'Audit board packet', retrieval: 'review queue', state: 'Review' },
  { label: 'trust/tenant-removal', destination: 'Customer trust archive', retrieval: 'sealed bundle', state: 'Archived' }
];

const retrievalRows = [
  { label: 'Archive command', value: 'access-review archive browse --ledger --include-receipts --rollback-pointer' },
  { label: 'Retrieval keys', value: 'export label, owner acknowledgement, retry hash, checksum repair record' },
  { label: 'Rollback bundle', value: 'ledger snapshot, receipt closeout, replay command, audit destination pointer' }
];

const checklist = [
  'Confirm archived ledger matches the export label',
  'Verify retained receipt closeout and owner acknowledgement history',
  'Compare retry transcript hashes before retrieval',
  'Attach checksum repair records to archive results',
  'Return rollback-safe archive bundle with audit pointer'
];

function statusClass(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-');
}

export function App() {
  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Ledger archive browser</p>
          <h1>Find retained review ledgers with the proof needed for audit replay.</h1>
          <p className="lede">
            Inspect archived access review ledgers, retained receipt closeouts, owner acknowledgement
            history, retry transcript hashes, checksum repair records, audit export labels, and
            rollback-safe archive retrieval.
          </p>
        </div>
        <button type="button">Retrieve bundle</button>
      </header>

      <section className="metrics" aria-label="Archive summary">
        {metrics.map((metric) => (
          <article className={`metric ${metric.tone}`} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.note}</small>
          </article>
        ))}
      </section>

      <section className="ledgerGrid" aria-label="Archived ledgers">
        {ledgers.map((ledger) => (
          <article className="ledgerCard" key={ledger.title}>
            <div className="cardTop">
              <div>
                <p>{ledger.owner}</p>
                <h2>{ledger.title}</h2>
              </div>
              <span className={`chip ${statusClass(ledger.status)}`}>{ledger.status}</span>
            </div>
            <p className="summary">{ledger.detail}</p>
            <div className="facts">
              <span>{ledger.label}</span>
              <span>{ledger.retrieval}</span>
            </div>
            <div className="progress" aria-label={`${ledger.title} archive readiness ${ledger.progress}`}>
              <span style={{ inlineSize: ledger.progress }} />
            </div>
          </article>
        ))}
      </section>

      <section className="workspace">
        <div className="panel wide">
          <div className="sectionTitle">
            <p>Retained receipt closeouts</p>
            <span>archive retention</span>
          </div>
          <div className="rowList">
            {closeouts.map((closeout) => (
              <div className="row" key={closeout.item}>
                <div>
                  <strong>{closeout.item}</strong>
                  <span>{closeout.owner}</span>
                </div>
                <span>{closeout.retained}</span>
                <small className={statusClass(closeout.state)}>{closeout.state}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Owner acknowledgement history</p>
            <span>final signatures</span>
          </div>
          <div className="rowList">
            {acknowledgements.map((ack) => (
              <div className="row" key={ack.person}>
                <div>
                  <strong>{ack.person}</strong>
                  <span>{ack.scope}</span>
                </div>
                <span>{ack.ack}</span>
                <small className={statusClass(ack.state)}>{ack.state}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="signalGrid">
        <div className="panel">
          <div className="sectionTitle">
            <p>Retry transcript hashes</p>
            <span>retention index</span>
          </div>
          <div className="hashGrid">
            {retryHashes.map((retry) => (
              <article className="hashCard" key={retry.id}>
                <span className={`badge ${statusClass(retry.state)}`}>{retry.state}</span>
                <h3>{retry.id}</h3>
                <p>{retry.ledger}</p>
                <strong>{retry.hash}</strong>
              </article>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Checksum repair records</p>
            <span>drift proof</span>
          </div>
          <div className="rowList">
            {repairs.map((repair) => (
              <div className="row" key={repair.packet}>
                <div>
                  <strong>{repair.packet}</strong>
                  <span>{repair.record}</span>
                </div>
                <span>{repair.proof}</span>
                <small className={statusClass(repair.state)}>{repair.state}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bottomGrid">
        <div className="panel exports">
          <div className="sectionTitle">
            <p>Audit export labels</p>
            <span>destination index</span>
          </div>
          {exports.map((item) => (
            <div className="exportRow" key={item.label}>
              <div>
                <strong>{item.label}</strong>
                <span>{item.destination}</span>
              </div>
              <span>{item.retrieval}</span>
              <small className={statusClass(item.state)}>{item.state}</small>
            </div>
          ))}
        </div>

        <div className="panel retrieval">
          <div className="sectionTitle">
            <p>Rollback-safe retrieval</p>
            <span>archive bundle</span>
          </div>
          {retrievalRows.map((row) => (
            <div className="retrievalRow" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>

        <div className="panel checklist">
          <div className="sectionTitle">
            <p>Browser checklist</p>
            <span>before export</span>
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
