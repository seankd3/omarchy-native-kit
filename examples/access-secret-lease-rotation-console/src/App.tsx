const metrics = [
  { label: 'Rotations open', value: '13', note: '5 emergency leases active', tone: 'info' },
  { label: 'Cache purges', value: '31', note: '27 confirmed clean', tone: 'good' },
  { label: 'Failed revokes', value: '4', note: '2 blocking closeout', tone: 'danger' },
  { label: 'Packets sealed', value: '84%', note: 'receipts and rollback proof', tone: 'warn' }
];

const rotations = [
  {
    name: 'Payroll database emergency lease',
    owner: 'Finance platform',
    state: 'Clean',
    lease: 'rotates in 14m',
    cache: '3 caches purged',
    services: '2 dependent services',
    progress: '92%',
    detail: 'Lease rotated, cached credentials purged, owner attestation signed, and rollback packet sealed.'
  },
  {
    name: 'Cluster bootstrap token',
    owner: 'Platform SRE',
    state: 'Blocked',
    lease: 'expired 6m ago',
    cache: '1 stale cache',
    services: '4 dependent services',
    progress: '46%',
    detail: 'Revocation failed on a node bootstrap cache; service owner needs to confirm purge before closeout.'
  },
  {
    name: 'Release signing fallback key',
    owner: 'Release engineering',
    state: 'Review',
    lease: 'rotates in 27m',
    cache: 'hash pending',
    services: '1 dependent service',
    progress: '68%',
    detail: 'Fallback key rotated successfully; cleanup receipt is waiting on artifact-signing dry-run output.'
  },
  {
    name: 'Support console recovery secret',
    owner: 'Support operations',
    state: 'Clean',
    lease: 'rotates in 22m',
    cache: 'tenant cache purged',
    services: '3 dependent services',
    progress: '81%',
    detail: 'Emergency secret lease rotated, sandbox access tested, and tenant cleanup receipt attached.'
  }
];

const revocations = [
  { target: 'node-bootstrap-cache-17', scope: 'cluster/bootstrap', owner: 'Platform SRE', state: 'Blocked' },
  { target: 'signing-dry-run-hash', scope: 'release/fallback-key', owner: 'Release engineering', state: 'Review' },
  { target: 'support-tenant-token', scope: 'support/recovery-secret', owner: 'Support operations', state: 'Clean' },
  { target: 'payroll-readonly-cache', scope: 'finance/payroll-db', owner: 'Finance platform', state: 'Clean' }
];

const services = [
  { service: 'Payroll export worker', secret: 'finance/payroll-db', window: '09:00-09:18', readiness: 'Ready' },
  { service: 'Cluster join controller', secret: 'cluster/bootstrap', window: '10:30-11:05', readiness: 'Blocked' },
  { service: 'Artifact signer', secret: 'release/fallback-key', window: '13:00-13:40', readiness: 'Review' },
  { service: 'Support impersonation sandbox', secret: 'support/recovery-secret', window: '15:10-15:32', readiness: 'Ready' }
];

const attestations = [
  { proof: 'Owner attestation', owner: 'Finance platform', receipt: 'signed 8m ago', state: 'Sealed' },
  { proof: 'Cache purge transcript', owner: 'Platform SRE', receipt: 'rerun queued', state: 'Open' },
  { proof: 'Dry-run revoke output', owner: 'Release engineering', receipt: 'under review', state: 'Review' },
  { proof: 'Tenant cleanup receipt', owner: 'Support operations', receipt: 'signed 12m ago', state: 'Sealed' }
];

const timeline = [
  { step: 'Lease inventory snapshot', time: '08:55', status: 'Done' },
  { step: 'Emergency rotation command', time: '09:03', status: 'Done' },
  { step: 'Dependent service restart check', time: '09:11', status: 'Watch' },
  { step: 'Rollback packet seal', time: '09:21', status: 'Queued' }
];

const packet = [
  { label: 'Rotation command', value: 'secret-lease rotate --emergency --seal --dry-run-rollback' },
  { label: 'Cleanup receipts', value: 'cache purge transcript, service restart proof, owner attestation' },
  { label: 'Rollback packet', value: 'previous lease hash, restore dry-run, revocation checksum' }
];

const checklist = [
  'Snapshot active leases and dependent services',
  'Rotate emergency lease with transcript capture',
  'Purge stale token caches and local copies',
  'Collect owner attestation and cleanup receipt',
  'Seal rollback packet with restore dry-run output'
];

function classNameFor(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-');
}

export function App() {
  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Secret lease rotation console</p>
          <h1>Rotate emergency secrets, prove cleanup, and preserve rollback evidence.</h1>
          <p className="lede">
            Inspect emergency secret lease rotations, stale token caches, owner attestations, failed
            revocations, dependent services, cleanup receipts, and rollback-safe rotation packets.
          </p>
        </div>
        <button type="button">Seal rotation</button>
      </header>

      <section className="metrics" aria-label="Secret lease rotation summary">
        {metrics.map((metric) => (
          <article className={`metric ${metric.tone}`} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.note}</small>
          </article>
        ))}
      </section>

      <section className="rotationGrid" aria-label="Emergency secret lease rotations">
        {rotations.map((rotation) => (
          <article className="rotation" key={rotation.name}>
            <div className="cardTop">
              <div>
                <p>{rotation.owner}</p>
                <h2>{rotation.name}</h2>
              </div>
              <span className={`chip ${classNameFor(rotation.state)}`}>{rotation.state}</span>
            </div>
            <p className="summary">{rotation.detail}</p>
            <div className="facts">
              <span>{rotation.lease}</span>
              <span>{rotation.cache}</span>
              <span>{rotation.services}</span>
            </div>
            <div className="progress" aria-label={`${rotation.name} progress ${rotation.progress}`}>
              <span style={{ inlineSize: rotation.progress }} />
            </div>
          </article>
        ))}
      </section>

      <section className="consoleGrid">
        <div className="panel wide">
          <div className="sectionTitle">
            <p>Failed revocations</p>
            <span>repair queue</span>
          </div>
          <div className="revocationList">
            {revocations.map((item) => (
              <div className="row" key={item.target}>
                <div>
                  <strong>{item.target}</strong>
                  <span>{item.scope}</span>
                </div>
                <span>{item.owner}</span>
                <small className={classNameFor(item.state)}>{item.state}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Dependent services</p>
            <span>restart readiness</span>
          </div>
          <div className="serviceList">
            {services.map((item) => (
              <div className="service" key={item.service}>
                <div>
                  <strong>{item.service}</strong>
                  <span>{item.secret}</span>
                </div>
                <span>{item.window}</span>
                <small className={classNameFor(item.readiness)}>{item.readiness}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="evidenceGrid">
        <div className="panel">
          <div className="sectionTitle">
            <p>Cleanup receipts</p>
            <span>owner attestations</span>
          </div>
          <div className="attestationList">
            {attestations.map((item) => (
              <article className="attestation" key={item.proof}>
                <span className={`badge ${classNameFor(item.state)}`}>{item.state}</span>
                <h3>{item.proof}</h3>
                <p>{item.owner}</p>
                <small>{item.receipt}</small>
              </article>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Rotation timeline</p>
            <span>current run</span>
          </div>
          <div className="timeline">
            {timeline.map((item) => (
              <div className="timelineItem" key={item.step}>
                <span>{item.time}</span>
                <strong>{item.step}</strong>
                <small className={classNameFor(item.status)}>{item.status}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bottomGrid">
        <div className="panel packet">
          <div className="sectionTitle">
            <p>Rotation packet</p>
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
