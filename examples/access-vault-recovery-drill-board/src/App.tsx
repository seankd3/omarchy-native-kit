const metrics = [
  { label: 'Vault drills', value: '11', note: '4 in active lease windows', tone: 'info' },
  { label: 'Median unwrap', value: '4m', note: 'target under 6 minutes', tone: 'good' },
  { label: 'Failed unwraps', value: '6', note: '2 require owner review', tone: 'danger' },
  { label: 'Packets sealed', value: '87%', note: 'cleanup attestations attached', tone: 'warn' }
];

const drills = [
  {
    name: 'Payroll root secret recovery',
    owner: 'Finance platform',
    status: 'Healthy',
    lease: '18m remaining',
    identity: 'Passkey plus hardware token',
    evidence: 'Transcript sealed',
    progress: '91%',
    detail: 'Responder recovered the escrowed item, proved identity, rotated the lease, and attached cleanup proof.'
  },
  {
    name: 'Cluster bootstrap vault path',
    owner: 'Platform SRE',
    status: 'Blocked',
    lease: '7m remaining',
    identity: 'Backup approver pending',
    evidence: 'Rerun required',
    progress: '48%',
    detail: 'Second unwrap failed after a stale approver claim; owner signoff is needed before report sealing.'
  },
  {
    name: 'Signing quorum recovery token',
    owner: 'Release engineering',
    status: 'Review',
    lease: '31m remaining',
    identity: 'Two-person proof',
    evidence: 'Hash pending',
    progress: '66%',
    detail: 'Recovery token worked, but the cleanup attestation is waiting for artifact signature verification.'
  },
  {
    name: 'Support console emergency key',
    owner: 'Support operations',
    status: 'Healthy',
    lease: '24m remaining',
    identity: 'Manager page plus passkey',
    evidence: 'Packet ready',
    progress: '83%',
    detail: 'Emergency key was unwrapped, tested against a sandbox tenant, and revoked inside the drill window.'
  }
];

const leaseLanes = [
  { step: 'Escrow lookup', target: '2m', observed: '1m 22s', state: 'On target' },
  { step: 'Identity proof', target: '4m', observed: '3m 49s', state: 'On target' },
  { step: 'Secret lease rotation', target: '5m', observed: '7m 16s', state: 'Late' },
  { step: 'Cleanup attestation', target: '6m', observed: '5m 18s', state: 'On target' }
];

const unwrapFailures = [
  {
    title: 'Expired approver claim',
    path: 'secret/platform/bootstrap',
    owner: 'Platform SRE',
    fix: 'Refresh recovery owner claims from directory source',
    severity: 'Blocker'
  },
  {
    title: 'Missing transcript hash',
    path: 'secret/release/signing-quorum',
    owner: 'Release engineering',
    fix: 'Require hash capture before token test begins',
    severity: 'High'
  },
  {
    title: 'Lease alarm drift',
    path: 'secret/support/emergency-key',
    owner: 'Support operations',
    fix: 'Move alarm threshold to 10 minutes before expiry',
    severity: 'Medium'
  },
  {
    title: 'Cleanup proof mismatch',
    path: 'secret/finance/payroll-root',
    owner: 'Finance platform',
    fix: 'Compare revoke output with escrow inventory',
    severity: 'Medium'
  }
];

const ownership = [
  { group: 'Finance platform', primary: 'Rina Shah', backup: 'Marta Lin', readiness: 'Ready' },
  { group: 'Platform SRE', primary: 'Owen Pierce', backup: 'Noah Kim', readiness: 'Review' },
  { group: 'Release engineering', primary: 'Iris Chen', backup: 'Eli Novak', readiness: 'Ready' },
  { group: 'Support operations', primary: 'Kai Morgan', backup: 'Tess Vale', readiness: 'Ready' }
];

const attestations = [
  { proof: 'Lease revoke output', scope: 'finance/payroll-root', state: 'Sealed', age: '12m ago' },
  { proof: 'Responder identity receipt', scope: 'platform/bootstrap', state: 'Open', age: '8m ago' },
  { proof: 'Artifact signature hash', scope: 'release/signing-quorum', state: 'Review', age: '21m ago' },
  { proof: 'Sandbox tenant cleanup', scope: 'support/emergency-key', state: 'Sealed', age: '16m ago' }
];

const packetRows = [
  { label: 'Recovery transcript', value: 'unwrap log, command transcript, responder terminal hash' },
  { label: 'Identity proof', value: 'passkey assertion, hardware-token receipt, manager page' },
  { label: 'Cleanup proof', value: 'lease revoke output, token cache purge, owner attestation' },
  { label: 'Rollback note', value: 'dry-run restore command with sealed audit checksum' }
];

const runbook = [
  'Confirm recovery owner and backup are current',
  'Start transcript capture before first unwrap',
  'Validate responder identity with two proofs',
  'Rotate lease and revoke cached token',
  'Seal cleanup attestation into evidence packet'
];

function toneClass(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-');
}

export function App() {
  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Vault recovery drill board</p>
          <h1>Prove every emergency secret can be recovered, cleaned up, and sealed.</h1>
          <p className="lede">
            Inspect vault recovery drills, secret lease timing, responder identity proof, failed unwrap
            attempts, cleanup attestations, recovery ownership, and rollback-safe evidence packets.
          </p>
        </div>
        <button type="button">Seal packet</button>
      </header>

      <section className="metrics" aria-label="Vault recovery drill summary">
        {metrics.map((metric) => (
          <article className={`metric ${metric.tone}`} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.note}</small>
          </article>
        ))}
      </section>

      <section className="drillGrid" aria-label="Vault recovery drills">
        {drills.map((drill) => (
          <article className="drill" key={drill.name}>
            <div className="cardHeader">
              <div>
                <p>{drill.owner}</p>
                <h2>{drill.name}</h2>
              </div>
              <span className={`chip ${toneClass(drill.status)}`}>{drill.status}</span>
            </div>
            <p className="summary">{drill.detail}</p>
            <div className="facts">
              <span>{drill.lease}</span>
              <span>{drill.identity}</span>
              <span>{drill.evidence}</span>
            </div>
            <div className="progress" aria-label={`${drill.name} progress ${drill.progress}`}>
              <span style={{ inlineSize: drill.progress }} />
            </div>
          </article>
        ))}
      </section>

      <section className="workbench">
        <div className="panel wide">
          <div className="sectionTitle">
            <p>Secret lease timing</p>
            <span>target vs observed</span>
          </div>
          <div className="laneList">
            {leaseLanes.map((lane) => (
              <div className="lane" key={lane.step}>
                <div>
                  <strong>{lane.step}</strong>
                  <small>Target {lane.target}</small>
                </div>
                <span>{lane.observed}</span>
                <small className={toneClass(lane.state)}>{lane.state}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Recovery ownership</p>
            <span>primary and backup</span>
          </div>
          <div className="ownerList">
            {ownership.map((item) => (
              <div className="owner" key={item.group}>
                <div>
                  <strong>{item.group}</strong>
                  <span>{item.primary} / {item.backup}</span>
                </div>
                <small className={toneClass(item.readiness)}>{item.readiness}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="split">
        <div className="panel">
          <div className="sectionTitle">
            <p>Failed unwrap attempts</p>
            <span>repair queue</span>
          </div>
          <div className="failureGrid">
            {unwrapFailures.map((failure) => (
              <article className="failure" key={failure.title}>
                <span className={`severity ${toneClass(failure.severity)}`}>{failure.severity}</span>
                <h3>{failure.title}</h3>
                <p>{failure.path}</p>
                <small>{failure.owner}: {failure.fix}</small>
              </article>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Cleanup attestations</p>
            <span>evidence readiness</span>
          </div>
          <div className="attestationList">
            {attestations.map((item) => (
              <div className="attestation" key={item.proof}>
                <div>
                  <strong>{item.proof}</strong>
                  <span>{item.scope}</span>
                </div>
                <span>{item.age}</span>
                <small className={toneClass(item.state)}>{item.state}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bottomGrid">
        <div className="panel packet">
          <div className="sectionTitle">
            <p>Evidence packet</p>
            <span>rollback-safe bundle</span>
          </div>
          {packetRows.map((row) => (
            <div className="packetRow" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>

        <div className="panel runbook">
          <div className="sectionTitle">
            <p>Drill runbook</p>
            <span>operator checklist</span>
          </div>
          <ol>
            {runbook.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
