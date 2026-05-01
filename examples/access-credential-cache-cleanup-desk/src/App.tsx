const metrics = [
  { label: 'Caches tracked', value: '58', note: '16 stale after rotation', tone: 'info' },
  { label: 'Purge progress', value: '73%', note: '42 caches confirmed clean', tone: 'good' },
  { label: 'Failed jobs', value: '7', note: '3 block restart packets', tone: 'danger' },
  { label: 'Receipts sealed', value: '81%', note: 'owner proof attached', tone: 'warn' }
];

const cleanupRuns = [
  {
    cache: 'Payroll worker token cache',
    owner: 'Finance platform',
    status: 'Clean',
    secret: 'finance/payroll-db',
    leftovers: '0 emergency leases',
    progress: '94%',
    detail: 'Worker tokens purged, service probe is clean, and the owner receipt is sealed.'
  },
  {
    cache: 'Cluster bootstrap node cache',
    owner: 'Platform SRE',
    status: 'Blocked',
    secret: 'cluster/bootstrap-token',
    leftovers: '4 lease leftovers',
    progress: '41%',
    detail: 'Two nodes retained stale bootstrap credentials and need a forced purge before restart.'
  },
  {
    cache: 'Release signer fallback cache',
    owner: 'Release engineering',
    status: 'Review',
    secret: 'release/signing-fallback',
    leftovers: '1 hash pending',
    progress: '69%',
    detail: 'Fallback cache purge completed, but rollback evidence is waiting on dry-run signature hash.'
  },
  {
    cache: 'Support sandbox broker cache',
    owner: 'Support operations',
    status: 'Clean',
    secret: 'support/recovery-secret',
    leftovers: '0 tenant tokens',
    progress: '86%',
    detail: 'Sandbox broker cache was purged after emergency use and tenant cleanup proof is attached.'
  }
];

const consumers = [
  { name: 'worker-payroll-03', secret: 'finance/payroll-db', cache: 'Clean', owner: 'Finance platform' },
  { name: 'node-bootstrap-17', secret: 'cluster/bootstrap-token', cache: 'Stale', owner: 'Platform SRE' },
  { name: 'signer-queue-canary', secret: 'release/signing-fallback', cache: 'Review', owner: 'Release engineering' },
  { name: 'support-broker-02', secret: 'support/recovery-secret', cache: 'Clean', owner: 'Support operations' }
];

const failedJobs = [
  { job: 'node-cache-purge-17', impact: 'Stale bootstrap credential survived cleanup', fix: 'Force purge then restart join controller', severity: 'Blocker' },
  { job: 'node-cache-purge-22', impact: 'Owner receipt not acknowledged', fix: 'Escalate to backup service owner', severity: 'High' },
  { job: 'signer-cache-proof', impact: 'Rollback hash missing from cleanup packet', fix: 'Attach dry-run signature output', severity: 'Medium' },
  { job: 'support-token-revoke', impact: 'Tenant revoke receipt delayed', fix: 'Re-run tenant cleanup transcript', severity: 'Medium' }
];

const dependencies = [
  { service: 'Payroll export worker', restart: 'Complete', window: '09:00-09:20', state: 'Ready' },
  { service: 'Cluster join controller', restart: 'Waiting on purge', window: '10:30-11:05', state: 'Blocked' },
  { service: 'Artifact signer queue', restart: 'Proof review', window: '13:00-13:35', state: 'Review' },
  { service: 'Support sandbox broker', restart: 'Complete', window: '15:10-15:28', state: 'Ready' }
];

const receipts = [
  { owner: 'Finance platform', proof: 'Cache purge receipt', state: 'Sealed', age: '11m ago' },
  { owner: 'Platform SRE', proof: 'Emergency lease leftovers', state: 'Open', age: '5m ago' },
  { owner: 'Release engineering', proof: 'Rollback dry-run hash', state: 'Review', age: '19m ago' },
  { owner: 'Support operations', proof: 'Tenant token cleanup', state: 'Sealed', age: '14m ago' }
];

const packet = [
  { label: 'Cleanup command', value: 'credential-cache purge --rotated-secret --verify --seal' },
  { label: 'Owner receipts', value: 'purge transcript, service probe, emergency lease leftover report' },
  { label: 'Rollback proof', value: 'previous credential hash, restore dry-run, restart dependency check' }
];

const checklist = [
  'Inventory stale caches after emergency rotation',
  'Map every secret consumer and service dependency',
  'Purge local tokens and emergency lease leftovers',
  'Collect owner receipt and service health probe',
  'Seal rollback-safe cleanup packet'
];

function statusClass(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-');
}

export function App() {
  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Credential cache cleanup desk</p>
          <h1>Find stale credentials, prove cleanup, and keep restarts rollback-safe.</h1>
          <p className="lede">
            Inspect stale credential caches, secret consumers, emergency lease leftovers, purge progress,
            owner receipts, failed cleanup jobs, service restart dependencies, and rollback-safe cleanup packets.
          </p>
        </div>
        <button type="button">Seal cleanup packet</button>
      </header>

      <section className="metrics" aria-label="Credential cache cleanup summary">
        {metrics.map((metric) => (
          <article className={`metric ${metric.tone}`} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.note}</small>
          </article>
        ))}
      </section>

      <section className="cleanupGrid" aria-label="Credential cache cleanup runs">
        {cleanupRuns.map((run) => (
          <article className="cleanup" key={run.cache}>
            <div className="cardTop">
              <div>
                <p>{run.owner}</p>
                <h2>{run.cache}</h2>
              </div>
              <span className={`chip ${statusClass(run.status)}`}>{run.status}</span>
            </div>
            <p className="summary">{run.detail}</p>
            <div className="facts">
              <span>{run.secret}</span>
              <span>{run.leftovers}</span>
            </div>
            <div className="progress" aria-label={`${run.cache} progress ${run.progress}`}>
              <span style={{ inlineSize: run.progress }} />
            </div>
          </article>
        ))}
      </section>

      <section className="workspace">
        <div className="panel wide">
          <div className="sectionTitle">
            <p>Secret consumers</p>
            <span>cache state</span>
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
            <p>Restart dependencies</p>
            <span>service state</span>
          </div>
          <div className="dependencyList">
            {dependencies.map((dependency) => (
              <div className="dependency" key={dependency.service}>
                <div>
                  <strong>{dependency.service}</strong>
                  <span>{dependency.restart}</span>
                </div>
                <span>{dependency.window}</span>
                <small className={statusClass(dependency.state)}>{dependency.state}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="evidenceGrid">
        <div className="panel">
          <div className="sectionTitle">
            <p>Failed cleanup jobs</p>
            <span>repair queue</span>
          </div>
          <div className="failureGrid">
            {failedJobs.map((job) => (
              <article className="failure" key={job.job}>
                <span className={`badge ${statusClass(job.severity)}`}>{job.severity}</span>
                <h3>{job.job}</h3>
                <p>{job.impact}</p>
                <small>{job.fix}</small>
              </article>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Owner receipts</p>
            <span>cleanup proof</span>
          </div>
          <div className="receiptList">
            {receipts.map((receipt) => (
              <div className="receipt" key={receipt.owner}>
                <div>
                  <strong>{receipt.owner}</strong>
                  <span>{receipt.proof}</span>
                </div>
                <span>{receipt.age}</span>
                <small className={statusClass(receipt.state)}>{receipt.state}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bottomGrid">
        <div className="panel packet">
          <div className="sectionTitle">
            <p>Cleanup packet</p>
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
