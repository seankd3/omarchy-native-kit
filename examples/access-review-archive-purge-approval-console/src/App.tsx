const metrics = [
  { label: 'Purge requests', value: '26', note: '18 ready for approval', tone: 'info' },
  { label: 'Policy exceptions', value: '8', note: '3 require counsel', tone: 'warn' },
  { label: 'Legal holds', value: '5', note: 'override blocked', tone: 'danger' },
  { label: 'Packets sealed', value: '14', note: 'rollback authorization ready', tone: 'good' }
];

const requests = [
  {
    title: 'Quarterly certification purge',
    owner: 'Identity governance',
    status: 'Ready',
    exception: 'standard expiry window',
    approval: 'delegated owner signed',
    progress: '91%',
    detail: 'Retry hashes, checksum proofs, and export labels are retained before archive purge approval.'
  },
  {
    title: 'Incident lease archive purge',
    owner: 'Security operations',
    status: 'Blocked',
    exception: 'legal hold override requested',
    approval: 'counsel review required',
    progress: '38%',
    detail: 'Legal hold blocks authorization until incident receipt closeouts are released.'
  },
  {
    title: 'Signer drift archive cleanup',
    owner: 'Release engineering',
    status: 'Review',
    exception: 'checksum proof partial',
    approval: 'witness approval queued',
    progress: '67%',
    detail: 'Checksum repair retention is incomplete, so purge authorization remains in review.'
  },
  {
    title: 'Customer trust purge packet',
    owner: 'Support platform',
    status: 'Ready',
    exception: 'customer export retained',
    approval: 'support delegate signed',
    progress: '86%',
    detail: 'Owner acknowledgement history and rollback-safe archive retrieval are sealed in the packet.'
  }
];

const exceptions = [
  { policy: 'governance/q2-2018', reason: 'standard expiry', approver: 'Priya Shah', state: 'Ready' },
  { policy: 'incident/lease-cleanup', reason: 'legal hold override', approver: 'Counsel desk', state: 'Blocked' },
  { policy: 'release/signers-2024', reason: 'checksum witness', approver: 'Mira Olsen', state: 'Review' },
  { policy: 'trust/tenant-removal', reason: 'customer copy retained', approver: 'Jun Park', state: 'Ready' }
];

const holds = [
  { item: 'incident archive receipt', owner: 'Dante Moore', override: 'denied', state: 'Blocked' },
  { item: 'lease cleanup closeout', owner: 'Counsel desk', override: 'pending', state: 'Review' },
  { item: 'customer export copy', owner: 'Jun Park', override: 'not needed', state: 'Ready' },
  { item: 'GRC evidence receipt', owner: 'Priya Shah', override: 'not needed', state: 'Ready' }
];

const approvals = [
  { delegate: 'Priya Shah', scope: 'certification purge', approval: 'signed', state: 'Ready' },
  { delegate: 'Dante Moore', scope: 'incident lease purge', approval: 'blocked by hold', state: 'Blocked' },
  { delegate: 'Mira Olsen', scope: 'signer drift purge', approval: 'witness queued', state: 'Review' },
  { delegate: 'Jun Park', scope: 'trust archive purge', approval: 'signed', state: 'Ready' }
];

const hashes = [
  { id: 'retry-vault-01', hash: 'rty-91bc', preservation: 'retained', state: 'Preserved' },
  { id: 'retry-archive-03', hash: 'rty-81ac', preservation: 'hold locked', state: 'Blocked' },
  { id: 'retry-board-04', hash: 'rty-884a', preservation: 'witness pending', state: 'Review' },
  { id: 'retry-trust-02', hash: 'rty-62fb', preservation: 'retained', state: 'Preserved' }
];

const checksumProofs = [
  { packet: 'quarterly-certification', proof: 'no drift', retention: 'sealed', state: 'Ready' },
  { packet: 'lease-cleanup-2026-q2', proof: 'repair hold', retention: 'blocked', state: 'Blocked' },
  { packet: 'signer-rotation-fallback', proof: 'witness pending', retention: 'review', state: 'Review' },
  { packet: 'support-removal-east', proof: 'receipt replayed', retention: 'sealed', state: 'Ready' }
];

const authorizationRows = [
  { label: 'Authorize command', value: 'access-review archive purge authorize --retain-proof --rollback-packet' },
  { label: 'Approval packet', value: 'policy exception, legal hold check, delegate approval, retry hashes, checksum proof' },
  { label: 'Rollback proof', value: 'purge manifest, retained evidence snapshot, archive retrieval command, authorization hash' }
];

const checklist = [
  'Validate retention policy exception before purge approval',
  'Block legal hold overrides until counsel clears the receipt',
  'Capture delegated owner approval with scope and timestamp',
  'Preserve retry hashes and checksum proof records',
  'Seal rollback-safe purge authorization packet'
];

function statusClass(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-');
}

export function App() {
  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Archive purge approval console</p>
          <h1>Approve archive purges only when every retention proof survives.</h1>
          <p className="lede">
            Inspect access review archive purge approvals, retention policy exceptions, legal hold
            overrides, delegated owner approvals, retry hash preservation, checksum proof retention,
            and rollback-safe purge authorization packets.
          </p>
        </div>
        <button type="button">Authorize purge</button>
      </header>

      <section className="metrics" aria-label="Purge approval summary">
        {metrics.map((metric) => (
          <article className={`metric ${metric.tone}`} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.note}</small>
          </article>
        ))}
      </section>

      <section className="requestGrid" aria-label="Archive purge requests">
        {requests.map((request) => (
          <article className="requestCard" key={request.title}>
            <div className="cardTop">
              <div>
                <p>{request.owner}</p>
                <h2>{request.title}</h2>
              </div>
              <span className={`chip ${statusClass(request.status)}`}>{request.status}</span>
            </div>
            <p className="summary">{request.detail}</p>
            <div className="facts">
              <span>{request.exception}</span>
              <span>{request.approval}</span>
            </div>
            <div className="progress" aria-label={`${request.title} approval ${request.progress}`}>
              <span style={{ inlineSize: request.progress }} />
            </div>
          </article>
        ))}
      </section>

      <section className="workspace">
        <div className="panel wide">
          <div className="sectionTitle">
            <p>Retention policy exceptions</p>
            <span>approval gates</span>
          </div>
          <div className="rowList">
            {exceptions.map((exception) => (
              <div className="row" key={exception.policy}>
                <div>
                  <strong>{exception.policy}</strong>
                  <span>{exception.reason}</span>
                </div>
                <span>{exception.approver}</span>
                <small className={statusClass(exception.state)}>{exception.state}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Legal hold overrides</p>
            <span>counsel controls</span>
          </div>
          <div className="rowList">
            {holds.map((hold) => (
              <div className="row" key={hold.item}>
                <div>
                  <strong>{hold.item}</strong>
                  <span>{hold.owner}</span>
                </div>
                <span>{hold.override}</span>
                <small className={statusClass(hold.state)}>{hold.state}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="signalGrid">
        <div className="panel">
          <div className="sectionTitle">
            <p>Delegated owner approvals</p>
            <span>signatures</span>
          </div>
          <div className="rowList">
            {approvals.map((approval) => (
              <div className="row" key={approval.delegate}>
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
            <p>Retry hash preservation</p>
            <span>proof retained</span>
          </div>
          <div className="hashGrid">
            {hashes.map((hash) => (
              <article className="hashCard" key={hash.id}>
                <span className={`badge ${statusClass(hash.state)}`}>{hash.state}</span>
                <h3>{hash.id}</h3>
                <p>{hash.preservation}</p>
                <strong>{hash.hash}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bottomGrid">
        <div className="panel proofs">
          <div className="sectionTitle">
            <p>Checksum proof retention</p>
            <span>drift evidence</span>
          </div>
          {checksumProofs.map((proof) => (
            <div className="proofRow" key={proof.packet}>
              <div>
                <strong>{proof.packet}</strong>
                <span>{proof.proof}</span>
              </div>
              <span>{proof.retention}</span>
              <small className={statusClass(proof.state)}>{proof.state}</small>
            </div>
          ))}
        </div>

        <div className="panel authorization">
          <div className="sectionTitle">
            <p>Purge authorization packet</p>
            <span>rollback-safe</span>
          </div>
          {authorizationRows.map((row) => (
            <div className="authorizationRow" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>

        <div className="panel checklist">
          <div className="sectionTitle">
            <p>Approval checklist</p>
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
