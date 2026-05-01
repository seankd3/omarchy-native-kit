const metrics = [
  { label: 'Late receipts', value: '14', note: '6 past breach timer', tone: 'danger' },
  { label: 'Owners paged', value: '22', note: '15 acknowledged', tone: 'info' },
  { label: 'Checksums fixed', value: '9', note: '3 drift cases open', tone: 'warn' },
  { label: 'Packets sealed', value: '31', note: 'rollback evidence ready', tone: 'good' }
];

const escalations = [
  {
    title: 'Incident archive receipt breach',
    owner: 'Security operations',
    status: 'Breach',
    timer: '18m overdue',
    channel: 'backup owner page',
    progress: '42%',
    detail: 'Late archive receipt has two failed retries and a stale token checksum mismatch.'
  },
  {
    title: 'Customer trust delivery hold',
    owner: 'Support platform',
    status: 'Escalated',
    timer: '9m to breach',
    channel: 'support lead bridge',
    progress: '68%',
    detail: 'Delegated owner accepted the page, but reviewer closeout evidence is not sealed.'
  },
  {
    title: 'Audit board checksum drift',
    owner: 'Release engineering',
    status: 'Reconciling',
    timer: '24m left',
    channel: 'review desk',
    progress: '76%',
    detail: 'Retry transcript is complete while the delivered checksum waits for witness approval.'
  },
  {
    title: 'GRC vault closeout packet',
    owner: 'Identity governance',
    status: 'Sealed',
    timer: 'closed 6m ago',
    channel: 'primary owner',
    progress: '96%',
    detail: 'Receipt acknowledgement, closeout note, retry transcript, and rollback packet are sealed.'
  }
];

const timers = [
  { lane: 'secops/lease-cleanup', receipt: 'archive-pending-119', breach: '18m overdue', state: 'Breach' },
  { lane: 'support/tenant-removal', receipt: 'trust-late-044', breach: '9m left', state: 'Escalated' },
  { lane: 'release/signers', receipt: 'board-draft-772', breach: '24m left', state: 'Reconciling' },
  { lane: 'access-review/quarterly', receipt: 'vault-ack-2841', breach: 'closed', state: 'Sealed' }
];

const owners = [
  { person: 'Dante Moore', scope: 'incident archive receipt', page: 'sent 4m ago', state: 'Paged' },
  { person: 'Jun Park', scope: 'customer trust archive', page: 'joined bridge', state: 'Acknowledged' },
  { person: 'Mira Olsen', scope: 'checksum witness', page: 'reviewing drift', state: 'Reconciling' },
  { person: 'Priya Shah', scope: 'GRC vault packet', page: 'closed', state: 'Sealed' }
];

const retries = [
  { id: 'retry-archive-03', cause: 'destination receipt timeout', transcript: 'two failed posts, one pending poll', state: 'Breach' },
  { id: 'retry-trust-02', cause: 'reviewer evidence missing', transcript: 'owner accepted escalation', state: 'Escalated' },
  { id: 'retry-board-04', cause: 'checksum witness pending', transcript: 'hash compare attached', state: 'Reconciling' },
  { id: 'retry-vault-01', cause: 'ack lane slow', transcript: 'sealed after replay', state: 'Sealed' }
];

const checksums = [
  { packet: 'lease-cleanup-2026-q2', expected: 'b9c4', observed: 'b9d1', fix: 'rerun manifest seal', state: 'Drift' },
  { packet: 'support-removal-east', expected: 'f144', observed: 'pending', fix: 'wait for receipt', state: 'Missing' },
  { packet: 'signer-rotation-fallback', expected: 'a731', observed: 'a731', fix: 'witness note', state: 'Reconciling' },
  { packet: 'quarterly-certification', expected: '91bc', observed: '91bc', fix: 'sealed', state: 'Matched' }
];

const evidence = [
  { reviewer: 'Nina Patel', packet: 'lease cleanup', closeout: 'late receipt breach, owner paged', state: 'Open' },
  { reviewer: 'Lena Ortiz', packet: 'tenant removal', closeout: 'bridge started, evidence pending', state: 'Escalated' },
  { reviewer: 'Theo Grant', packet: 'signer rotation', closeout: 'checksum witness requested', state: 'Reconciling' },
  { reviewer: 'Avery Cho', packet: 'quarterly review', closeout: 'delivery evidence sealed', state: 'Sealed' }
];

const packetRows = [
  { label: 'Escalation command', value: 'access-review receipts escalate --late --include-retries --seal-rollback' },
  { label: 'Packet contents', value: 'owner page, breach timer, retry transcript, checksum reconciliation, closeout note' },
  { label: 'Rollback proof', value: 'sealed manifest, delivery receipt snapshot, escalation acknowledgement, replay command' }
];

const checklist = [
  'Page delegated owners before the breach timer expires',
  'Attach retry transcripts to every late receipt escalation',
  'Reconcile checksum drift before closing reviewer evidence',
  'Record closeout notes with destination acknowledgement proof',
  'Seal rollback-safe escalation packet after each receipt closure'
];

function statusClass(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-');
}

export function App() {
  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Receipt escalation desk</p>
          <h1>Escalate late review receipts before they become audit delivery gaps.</h1>
          <p className="lede">
            Inspect late access review receipt escalations, delegated owner paging, audit lane breach
            timers, retry transcripts, checksum reconciliation, reviewer closeout evidence, and
            rollback-safe escalation packets.
          </p>
        </div>
        <button type="button">Page owners</button>
      </header>

      <section className="metrics" aria-label="Receipt escalation summary">
        {metrics.map((metric) => (
          <article className={`metric ${metric.tone}`} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.note}</small>
          </article>
        ))}
      </section>

      <section className="escalationGrid" aria-label="Receipt escalations">
        {escalations.map((escalation) => (
          <article className="escalationCard" key={escalation.title}>
            <div className="cardTop">
              <div>
                <p>{escalation.owner}</p>
                <h2>{escalation.title}</h2>
              </div>
              <span className={`chip ${statusClass(escalation.status)}`}>{escalation.status}</span>
            </div>
            <p className="summary">{escalation.detail}</p>
            <div className="facts">
              <span>{escalation.timer}</span>
              <span>{escalation.channel}</span>
            </div>
            <div className="progress" aria-label={`${escalation.title} escalation ${escalation.progress}`}>
              <span style={{ inlineSize: escalation.progress }} />
            </div>
          </article>
        ))}
      </section>

      <section className="workspace">
        <div className="panel wide">
          <div className="sectionTitle">
            <p>Audit lane breach timers</p>
            <span>receipt deadlines</span>
          </div>
          <div className="timerList">
            {timers.map((timer) => (
              <div className="timerRow" key={timer.receipt}>
                <div>
                  <strong>{timer.lane}</strong>
                  <span>{timer.receipt}</span>
                </div>
                <span>{timer.breach}</span>
                <small className={statusClass(timer.state)}>{timer.state}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Delegated owner paging</p>
            <span>acknowledgements</span>
          </div>
          <div className="ownerList">
            {owners.map((owner) => (
              <div className="ownerRow" key={owner.person}>
                <div>
                  <strong>{owner.person}</strong>
                  <span>{owner.scope}</span>
                </div>
                <span>{owner.page}</span>
                <small className={statusClass(owner.state)}>{owner.state}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="signalGrid">
        <div className="panel">
          <div className="sectionTitle">
            <p>Retry transcripts</p>
            <span>failed delivery attempts</span>
          </div>
          <div className="retryGrid">
            {retries.map((retry) => (
              <article className="retry" key={retry.id}>
                <span className={`badge ${statusClass(retry.state)}`}>{retry.state}</span>
                <h3>{retry.id}</h3>
                <p>{retry.cause}</p>
                <strong>{retry.transcript}</strong>
              </article>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Checksum reconciliation</p>
            <span>packet drift</span>
          </div>
          <div className="checksumList">
            {checksums.map((checksum) => (
              <div className="checksum" key={checksum.packet}>
                <div>
                  <strong>{checksum.packet}</strong>
                  <span>expected {checksum.expected}</span>
                </div>
                <span>observed {checksum.observed}</span>
                <span>{checksum.fix}</span>
                <small className={statusClass(checksum.state)}>{checksum.state}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bottomGrid">
        <div className="panel evidence">
          <div className="sectionTitle">
            <p>Reviewer closeout evidence</p>
            <span>notes</span>
          </div>
          {evidence.map((note) => (
            <div className="evidenceNote" key={`${note.reviewer}-${note.packet}`}>
              <div>
                <strong>{note.reviewer}</strong>
                <span>{note.packet}</span>
              </div>
              <p>{note.closeout}</p>
              <small className={statusClass(note.state)}>{note.state}</small>
            </div>
          ))}
        </div>

        <div className="panel packet">
          <div className="sectionTitle">
            <p>Escalation packet</p>
            <span>rollback-safe</span>
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
            <p>Closeout checklist</p>
            <span>seal safely</span>
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
