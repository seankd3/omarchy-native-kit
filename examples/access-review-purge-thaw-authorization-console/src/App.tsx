const metrics = [
  { label: 'Thaw requests', value: '17', note: '10 ready for authorization', tone: 'info' },
  { label: 'Release attestations', value: '13', note: 'freeze owners matched', tone: 'good' },
  { label: 'Hold clearances', value: '5', note: '2 counsel pending', tone: 'warn' },
  { label: 'Resume packets', value: '9', note: 'rollback-safe and sealed', tone: 'good' }
];

const requests = [
  {
    title: 'Lease purge thaw request',
    owner: 'Security operations',
    status: 'Authorize',
    clearance: 'legal hold thaw clearance pending',
    approval: 'owner resume approval matched',
    progress: '72%',
    detail:
      'Freeze release attestation is accepted, but counsel must clear the incident hold before purge resume.'
  },
  {
    title: 'Q2 certification resume',
    owner: 'Identity governance',
    status: 'Ready',
    clearance: 'hold clearance attached',
    approval: 'governance resume approved',
    progress: '94%',
    detail:
      'Retry hash thaw proof and checksum acceptance unlock are sealed in the purge resume packet.'
  },
  {
    title: 'Signer fallback thaw',
    owner: 'Release engineering',
    status: 'Review',
    clearance: 'checksum unlock partial',
    approval: 'witness resume queued',
    progress: '59%',
    detail:
      'Authorization remains in review until checksum acceptance unlock and witness approval are reconciled.'
  },
  {
    title: 'Tenant export thaw',
    owner: 'Trust support',
    status: 'Ready',
    clearance: 'customer receipt clearance',
    approval: 'support resume approved',
    progress: '91%',
    detail:
      'Freeze release, owner approval, retry thaw proof, and rollback command are ready for purge resume.'
  }
];

const attestations = [
  { item: 'lease freeze release', proof: 'attested by owner', owner: 'Dante Moore', state: 'Authorize' },
  { item: 'q2 certification release', proof: 'attestation matched', owner: 'Priya Shah', state: 'Ready' },
  { item: 'signer fallback release', proof: 'witness pending', owner: 'Mira Olsen', state: 'Review' },
  { item: 'tenant export release', proof: 'attestation matched', owner: 'Jun Park', state: 'Ready' }
];

const clearances = [
  { hold: 'incident lease hold', clearance: 'counsel pending', receipt: 'HC-441', state: 'Authorize' },
  { hold: 'q2 retention check', clearance: 'cleared', receipt: 'HC-218', state: 'Ready' },
  { hold: 'signer witness window', clearance: 'unlock review', receipt: 'HC-903', state: 'Review' },
  { hold: 'tenant export receipt', clearance: 'cleared', receipt: 'HC-117', state: 'Ready' }
];

const approvals = [
  { delegate: 'Dante Moore', scope: 'lease purge resume', approval: 'resume approval matched', state: 'Authorize' },
  { delegate: 'Priya Shah', scope: 'certification resume', approval: 'approved', state: 'Ready' },
  { delegate: 'Mira Olsen', scope: 'signer thaw resume', approval: 'witness queued', state: 'Review' },
  { delegate: 'Jun Park', scope: 'trust export resume', approval: 'approved', state: 'Ready' }
];

const thawProofs = [
  { id: 'thaw-retry-lease-03', proof: 'hash thaw proof held', result: 'awaiting clearance', state: 'Authorize' },
  { id: 'thaw-retry-gov-01', proof: 'hash unlock verified', result: 'ready', state: 'Ready' },
  { id: 'thaw-retry-signers-05', proof: 'witness hash unlock', result: 'reviewing', state: 'Review' },
  { id: 'thaw-retry-trust-02', proof: 'receipt hash unlocked', result: 'ready', state: 'Ready' }
];

const checksumUnlocks = [
  { packet: 'lease-resume-packet', proof: 'acceptance unlock pending', reviewer: 'Counsel desk', state: 'Authorize' },
  { packet: 'q2-resume-packet', proof: 'checksum unlocked', reviewer: 'GRC witness', state: 'Ready' },
  { packet: 'signer-thaw-packet', proof: 'unlock partial', reviewer: 'Release witness', state: 'Review' },
  { packet: 'tenant-resume-packet', proof: 'proof unlocked', reviewer: 'Trust witness', state: 'Ready' }
];

const packetRows = [
  { label: 'Resume command', value: 'access-review archive purge resume --require-thaw-authorization --rollback-packet' },
  { label: 'Authorization exhibits', value: 'thaw request, freeze release attestation, hold clearance, resume approval, thaw proof' },
  { label: 'Rollback guard', value: 'resume manifest, checksum acceptance unlock, retrieval command, purge resume authorization hash' }
];

const checklist = [
  'Review archive purge thaw authorization requests before resume',
  'Match freeze release attestations to the frozen execution',
  'Attach legal hold thaw clearances and owner resume approvals',
  'Verify retry hash thaw proofs and checksum acceptance unlocks',
  'Seal rollback-safe purge resume packets before execution continues'
];

function statusClass(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-');
}

export function App() {
  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Purge thaw authorization console</p>
          <h1>Authorize archive purge resumes only after every thaw control clears.</h1>
          <p className="lede">
            Inspect archive purge thaw authorization requests, freeze release attestations, legal
            hold thaw clearances, delegated owner resume approvals, retry hash thaw proofs, checksum
            acceptance unlocks, and rollback-safe purge resume packets.
          </p>
        </div>
        <button type="button">Authorize resume</button>
      </header>

      <section className="metrics" aria-label="Purge thaw authorization summary">
        {metrics.map((metric) => (
          <article className={`metric ${metric.tone}`} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.note}</small>
          </article>
        ))}
      </section>

      <section className="requestGrid" aria-label="Archive purge thaw requests">
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
              <span>{request.clearance}</span>
              <span>{request.approval}</span>
            </div>
            <div className="progress" aria-label={`${request.title} authorization ${request.progress}`}>
              <span style={{ inlineSize: request.progress }} />
            </div>
          </article>
        ))}
      </section>

      <section className="workspace">
        <div className="panel wide">
          <div className="sectionTitle">
            <p>Freeze release attestations</p>
            <span>release proof</span>
          </div>
          <div className="rowList">
            {attestations.map((attestation) => (
              <div className="row" key={attestation.item}>
                <div>
                  <strong>{attestation.item}</strong>
                  <span>{attestation.proof}</span>
                </div>
                <span>{attestation.owner}</span>
                <small className={statusClass(attestation.state)}>{attestation.state}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Legal hold thaw clearances</p>
            <span>counsel gates</span>
          </div>
          <div className="rowList">
            {clearances.map((hold) => (
              <div className="row" key={hold.hold}>
                <div>
                  <strong>{hold.hold}</strong>
                  <span>{hold.clearance}</span>
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
            <p>Delegated resume approvals</p>
            <span>owner approvals</span>
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
            <p>Retry hash thaw proofs</p>
            <span>unlocked lineage</span>
          </div>
          <div className="hashGrid">
            {thawProofs.map((hash) => (
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
            <p>Checksum acceptance unlocks</p>
            <span>resume proofs</span>
          </div>
          {checksumUnlocks.map((proof) => (
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
            <p>Rollback-safe purge resume packet</p>
            <span>authorization packet</span>
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
            <p>Thaw checklist</p>
            <span>before resume</span>
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
