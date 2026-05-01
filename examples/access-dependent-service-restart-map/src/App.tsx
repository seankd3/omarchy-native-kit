const metrics = [
  { label: 'Restart plans', value: '9', note: '4 inside outage windows', tone: 'info' },
  { label: 'Consumers mapped', value: '42', note: 'secret usage graph current', tone: 'good' },
  { label: 'Failed restarts', value: '5', note: '2 block credential closeout', tone: 'danger' },
  { label: 'Packets ready', value: '79%', note: 'cleanup proof attached', tone: 'warn' }
];

const plans = [
  {
    service: 'Payroll export worker',
    owner: 'Finance platform',
    state: 'Ready',
    window: '09:00-09:20',
    secret: 'finance/payroll-db',
    consumers: '7 consumers',
    progress: '88%',
    detail: 'Restart plan confirms rotated database lease, warmed worker pool, and signed cleanup proof.'
  },
  {
    service: 'Cluster join controller',
    owner: 'Platform SRE',
    state: 'Blocked',
    window: '10:30-11:05',
    secret: 'cluster/bootstrap-token',
    consumers: '12 consumers',
    progress: '43%',
    detail: 'Two nodes retained stale bootstrap credentials after restart; rollback packet remains unsealed.'
  },
  {
    service: 'Artifact signer queue',
    owner: 'Release engineering',
    state: 'Review',
    window: '13:00-13:35',
    secret: 'release/signing-fallback',
    consumers: '5 consumers',
    progress: '67%',
    detail: 'Signer restart is complete, but owner acknowledgement is waiting on dry-run artifact hash.'
  },
  {
    service: 'Support sandbox broker',
    owner: 'Support operations',
    state: 'Ready',
    window: '15:10-15:28',
    secret: 'support/recovery-secret',
    consumers: '9 consumers',
    progress: '82%',
    detail: 'Broker restart rotated the emergency credential and attached tenant cleanup receipts.'
  }
];

const consumers = [
  { name: 'worker-payroll-03', secret: 'finance/payroll-db', cache: 'Fresh', owner: 'Finance platform' },
  { name: 'join-controller-a', secret: 'cluster/bootstrap-token', cache: 'Stale', owner: 'Platform SRE' },
  { name: 'signer-queue-canary', secret: 'release/signing-fallback', cache: 'Review', owner: 'Release engineering' },
  { name: 'support-sandbox-broker', secret: 'support/recovery-secret', cache: 'Fresh', owner: 'Support operations' }
];

const failures = [
  { target: 'join-controller-a', cause: 'Stale credential cache survived restart', fix: 'Force cache purge before retry', severity: 'Blocker' },
  { target: 'join-controller-c', cause: 'Owner acknowledgement missing', fix: 'Escalate to backup service owner', severity: 'High' },
  { target: 'signer-queue-canary', cause: 'Dry-run artifact hash not attached', fix: 'Re-run signer smoke test', severity: 'Medium' },
  { target: 'support-broker-02', cause: 'Cleanup receipt delayed', fix: 'Attach tenant revoke transcript', severity: 'Medium' }
];

const windows = [
  { label: 'Finance platform', time: '09:00-09:20', status: 'Ready' },
  { label: 'Platform SRE', time: '10:30-11:05', status: 'Blocked' },
  { label: 'Release engineering', time: '13:00-13:35', status: 'Review' },
  { label: 'Support operations', time: '15:10-15:28', status: 'Ready' }
];

const acknowledgements = [
  { owner: 'Finance platform', proof: 'Owner signed restart plan', state: 'Sealed', age: '9m ago' },
  { owner: 'Platform SRE', proof: 'Backup owner requested', state: 'Open', age: '4m ago' },
  { owner: 'Release engineering', proof: 'Dry-run hash review', state: 'Review', age: '18m ago' },
  { owner: 'Support operations', proof: 'Tenant cleanup accepted', state: 'Sealed', age: '14m ago' }
];

const packet = [
  { label: 'Restart command', value: 'restart-dependent --secret rotated --verify-cache --seal' },
  { label: 'Cleanup proof', value: 'cache purge transcript, service health probe, owner acknowledgement' },
  { label: 'Rollback packet', value: 'previous secret hash, restart dry-run, restored service dependency graph' }
];

const checklist = [
  'Map every service consuming the rotated secret',
  'Confirm outage window and owner acknowledgement',
  'Purge stale credentials before service restart',
  'Attach health probe and cleanup receipt',
  'Seal rollback-safe restart packet'
];

function statusClass(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-');
}

export function App() {
  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Dependent service restart map</p>
          <h1>Restart every access-dependent service with proof, timing, and rollback.</h1>
          <p className="lede">
            Inspect access-dependent service restart plans, secret consumers, stale credentials, outage
            windows, owner acknowledgements, failed restarts, cleanup proof, and rollback-safe restart packets.
          </p>
        </div>
        <button type="button">Seal restart packet</button>
      </header>

      <section className="metrics" aria-label="Restart map summary">
        {metrics.map((metric) => (
          <article className={`metric ${metric.tone}`} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.note}</small>
          </article>
        ))}
      </section>

      <section className="planGrid" aria-label="Restart plans">
        {plans.map((plan) => (
          <article className="plan" key={plan.service}>
            <div className="cardTop">
              <div>
                <p>{plan.owner}</p>
                <h2>{plan.service}</h2>
              </div>
              <span className={`chip ${statusClass(plan.state)}`}>{plan.state}</span>
            </div>
            <p className="summary">{plan.detail}</p>
            <div className="facts">
              <span>{plan.window}</span>
              <span>{plan.secret}</span>
              <span>{plan.consumers}</span>
            </div>
            <div className="progress" aria-label={`${plan.service} progress ${plan.progress}`}>
              <span style={{ inlineSize: plan.progress }} />
            </div>
          </article>
        ))}
      </section>

      <section className="workspace">
        <div className="panel wide">
          <div className="sectionTitle">
            <p>Secret consumers</p>
            <span>cache freshness</span>
          </div>
          <div className="rowList">
            {consumers.map((consumer) => (
              <div className="row" key={consumer.name}>
                <div>
                  <strong>{consumer.name}</strong>
                  <span>{consumer.secret}</span>
                </div>
                <span>{consumer.owner}</span>
                <small className={statusClass(consumer.cache)}>{consumer.cache}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Outage windows</p>
            <span>restart timing</span>
          </div>
          <div className="windowList">
            {windows.map((window) => (
              <div className="windowRow" key={window.label}>
                <div>
                  <strong>{window.label}</strong>
                  <span>{window.time}</span>
                </div>
                <small className={statusClass(window.status)}>{window.status}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="evidenceGrid">
        <div className="panel">
          <div className="sectionTitle">
            <p>Failed restarts</p>
            <span>repair queue</span>
          </div>
          <div className="failureGrid">
            {failures.map((failure) => (
              <article className="failure" key={failure.target}>
                <span className={`badge ${statusClass(failure.severity)}`}>{failure.severity}</span>
                <h3>{failure.target}</h3>
                <p>{failure.cause}</p>
                <small>{failure.fix}</small>
              </article>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Owner acknowledgements</p>
            <span>cleanup proof</span>
          </div>
          <div className="ackList">
            {acknowledgements.map((ack) => (
              <div className="ack" key={ack.owner}>
                <div>
                  <strong>{ack.owner}</strong>
                  <span>{ack.proof}</span>
                </div>
                <span>{ack.age}</span>
                <small className={statusClass(ack.state)}>{ack.state}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bottomGrid">
        <div className="panel packet">
          <div className="sectionTitle">
            <p>Restart packet</p>
            <span>rollback-safe bundle</span>
          </div>
          {packet.map((item) => (
            <div className="packetRow" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>

        <div className="panel checklist">
          <div className="sectionTitle">
            <p>Operator checklist</p>
            <span>closeout steps</span>
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
