const metrics = [
  { label: 'Overturned appeals', value: '22', note: '16 reconciled to ledger', tone: 'good' },
  { label: 'Settlement gaps', value: '6', note: 'retention owners pending', tone: 'warn' },
  { label: 'Release receipts', value: '14', note: '9 counsel accepted', tone: 'info' },
  { label: 'Packets sealed', value: '11', note: 'rollback-safe outcomes', tone: 'good' }
];

const outcomes = [
  {
    title: 'Lease purge reversal',
    owner: 'Security operations',
    status: 'Reconciling',
    settlement: 'legal hold release receipt accepted',
    attestation: 'delegated re-approval matched',
    progress: '74%',
    detail:
      'The denied purge appeal was overturned, and outcome evidence is being reconciled into the archive ledger.'
  },
  {
    title: 'Q2 certification settlement',
    owner: 'Identity governance',
    status: 'Sealed',
    settlement: 'retention dispute settled',
    attestation: 'governance owner attested',
    progress: '96%',
    detail:
      'Retention dispute settlement, checksum acceptance, and rollback manifest are sealed for audit export.'
  },
  {
    title: 'Signer fallback outcome',
    owner: 'Release engineering',
    status: 'Review',
    settlement: 'checksum proof acceptance partial',
    attestation: 'witness attestation queued',
    progress: '58%',
    detail:
      'Retry hash objection outcomes are accepted, but checksum proof acceptance still needs a release witness.'
  },
  {
    title: 'Tenant export reconciliation',
    owner: 'Trust support',
    status: 'Sealed',
    settlement: 'customer copy dispute closed',
    attestation: 'support delegate attested',
    progress: '91%',
    detail:
      'Overturned archive purge appeal is reconciled with customer export receipts and rollback-safe packet proof.'
  }
];

const ledgers = [
  { entry: 'appeal/outcome-lease-44', outcome: 'overturned', owner: 'Dante Moore', state: 'Reconciling' },
  { entry: 'appeal/outcome-q2-cert', outcome: 'settled', owner: 'Priya Shah', state: 'Sealed' },
  { entry: 'appeal/outcome-signer-05', outcome: 'partial acceptance', owner: 'Mira Olsen', state: 'Review' },
  { entry: 'appeal/outcome-trust-02', outcome: 'settled', owner: 'Jun Park', state: 'Sealed' }
];

const settlements = [
  { dispute: 'lease cleanup retention', settlement: 'hold release accepted', receipt: 'LR-441', state: 'Reconciling' },
  { dispute: 'q2 expiry exception', settlement: 'owner settlement signed', receipt: 'RS-218', state: 'Sealed' },
  { dispute: 'signer fallback checksum', settlement: 'witness review open', receipt: 'CP-903', state: 'Review' },
  { dispute: 'tenant export removal', settlement: 'customer waiver attached', receipt: 'TE-117', state: 'Sealed' }
];

const attestations = [
  { delegate: 'Dante Moore', scope: 'lease reversal', attestation: 'matched release receipt', state: 'Reconciling' },
  { delegate: 'Priya Shah', scope: 'certification settlement', attestation: 'attested', state: 'Sealed' },
  { delegate: 'Mira Olsen', scope: 'signer outcome', attestation: 'witness queued', state: 'Review' },
  { delegate: 'Jun Park', scope: 'trust outcome', attestation: 'attested', state: 'Sealed' }
];

const hashOutcomes = [
  { id: 'retry-lease-03', objection: 'lineage restored', outcome: 'accepted with receipt', state: 'Accepted' },
  { id: 'retry-gov-01', objection: 'lineage verified', outcome: 'closed', state: 'Sealed' },
  { id: 'retry-signers-05', objection: 'replay mismatch', outcome: 'witness needed', state: 'Review' },
  { id: 'retry-trust-02', objection: 'hash preserved', outcome: 'closed', state: 'Sealed' }
];

const checksumAcceptance = [
  { packet: 'lease-reversal-packet', proof: 'repair proof accepted', reviewer: 'Counsel desk', state: 'Accepted' },
  { packet: 'q2-certification-packet', proof: 'checksum accepted', reviewer: 'GRC witness', state: 'Sealed' },
  { packet: 'signer-outcome-packet', proof: 'acceptance partial', reviewer: 'Release witness', state: 'Review' },
  { packet: 'tenant-export-packet', proof: 'proof accepted', reviewer: 'Trust witness', state: 'Sealed' }
];

const packetRows = [
  { label: 'Reconcile command', value: 'access-review archive purge appeal reconcile --seal-outcome --rollback-packet' },
  { label: 'Outcome exhibits', value: 'appeal decision, settlement receipt, hold release receipt, delegate attestation, hash outcome' },
  { label: 'Rollback guard', value: 'reconciliation manifest, accepted checksum proof, retrieval command, outcome authorization hash' }
];

const checklist = [
  'Record overturned appeal decision in the outcome ledger',
  'Attach retention dispute settlement and legal hold release receipts',
  'Match delegated re-approval attestations to the final scope',
  'Close retry hash objection outcomes and checksum proof acceptance',
  'Seal rollback-safe reconciliation packets before purge execution'
];

function statusClass(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-');
}

export function App() {
  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Appeal outcome reconciliation desk</p>
          <h1>Reconcile overturned purge appeals before any archive deletion resumes.</h1>
          <p className="lede">
            Inspect overturned archive purge appeals, appeal outcome ledgers, retention dispute
            settlements, legal hold release receipts, delegated re-approval attestations, retry hash
            objection outcomes, checksum proof acceptance, and rollback-safe reconciliation packets.
          </p>
        </div>
        <button type="button">Seal outcome</button>
      </header>

      <section className="metrics" aria-label="Appeal outcome summary">
        {metrics.map((metric) => (
          <article className={`metric ${metric.tone}`} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.note}</small>
          </article>
        ))}
      </section>

      <section className="outcomeGrid" aria-label="Overturned appeal outcomes">
        {outcomes.map((outcome) => (
          <article className="outcomeCard" key={outcome.title}>
            <div className="cardTop">
              <div>
                <p>{outcome.owner}</p>
                <h2>{outcome.title}</h2>
              </div>
              <span className={`chip ${statusClass(outcome.status)}`}>{outcome.status}</span>
            </div>
            <p className="summary">{outcome.detail}</p>
            <div className="facts">
              <span>{outcome.settlement}</span>
              <span>{outcome.attestation}</span>
            </div>
            <div className="progress" aria-label={`${outcome.title} reconciliation ${outcome.progress}`}>
              <span style={{ inlineSize: outcome.progress }} />
            </div>
          </article>
        ))}
      </section>

      <section className="workspace">
        <div className="panel wide">
          <div className="sectionTitle">
            <p>Appeal outcome ledger</p>
            <span>overturn records</span>
          </div>
          <div className="rowList">
            {ledgers.map((ledger) => (
              <div className="row" key={ledger.entry}>
                <div>
                  <strong>{ledger.entry}</strong>
                  <span>{ledger.outcome}</span>
                </div>
                <span>{ledger.owner}</span>
                <small className={statusClass(ledger.state)}>{ledger.state}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Retention dispute settlements</p>
            <span>release receipts</span>
          </div>
          <div className="rowList">
            {settlements.map((settlement) => (
              <div className="row" key={settlement.dispute}>
                <div>
                  <strong>{settlement.dispute}</strong>
                  <span>{settlement.settlement}</span>
                </div>
                <span>{settlement.receipt}</span>
                <small className={statusClass(settlement.state)}>{settlement.state}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="signalGrid">
        <div className="panel">
          <div className="sectionTitle">
            <p>Delegated re-approval attestations</p>
            <span>scope match</span>
          </div>
          <div className="rowList">
            {attestations.map((approval) => (
              <div className="row" key={approval.delegate}>
                <div>
                  <strong>{approval.delegate}</strong>
                  <span>{approval.scope}</span>
                </div>
                <span>{approval.attestation}</span>
                <small className={statusClass(approval.state)}>{approval.state}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Retry hash objection outcomes</p>
            <span>closure state</span>
          </div>
          <div className="hashGrid">
            {hashOutcomes.map((hash) => (
              <article className="hashCard" key={hash.id}>
                <span className={`badge ${statusClass(hash.state)}`}>{hash.state}</span>
                <h3>{hash.id}</h3>
                <p>{hash.objection}</p>
                <strong>{hash.outcome}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bottomGrid">
        <div className="panel acceptance">
          <div className="sectionTitle">
            <p>Checksum proof acceptance</p>
            <span>accepted evidence</span>
          </div>
          {checksumAcceptance.map((proof) => (
            <div className="acceptanceRow" key={proof.packet}>
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
            <p>Rollback-safe reconciliation packet</p>
            <span>sealed outcome</span>
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
            <p>Reconciliation checklist</p>
            <span>before execution</span>
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
