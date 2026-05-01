const metrics = [
  { label: 'Closed escalations', value: '37', note: '31 sealed in ledger', tone: 'good' },
  { label: 'Owner acks', value: '92%', note: 'final acknowledgements', tone: 'info' },
  { label: 'Breach outcomes', value: '6', note: '2 with late receipts', tone: 'warn' },
  { label: 'Ledger gaps', value: '3', note: 'checksum proof missing', tone: 'danger' }
];

const closeouts = [
  {
    title: 'Incident archive receipt breach',
    owner: 'Security operations',
    status: 'Closed',
    outcome: 'late receipt accepted',
    proof: 'retry transcript retained',
    progress: '92%',
    detail: 'Owner acknowledgement, breach timer outcome, retry transcript, and rollback replay proof are sealed.'
  },
  {
    title: 'Customer trust delivery hold',
    owner: 'Support platform',
    status: 'Sealed',
    outcome: 'destination acknowledged',
    proof: 'reviewer packet sealed',
    progress: '97%',
    detail: 'Final owner acknowledgement and reviewer closeout packet are attached to the audit ledger.'
  },
  {
    title: 'Audit board checksum drift',
    owner: 'Release engineering',
    status: 'Repair',
    outcome: 'checksum repaired',
    proof: 'witness note pending',
    progress: '73%',
    detail: 'Checksum repair proof is present, but the final witness note still needs ledger retention.'
  },
  {
    title: 'GRC vault closeout packet',
    owner: 'Identity governance',
    status: 'Sealed',
    outcome: 'no breach',
    proof: 'ledger hash sealed',
    progress: '99%',
    detail: 'Delivery receipt, owner acknowledgement, closeout note, and rollback ledger hash are complete.'
  }
];

const acknowledgements = [
  { owner: 'Dante Moore', scope: 'incident archive', ack: 'final ack signed', state: 'Closed' },
  { owner: 'Jun Park', scope: 'customer trust archive', ack: 'archive receipt accepted', state: 'Sealed' },
  { owner: 'Mira Olsen', scope: 'checksum witness', ack: 'witness note pending', state: 'Repair' },
  { owner: 'Priya Shah', scope: 'GRC vault packet', ack: 'closed cleanly', state: 'Sealed' }
];

const outcomes = [
  { lane: 'secops/lease-cleanup', timer: '18m breach', result: 'accepted with note', state: 'Late' },
  { lane: 'support/tenant-removal', timer: 'closed before breach', result: 'acknowledged', state: 'Sealed' },
  { lane: 'release/signers', timer: '24m remaining', result: 'checksum repair', state: 'Repair' },
  { lane: 'access-review/quarterly', timer: 'no breach', result: 'sealed', state: 'Sealed' }
];

const transcripts = [
  { id: 'retry-archive-03', retained: 'full transcript', hash: 'rty-81ac', state: 'Retained' },
  { id: 'retry-trust-02', retained: 'bridge note + replay', hash: 'rty-62fb', state: 'Retained' },
  { id: 'retry-board-04', retained: 'hash compare only', hash: 'rty-pending', state: 'Gap' },
  { id: 'retry-vault-01', retained: 'sealed replay', hash: 'rty-91bc', state: 'Retained' }
];

const repairs = [
  { packet: 'lease-cleanup-2026-q2', fix: 'manifest resealed', proof: 'repair-771', state: 'Closed' },
  { packet: 'support-removal-east', fix: 'receipt replayed', proof: 'repair-806', state: 'Sealed' },
  { packet: 'signer-rotation-fallback', fix: 'witness pending', proof: 'repair-draft', state: 'Repair' },
  { packet: 'quarterly-certification', fix: 'no repair needed', proof: 'repair-none', state: 'Sealed' }
];

const packets = [
  { reviewer: 'Nina Patel', packet: 'lease cleanup closeout', contents: 'breach note, owner ack, retry transcript', state: 'Closed' },
  { reviewer: 'Lena Ortiz', packet: 'tenant removal closeout', contents: 'destination receipt, bridge note', state: 'Sealed' },
  { reviewer: 'Theo Grant', packet: 'signer drift closeout', contents: 'checksum proof, witness TODO', state: 'Repair' },
  { reviewer: 'Avery Cho', packet: 'quarterly review closeout', contents: 'receipt, ledger hash, replay command', state: 'Sealed' }
];

const ledgerRows = [
  { label: 'Closeout command', value: 'access-review closeout ledger --sealed --include-retries --rollback-proof' },
  { label: 'Ledger contents', value: 'final owner ack, breach outcome, retry transcript, checksum repair, reviewer packet' },
  { label: 'Audit proof', value: 'sealed ledger hash, receipt snapshot, replay command, rollback evidence pointer' }
];

const checklist = [
  'Confirm final owner acknowledgement is attached',
  'Record breach timer outcome before closing the escalation',
  'Retain retry transcripts with stable hashes',
  'Attach checksum repair proof and reviewer closeout packet',
  'Seal rollback-safe audit ledger after closeout'
];

function statusClass(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-');
}

export function App() {
  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Escalation closeout ledger</p>
          <h1>Seal receipt escalations only after every closeout proof is retained.</h1>
          <p className="lede">
            Inspect closed access review receipt escalations, final owner acknowledgements, breach timer
            outcomes, retry transcript retention, checksum repair proof, reviewer closeout packets, and
            rollback-safe audit ledgers.
          </p>
        </div>
        <button type="button">Seal ledger</button>
      </header>

      <section className="metrics" aria-label="Closeout ledger summary">
        {metrics.map((metric) => (
          <article className={`metric ${metric.tone}`} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.note}</small>
          </article>
        ))}
      </section>

      <section className="closeoutGrid" aria-label="Closed receipt escalations">
        {closeouts.map((closeout) => (
          <article className="closeoutCard" key={closeout.title}>
            <div className="cardTop">
              <div>
                <p>{closeout.owner}</p>
                <h2>{closeout.title}</h2>
              </div>
              <span className={`chip ${statusClass(closeout.status)}`}>{closeout.status}</span>
            </div>
            <p className="summary">{closeout.detail}</p>
            <div className="facts">
              <span>{closeout.outcome}</span>
              <span>{closeout.proof}</span>
            </div>
            <div className="progress" aria-label={`${closeout.title} closeout ${closeout.progress}`}>
              <span style={{ inlineSize: closeout.progress }} />
            </div>
          </article>
        ))}
      </section>

      <section className="workspace">
        <div className="panel wide">
          <div className="sectionTitle">
            <p>Final owner acknowledgements</p>
            <span>signed closeouts</span>
          </div>
          <div className="rowList">
            {acknowledgements.map((ack) => (
              <div className="row" key={ack.owner}>
                <div>
                  <strong>{ack.owner}</strong>
                  <span>{ack.scope}</span>
                </div>
                <span>{ack.ack}</span>
                <small className={statusClass(ack.state)}>{ack.state}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Breach timer outcomes</p>
            <span>audit lane results</span>
          </div>
          <div className="rowList">
            {outcomes.map((outcome) => (
              <div className="row" key={outcome.lane}>
                <div>
                  <strong>{outcome.lane}</strong>
                  <span>{outcome.timer}</span>
                </div>
                <span>{outcome.result}</span>
                <small className={statusClass(outcome.state)}>{outcome.state}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="signalGrid">
        <div className="panel">
          <div className="sectionTitle">
            <p>Retry transcript retention</p>
            <span>stable hashes</span>
          </div>
          <div className="transcriptGrid">
            {transcripts.map((transcript) => (
              <article className="transcript" key={transcript.id}>
                <span className={`badge ${statusClass(transcript.state)}`}>{transcript.state}</span>
                <h3>{transcript.id}</h3>
                <p>{transcript.retained}</p>
                <strong>{transcript.hash}</strong>
              </article>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Checksum repair proof</p>
            <span>packet fixes</span>
          </div>
          <div className="rowList">
            {repairs.map((repair) => (
              <div className="row" key={repair.packet}>
                <div>
                  <strong>{repair.packet}</strong>
                  <span>{repair.fix}</span>
                </div>
                <span>{repair.proof}</span>
                <small className={statusClass(repair.state)}>{repair.state}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bottomGrid">
        <div className="panel packets">
          <div className="sectionTitle">
            <p>Reviewer closeout packets</p>
            <span>retained evidence</span>
          </div>
          {packets.map((packet) => (
            <div className="packetNote" key={`${packet.reviewer}-${packet.packet}`}>
              <div>
                <strong>{packet.reviewer}</strong>
                <span>{packet.packet}</span>
              </div>
              <p>{packet.contents}</p>
              <small className={statusClass(packet.state)}>{packet.state}</small>
            </div>
          ))}
        </div>

        <div className="panel ledger">
          <div className="sectionTitle">
            <p>Rollback-safe audit ledger</p>
            <span>sealed record</span>
          </div>
          {ledgerRows.map((row) => (
            <div className="ledgerRow" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>

        <div className="panel checklist">
          <div className="sectionTitle">
            <p>Closeout checklist</p>
            <span>before archive</span>
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
