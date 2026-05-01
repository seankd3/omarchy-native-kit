const metrics = [
  { label: 'Resumed purges', value: '15', note: '11 under sentinel watch', tone: 'good' },
  { label: 'Authorization drift', value: '4', note: '2 require freezeback', tone: 'warn' },
  { label: 'Hold relapse alerts', value: '3', note: 'counsel review active', tone: 'danger' },
  { label: 'Rollback sentinels', value: '10', note: 'resume guards armed', tone: 'info' }
];

const executions = [
  {
    title: 'Lease purge resume watch',
    owner: 'Security operations',
    status: 'Drift',
    drift: 'thaw authorization scope changed',
    confirmation: 'owner resume confirmation replayed',
    progress: '64%',
    detail:
      'Resumed archive purge execution is drifting from the thaw authorization scope and may need freezeback.'
  },
  {
    title: 'Q2 certification purge',
    owner: 'Identity governance',
    status: 'Guarded',
    drift: 'authorization unchanged',
    confirmation: 'governance resume confirmed',
    progress: '93%',
    detail:
      'Retry hash thaw replay, checksum unlock proof, and rollback sentinel are aligned with the resume packet.'
  },
  {
    title: 'Signer fallback purge',
    owner: 'Release engineering',
    status: 'Review',
    drift: 'checksum unlock drift detected',
    confirmation: 'witness confirmation queued',
    progress: '58%',
    detail:
      'Checksum unlock drift is under review before the resumed purge can continue past the next checkpoint.'
  },
  {
    title: 'Tenant export purge',
    owner: 'Trust support',
    status: 'Guarded',
    drift: 'no relapse alerts',
    confirmation: 'support resume confirmed',
    progress: '89%',
    detail:
      'Legal hold relapse checks and rollback sentinels are armed for the resumed tenant export purge.'
  }
];

const drifts = [
  { item: 'lease thaw authorization', signal: 'scope drift', owner: 'Dante Moore', state: 'Drift' },
  { item: 'q2 certification resume', signal: 'stable', owner: 'Priya Shah', state: 'Guarded' },
  { item: 'signer checksum unlock', signal: 'unlock drift', owner: 'Mira Olsen', state: 'Review' },
  { item: 'tenant export resume', signal: 'stable', owner: 'Jun Park', state: 'Guarded' }
];

const relapseAlerts = [
  { hold: 'incident lease hold', alert: 'relapse review', receipt: 'RA-441', state: 'Drift' },
  { hold: 'q2 retention check', alert: 'clear', receipt: 'RA-218', state: 'Guarded' },
  { hold: 'signer witness window', alert: 'watching unlock', receipt: 'RA-903', state: 'Review' },
  { hold: 'tenant export receipt', alert: 'clear', receipt: 'RA-117', state: 'Guarded' }
];

const confirmations = [
  { delegate: 'Dante Moore', scope: 'lease purge resume', confirmation: 'replayed', state: 'Drift' },
  { delegate: 'Priya Shah', scope: 'certification purge', confirmation: 'confirmed', state: 'Guarded' },
  { delegate: 'Mira Olsen', scope: 'signer resumed purge', confirmation: 'queued', state: 'Review' },
  { delegate: 'Jun Park', scope: 'trust export purge', confirmation: 'confirmed', state: 'Guarded' }
];

const thawReplays = [
  { id: 'replay-retry-lease-03', proof: 'thaw hash replay drift', result: 'freezeback candidate', state: 'Drift' },
  { id: 'replay-retry-gov-01', proof: 'thaw hash replayed', result: 'guarded', state: 'Guarded' },
  { id: 'replay-retry-signers-05', proof: 'unlock replay mismatch', result: 'reviewing', state: 'Review' },
  { id: 'replay-retry-trust-02', proof: 'receipt hash replayed', result: 'guarded', state: 'Guarded' }
];

const checksumDrift = [
  { packet: 'lease-resume-sentinel', proof: 'unlock drift detected', reviewer: 'Counsel desk', state: 'Drift' },
  { packet: 'q2-resume-sentinel', proof: 'unlock stable', reviewer: 'GRC witness', state: 'Guarded' },
  { packet: 'signer-resume-sentinel', proof: 'unlock drift partial', reviewer: 'Release witness', state: 'Review' },
  { packet: 'tenant-resume-sentinel', proof: 'unlock stable', reviewer: 'Trust witness', state: 'Guarded' }
];

const packetRows = [
  { label: 'Sentinel command', value: 'access-review archive purge sentinel --watch-resume --freezeback-packet' },
  { label: 'Watch exhibits', value: 'resume execution, thaw drift, hold relapse alert, owner confirmation, hash replay' },
  { label: 'Rollback guard', value: 'resume sentinel manifest, checksum drift record, retrieval command, freezeback authorization hash' }
];

const checklist = [
  'Watch resumed archive purge executions for thaw authorization drift',
  'Escalate legal hold relapse alerts before deletion continues',
  'Replay delegated owner resume confirmations at each checkpoint',
  'Compare retry hash thaw replay and checksum unlock drift',
  'Keep rollback-safe resume sentinels armed until execution closes'
];

function statusClass(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-');
}

export function App() {
  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Purge resume execution sentinel</p>
          <h1>Watch resumed archive purges for drift before they cross deletion checkpoints.</h1>
          <p className="lede">
            Inspect resumed archive purge executions, thaw authorization drift, legal hold relapse
            alerts, delegated owner resume confirmations, retry hash thaw replay, checksum unlock
            drift, and rollback-safe resume sentinels.
          </p>
        </div>
        <button type="button">Arm sentinel</button>
      </header>

      <section className="metrics" aria-label="Purge resume sentinel summary">
        {metrics.map((metric) => (
          <article className={`metric ${metric.tone}`} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.note}</small>
          </article>
        ))}
      </section>

      <section className="executionGrid" aria-label="Resumed archive purge executions">
        {executions.map((execution) => (
          <article className="executionCard" key={execution.title}>
            <div className="cardTop">
              <div>
                <p>{execution.owner}</p>
                <h2>{execution.title}</h2>
              </div>
              <span className={`chip ${statusClass(execution.status)}`}>{execution.status}</span>
            </div>
            <p className="summary">{execution.detail}</p>
            <div className="facts">
              <span>{execution.drift}</span>
              <span>{execution.confirmation}</span>
            </div>
            <div className="progress" aria-label={`${execution.title} sentinel coverage ${execution.progress}`}>
              <span style={{ inlineSize: execution.progress }} />
            </div>
          </article>
        ))}
      </section>

      <section className="workspace">
        <div className="panel wide">
          <div className="sectionTitle">
            <p>Thaw authorization drift</p>
            <span>resume scope</span>
          </div>
          <div className="rowList">
            {drifts.map((drift) => (
              <div className="row" key={drift.item}>
                <div>
                  <strong>{drift.item}</strong>
                  <span>{drift.signal}</span>
                </div>
                <span>{drift.owner}</span>
                <small className={statusClass(drift.state)}>{drift.state}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Legal hold relapse alerts</p>
            <span>counsel signals</span>
          </div>
          <div className="rowList">
            {relapseAlerts.map((alert) => (
              <div className="row" key={alert.hold}>
                <div>
                  <strong>{alert.hold}</strong>
                  <span>{alert.alert}</span>
                </div>
                <span>{alert.receipt}</span>
                <small className={statusClass(alert.state)}>{alert.state}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="signalGrid">
        <div className="panel">
          <div className="sectionTitle">
            <p>Delegated resume confirmations</p>
            <span>checkpoint replay</span>
          </div>
          <div className="rowList">
            {confirmations.map((confirmation) => (
              <div className="row" key={confirmation.delegate}>
                <div>
                  <strong>{confirmation.delegate}</strong>
                  <span>{confirmation.scope}</span>
                </div>
                <span>{confirmation.confirmation}</span>
                <small className={statusClass(confirmation.state)}>{confirmation.state}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Retry hash thaw replay</p>
            <span>replay proof</span>
          </div>
          <div className="hashGrid">
            {thawReplays.map((hash) => (
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
            <p>Checksum unlock drift</p>
            <span>sentinel proof</span>
          </div>
          {checksumDrift.map((proof) => (
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
            <p>Rollback-safe resume sentinel</p>
            <span>freezeback ready</span>
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
            <p>Sentinel checklist</p>
            <span>during resume</span>
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
