const metrics = [
  { label: 'Denied appeals', value: '31', note: '12 awaiting counsel packet', tone: 'danger' },
  { label: 'Disputed exceptions', value: '9', note: 'retention owner conflict', tone: 'warn' },
  { label: 'Hold releases', value: '7', note: '4 evidence-ready', tone: 'info' },
  { label: 'Appeal packets', value: '18', note: 'rollback-safe and sealed', tone: 'good' }
];

const appeals = [
  {
    title: 'Denied lease purge appeal',
    owner: 'Security operations',
    status: 'Disputed',
    dispute: 'legal hold release evidence missing',
    reapproval: 'delegated owner re-approval blocked',
    progress: '42%',
    detail:
      'Counsel challenged the denied archive purge appeal because the incident hold release proof is incomplete.'
  },
  {
    title: 'Certification archive appeal',
    owner: 'Identity governance',
    status: 'Ready',
    dispute: 'retention exception accepted',
    reapproval: 'governance delegate signed',
    progress: '88%',
    detail:
      'Retention exception dispute is settled and retry hash objections are mapped into the rollback packet.'
  },
  {
    title: 'Signer archive dispute',
    owner: 'Release engineering',
    status: 'Review',
    dispute: 'checksum proof objection',
    reapproval: 'witness re-approval queued',
    progress: '63%',
    detail:
      'Checksum proof objections require a second witness before the denied purge appeal can be reversed.'
  },
  {
    title: 'Customer export appeal',
    owner: 'Trust support',
    status: 'Ready',
    dispute: 'customer copy retained',
    reapproval: 'support delegate signed',
    progress: '91%',
    detail:
      'Legal hold release evidence and retained customer export hashes are sealed for appeal approval.'
  }
];

const disputes = [
  { item: 'incident/lease-cleanup', reason: 'hold release evidence', owner: 'Counsel desk', state: 'Disputed' },
  { item: 'governance/q2-expiry', reason: 'exception accepted', owner: 'Priya Shah', state: 'Ready' },
  { item: 'release/signers-2024', reason: 'checksum objection', owner: 'Mira Olsen', state: 'Review' },
  { item: 'trust/export-removal', reason: 'tenant copy retained', owner: 'Jun Park', state: 'Ready' }
];

const holdEvidence = [
  { proof: 'incident receipt release', source: 'legal hold register', age: '18h', state: 'Disputed' },
  { proof: 'counsel release memo', source: 'case file 44-b', age: '4h', state: 'Review' },
  { proof: 'customer export waiver', source: 'trust vault', age: '2h', state: 'Ready' },
  { proof: 'GRC retention release', source: 'policy ledger', age: '1h', state: 'Ready' }
];

const reapprovals = [
  { delegate: 'Dante Moore', scope: 'incident archive appeal', decision: 'blocked', state: 'Disputed' },
  { delegate: 'Priya Shah', scope: 'certification exception', decision: 're-approved', state: 'Ready' },
  { delegate: 'Mira Olsen', scope: 'signer archive appeal', decision: 'witness queued', state: 'Review' },
  { delegate: 'Jun Park', scope: 'trust purge appeal', decision: 're-approved', state: 'Ready' }
];

const hashDisputes = [
  { id: 'retry-lease-03', claim: 'hash not retained', result: 'objection open', state: 'Disputed' },
  { id: 'retry-gov-01', claim: 'hash lineage verified', result: 'accepted', state: 'Resolved' },
  { id: 'retry-signers-05', claim: 'hash replay mismatch', result: 'reviewing', state: 'Review' },
  { id: 'retry-trust-02', claim: 'hash preserved', result: 'accepted', state: 'Resolved' }
];

const checksumObjections = [
  { packet: 'lease-cleanup-appeal', objection: 'repair proof missing', reviewer: 'Counsel desk', state: 'Disputed' },
  { packet: 'q2-certification-expiry', objection: 'proof accepted', reviewer: 'GRC witness', state: 'Ready' },
  { packet: 'signer-fallback-appeal', objection: 'witness mismatch', reviewer: 'Release witness', state: 'Review' },
  { packet: 'support-export-removal', objection: 'proof retained', reviewer: 'Trust witness', state: 'Ready' }
];

const packetRows = [
  { label: 'Appeal command', value: 'access-review archive purge appeal --retain-evidence --rollback-packet' },
  { label: 'Required exhibits', value: 'denial reason, retention dispute, legal hold release, delegate re-approval, hash objection' },
  { label: 'Rollback guard', value: 'sealed appeal manifest, checksum objection record, retrieval command, reauthorization hash' }
];

const checklist = [
  'Attach the denied archive purge reason to the appeal packet',
  'Resolve retention exception disputes before re-approval',
  'Verify legal hold release evidence with counsel ownership',
  'Record retry hash disputes and checksum proof objections',
  'Seal rollback-safe appeal packets before overturning a denial'
];

function statusClass(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-');
}

export function App() {
  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Purge exception appeal board</p>
          <h1>Overturn denied archive purges only when the appeal evidence is complete.</h1>
          <p className="lede">
            Inspect denied archive purge appeals, retention exception disputes, legal hold release
            evidence, delegated owner re-approvals, retry hash disputes, checksum proof objections,
            and rollback-safe appeal packets.
          </p>
        </div>
        <button type="button">Open appeal packet</button>
      </header>

      <section className="metrics" aria-label="Purge appeal summary">
        {metrics.map((metric) => (
          <article className={`metric ${metric.tone}`} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.note}</small>
          </article>
        ))}
      </section>

      <section className="appealGrid" aria-label="Denied purge appeals">
        {appeals.map((appeal) => (
          <article className="appealCard" key={appeal.title}>
            <div className="cardTop">
              <div>
                <p>{appeal.owner}</p>
                <h2>{appeal.title}</h2>
              </div>
              <span className={`chip ${statusClass(appeal.status)}`}>{appeal.status}</span>
            </div>
            <p className="summary">{appeal.detail}</p>
            <div className="facts">
              <span>{appeal.dispute}</span>
              <span>{appeal.reapproval}</span>
            </div>
            <div className="progress" aria-label={`${appeal.title} appeal packet ${appeal.progress}`}>
              <span style={{ inlineSize: appeal.progress }} />
            </div>
          </article>
        ))}
      </section>

      <section className="workspace">
        <div className="panel wide">
          <div className="sectionTitle">
            <p>Retention exception disputes</p>
            <span>appeal grounds</span>
          </div>
          <div className="rowList">
            {disputes.map((dispute) => (
              <div className="row" key={dispute.item}>
                <div>
                  <strong>{dispute.item}</strong>
                  <span>{dispute.reason}</span>
                </div>
                <span>{dispute.owner}</span>
                <small className={statusClass(dispute.state)}>{dispute.state}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Legal hold release evidence</p>
            <span>counsel proof</span>
          </div>
          <div className="rowList">
            {holdEvidence.map((evidence) => (
              <div className="row" key={evidence.proof}>
                <div>
                  <strong>{evidence.proof}</strong>
                  <span>{evidence.source}</span>
                </div>
                <span>{evidence.age}</span>
                <small className={statusClass(evidence.state)}>{evidence.state}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="signalGrid">
        <div className="panel">
          <div className="sectionTitle">
            <p>Delegated owner re-approvals</p>
            <span>appeal signatures</span>
          </div>
          <div className="rowList">
            {reapprovals.map((approval) => (
              <div className="row" key={approval.delegate}>
                <div>
                  <strong>{approval.delegate}</strong>
                  <span>{approval.scope}</span>
                </div>
                <span>{approval.decision}</span>
                <small className={statusClass(approval.state)}>{approval.state}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Retry hash disputes</p>
            <span>lineage claims</span>
          </div>
          <div className="hashGrid">
            {hashDisputes.map((hash) => (
              <article className="hashCard" key={hash.id}>
                <span className={`badge ${statusClass(hash.state)}`}>{hash.state}</span>
                <h3>{hash.id}</h3>
                <p>{hash.claim}</p>
                <strong>{hash.result}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bottomGrid">
        <div className="panel objections">
          <div className="sectionTitle">
            <p>Checksum proof objections</p>
            <span>review record</span>
          </div>
          {checksumObjections.map((objection) => (
            <div className="objectionRow" key={objection.packet}>
              <div>
                <strong>{objection.packet}</strong>
                <span>{objection.objection}</span>
              </div>
              <span>{objection.reviewer}</span>
              <small className={statusClass(objection.state)}>{objection.state}</small>
            </div>
          ))}
        </div>

        <div className="panel packet">
          <div className="sectionTitle">
            <p>Rollback-safe appeal packet</p>
            <span>sealed exhibits</span>
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
            <p>Appeal checklist</p>
            <span>before reversal</span>
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
