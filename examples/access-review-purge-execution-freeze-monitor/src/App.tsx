const metrics = [
  { label: 'Frozen executions', value: '19', note: '7 awaiting thaw review', tone: 'info' },
  { label: 'Packet locks', value: '12', note: 'reconciliation manifests held', tone: 'warn' },
  { label: 'Legal re-freezes', value: '4', note: 'counsel reissued holds', tone: 'danger' },
  { label: 'Thaw packets', value: '8', note: 'rollback-safe and ready', tone: 'good' }
];

const freezes = [
  {
    title: 'Lease reversal purge freeze',
    owner: 'Security operations',
    status: 'Frozen',
    lock: 'reconciliation packet locked',
    acknowledgement: 'delegated owner pause acknowledged',
    progress: '48%',
    detail:
      'Approved archive purge execution is frozen while counsel validates the reissued legal hold window.'
  },
  {
    title: 'Q2 certification thaw review',
    owner: 'Identity governance',
    status: 'Thaw Ready',
    lock: 'outcome packet hash locked',
    acknowledgement: 'governance pause acknowledged',
    progress: '89%',
    detail:
      'Retention settlement and checksum acceptance freeze proofs are complete for rollback-safe thaw review.'
  },
  {
    title: 'Signer fallback pause',
    owner: 'Release engineering',
    status: 'Review',
    lock: 'checksum acceptance freeze',
    acknowledgement: 'witness pause pending',
    progress: '61%',
    detail:
      'Retry hash freeze proof is retained, but checksum acceptance freeze still needs witness confirmation.'
  },
  {
    title: 'Tenant export freeze',
    owner: 'Trust support',
    status: 'Thaw Ready',
    lock: 'customer receipt packet locked',
    acknowledgement: 'support owner pause acknowledged',
    progress: '92%',
    detail:
      'Approved purge remains frozen until the thaw packet seals customer receipt and rollback evidence.'
  }
];

const packetLocks = [
  { packet: 'reconcile/lease-44', lock: 'manifest locked', owner: 'Dante Moore', state: 'Frozen' },
  { packet: 'reconcile/q2-cert', lock: 'hash lock verified', owner: 'Priya Shah', state: 'Thaw Ready' },
  { packet: 'reconcile/signer-05', lock: 'acceptance lock pending', owner: 'Mira Olsen', state: 'Review' },
  { packet: 'reconcile/trust-02', lock: 'receipt lock verified', owner: 'Jun Park', state: 'Thaw Ready' }
];

const legalRefreezes = [
  { hold: 'incident lease hold', reason: 'counsel re-freeze', receipt: 'RF-441', state: 'Frozen' },
  { hold: 'q2 retention check', reason: 'no re-freeze', receipt: 'TR-218', state: 'Thaw Ready' },
  { hold: 'signer witness window', reason: 'acceptance freeze', receipt: 'CF-903', state: 'Review' },
  { hold: 'tenant export receipt', reason: 'no re-freeze', receipt: 'TR-117', state: 'Thaw Ready' }
];

const acknowledgements = [
  { delegate: 'Dante Moore', scope: 'lease purge pause', acknowledgement: 'acknowledged', state: 'Frozen' },
  { delegate: 'Priya Shah', scope: 'certification thaw', acknowledgement: 'acknowledged', state: 'Thaw Ready' },
  { delegate: 'Mira Olsen', scope: 'signer fallback pause', acknowledgement: 'pending witness', state: 'Review' },
  { delegate: 'Jun Park', scope: 'trust export thaw', acknowledgement: 'acknowledged', state: 'Thaw Ready' }
];

const freezeProofs = [
  { id: 'freeze-retry-lease-03', proof: 'retry hash held', result: 'frozen receipt', state: 'Frozen' },
  { id: 'freeze-retry-gov-01', proof: 'hash lock verified', result: 'thaw ready', state: 'Thaw Ready' },
  { id: 'freeze-retry-signers-05', proof: 'witness hash pending', result: 'reviewing', state: 'Review' },
  { id: 'freeze-retry-trust-02', proof: 'receipt hash held', result: 'thaw ready', state: 'Thaw Ready' }
];

const checksumFreezes = [
  { packet: 'lease-freeze-packet', proof: 'checksum acceptance frozen', reviewer: 'Counsel desk', state: 'Frozen' },
  { packet: 'q2-thaw-packet', proof: 'acceptance freeze verified', reviewer: 'GRC witness', state: 'Thaw Ready' },
  { packet: 'signer-freeze-packet', proof: 'acceptance freeze partial', reviewer: 'Release witness', state: 'Review' },
  { packet: 'tenant-thaw-packet', proof: 'proof freeze verified', reviewer: 'Trust witness', state: 'Thaw Ready' }
];

const packetRows = [
  { label: 'Thaw command', value: 'access-review archive purge thaw --require-pause-ack --rollback-packet' },
  { label: 'Frozen exhibits', value: 'execution freeze, reconciliation lock, legal re-freeze receipt, owner pause ack, hash freeze proof' },
  { label: 'Rollback guard', value: 'thaw manifest, checksum acceptance freeze, retrieval command, thaw authorization hash' }
];

const checklist = [
  'Freeze approved archive purge executions before deletion resumes',
  'Lock reconciliation packets and legal hold re-freeze receipts',
  'Capture delegated owner pause acknowledgements',
  'Retain retry hash freeze proofs and checksum acceptance freezes',
  'Seal rollback-safe thaw packets before execution is resumed'
];

function statusClass(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-');
}

export function App() {
  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Purge execution freeze monitor</p>
          <h1>Keep approved archive purges frozen until every thaw proof is sealed.</h1>
          <p className="lede">
            Inspect approved-but-frozen archive purge executions, reconciliation packet locks, legal
            hold re-freezes, delegated owner pause acknowledgements, retry hash freeze proofs,
            checksum acceptance freezes, and rollback-safe thaw packets.
          </p>
        </div>
        <button type="button">Prepare thaw packet</button>
      </header>

      <section className="metrics" aria-label="Purge execution freeze summary">
        {metrics.map((metric) => (
          <article className={`metric ${metric.tone}`} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.note}</small>
          </article>
        ))}
      </section>

      <section className="freezeGrid" aria-label="Approved but frozen purge executions">
        {freezes.map((freeze) => (
          <article className="freezeCard" key={freeze.title}>
            <div className="cardTop">
              <div>
                <p>{freeze.owner}</p>
                <h2>{freeze.title}</h2>
              </div>
              <span className={`chip ${statusClass(freeze.status)}`}>{freeze.status}</span>
            </div>
            <p className="summary">{freeze.detail}</p>
            <div className="facts">
              <span>{freeze.lock}</span>
              <span>{freeze.acknowledgement}</span>
            </div>
            <div className="progress" aria-label={`${freeze.title} thaw readiness ${freeze.progress}`}>
              <span style={{ inlineSize: freeze.progress }} />
            </div>
          </article>
        ))}
      </section>

      <section className="workspace">
        <div className="panel wide">
          <div className="sectionTitle">
            <p>Reconciliation packet locks</p>
            <span>execution holds</span>
          </div>
          <div className="rowList">
            {packetLocks.map((packet) => (
              <div className="row" key={packet.packet}>
                <div>
                  <strong>{packet.packet}</strong>
                  <span>{packet.lock}</span>
                </div>
                <span>{packet.owner}</span>
                <small className={statusClass(packet.state)}>{packet.state}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Legal hold re-freezes</p>
            <span>counsel receipts</span>
          </div>
          <div className="rowList">
            {legalRefreezes.map((hold) => (
              <div className="row" key={hold.hold}>
                <div>
                  <strong>{hold.hold}</strong>
                  <span>{hold.reason}</span>
                </div>
                <span>{hold.receipt}</span>
                <small className={statusClass(hold.state)}>{hold.state}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="signalGrid">
        <div className="panel">
          <div className="sectionTitle">
            <p>Delegated pause acknowledgements</p>
            <span>owner pauses</span>
          </div>
          <div className="rowList">
            {acknowledgements.map((ack) => (
              <div className="row" key={ack.delegate}>
                <div>
                  <strong>{ack.delegate}</strong>
                  <span>{ack.scope}</span>
                </div>
                <span>{ack.acknowledgement}</span>
                <small className={statusClass(ack.state)}>{ack.state}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Retry hash freeze proofs</p>
            <span>frozen lineage</span>
          </div>
          <div className="hashGrid">
            {freezeProofs.map((hash) => (
              <article className="hashCard" key={hash.id}>
                <span className={`badge ${statusClass(hash.state)}`}>{hash.state}</span>
                <h3>{hash.id}</h3>
                <p>{hash.proof}</p>
                <strong>{hash.result}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bottomGrid">
        <div className="panel checksum">
          <div className="sectionTitle">
            <p>Checksum acceptance freezes</p>
            <span>proof holds</span>
          </div>
          {checksumFreezes.map((proof) => (
            <div className="checksumRow" key={proof.packet}>
              <div>
                <strong>{proof.packet}</strong>
                <span>{proof.proof}</span>
              </div>
              <span>{proof.reviewer}</span>
              <small className={statusClass(proof.state)}>{proof.state}</small>
            </div>
          ))}
        </div>

        <div className="panel packet">
          <div className="sectionTitle">
            <p>Rollback-safe thaw packet</p>
            <span>resume controls</span>
          </div>
          {packetRows.map((row) => (
            <div className="packetRow" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>

        <div className="panel checklist">
          <div className="sectionTitle">
            <p>Freeze checklist</p>
            <span>before thaw</span>
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
