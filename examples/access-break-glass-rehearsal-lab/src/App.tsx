const metrics = [
  { label: 'Rehearsals live', value: '8', detail: '3 vault paths under watch', tone: 'info' },
  { label: 'Median grant', value: '6m', detail: 'target under 8 minutes', tone: 'good' },
  { label: 'Failed controls', value: '5', detail: '2 blocking production use', tone: 'danger' },
  { label: 'Reports sealed', value: '91%', detail: 'cleanup proof attached', tone: 'warn' }
];

const rehearsals = [
  {
    title: 'Payroll admin vault recovery',
    owner: 'Finance systems',
    state: 'Passing',
    window: '09:00 - 09:45',
    grant: 'Privileged payroll-admin via sealed vault item',
    progress: '88%',
    detail: 'Responder confirmed emergency role, ran dry-run export, and sealed cleanup evidence.'
  },
  {
    title: 'Kubernetes cluster root break-glass',
    owner: 'Platform SRE',
    state: 'Failed',
    window: '10:15 - 11:00',
    grant: 'Temporary cluster-admin from recovery group',
    progress: '42%',
    detail: 'Vault recovery succeeded, but cleanup script missed a stale kubeconfig binding.'
  },
  {
    title: 'Customer support console bypass',
    owner: 'Support operations',
    state: 'Review',
    window: '12:30 - 13:00',
    grant: 'JIT support-admin with audited impersonation',
    progress: '64%',
    detail: 'Approver response was late; evidence packet is waiting on screen recording hash.'
  },
  {
    title: 'Release signing emergency quorum',
    owner: 'Release engineering',
    state: 'Passing',
    window: '15:00 - 15:40',
    grant: 'Signer quorum with hardware-token fallback',
    progress: '93%',
    detail: 'Fallback approver used recovery token, signed test artifact, and revoked session cleanly.'
  }
];

const simulations = [
  { name: 'Vault item unwrap', scope: 'secret/payroll/break-glass', result: 'Verified', time: '2m 14s' },
  { name: 'Privileged grant activation', scope: 'cluster-admin emergency group', result: 'Needs cleanup', time: '7m 33s' },
  { name: 'Responder identity proof', scope: 'passkey plus hardware token', result: 'Verified', time: '1m 41s' },
  { name: 'Post-grant revocation', scope: 'JIT sessions and cached tokens', result: 'Blocked', time: '11m 05s' }
];

const timing = [
  { lane: 'Duty manager page', target: '3m', observed: '2m 31s', status: 'On target' },
  { lane: 'Approver attestation', target: '5m', observed: '6m 44s', status: 'Late' },
  { lane: 'Vault recovery proof', target: '4m', observed: '3m 08s', status: 'On target' },
  { lane: 'Cleanup confirmation', target: '6m', observed: '9m 12s', status: 'Late' }
];

const failedControls = [
  {
    control: 'Kubeconfig cleanup',
    impact: 'Residual cluster-admin context remained on responder laptop',
    fix: 'Rotate context cache and require cleanup transcript hash',
    severity: 'Blocker'
  },
  {
    control: 'Support screen evidence',
    impact: 'Missing recording checksum for impersonation test',
    fix: 'Move recorder start into rehearsal preflight',
    severity: 'High'
  },
  {
    control: 'Approver fallback roster',
    impact: 'Second backup was stale after team transfer',
    fix: 'Refresh roster from directory owner ledger',
    severity: 'Medium'
  },
  {
    control: 'Vault expiry alarm',
    impact: 'Expiry alert arrived after cleanup window',
    fix: 'Reduce alert threshold to 15 minutes before lease end',
    severity: 'Medium'
  }
];

const vaultEvidence = [
  { artifact: 'Vault unwrap transcript', owner: 'Security engineering', seal: 'SHA-256 sealed', status: 'Ready' },
  { artifact: 'Responder token proof', owner: 'Identity platform', seal: 'Hardware key signed', status: 'Ready' },
  { artifact: 'Cleanup dry-run output', owner: 'Platform SRE', seal: 'Awaiting rerun', status: 'Open' },
  { artifact: 'Rollback rehearsal report', owner: 'Audit liaison', seal: 'Draft locked', status: 'Review' }
];

const cleanupSteps = [
  'Revoke emergency group membership',
  'Rotate vault lease and cached token',
  'Remove local admin context',
  'Attach transcript hash to report',
  'Seal rollback command output'
];

const rollbackReport = [
  { label: 'Rollback command', value: 'revoke-jit --scope emergency --dry-run --seal' },
  { label: 'Evidence bundle', value: 'vault transcript, responder proof, session revoke log' },
  { label: 'Approval trail', value: 'manager page, backup approver receipt, audit signoff' }
];

function stateClass(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-');
}

export function App() {
  return (
    <main className="shell">
      <header className="masthead">
        <div>
          <p className="eyebrow">Break-glass rehearsal lab</p>
          <h1>Practice emergency access before the real outage asks for it.</h1>
          <p className="lede">
            Inspect rehearsal runs, privileged grant simulations, responder timing, vault recovery evidence,
            failed controls, cleanup steps, and rollback-safe rehearsal reports.
          </p>
        </div>
        <button className="primaryAction" type="button">Seal report</button>
      </header>

      <section className="metricGrid" aria-label="Break-glass rehearsal summary">
        {metrics.map((metric) => (
          <article className={`metric ${metric.tone}`} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.detail}</small>
          </article>
        ))}
      </section>

      <section className="rehearsalGrid" aria-label="Active break-glass rehearsals">
        {rehearsals.map((rehearsal) => (
          <article className="rehearsal" key={rehearsal.title}>
            <div className="cardTop">
              <div>
                <p>{rehearsal.owner}</p>
                <h2>{rehearsal.title}</h2>
              </div>
              <span className={`status ${stateClass(rehearsal.state)}`}>{rehearsal.state}</span>
            </div>
            <p className="summary">{rehearsal.detail}</p>
            <dl>
              <div>
                <dt>Window</dt>
                <dd>{rehearsal.window}</dd>
              </div>
              <div>
                <dt>Grant</dt>
                <dd>{rehearsal.grant}</dd>
              </div>
            </dl>
            <div className="progress" aria-label={`${rehearsal.title} progress ${rehearsal.progress}`}>
              <span style={{ inlineSize: rehearsal.progress }} />
            </div>
          </article>
        ))}
      </section>

      <section className="labLayout">
        <div className="panel wide">
          <div className="sectionTitle">
            <p>Privileged grant simulations</p>
            <span>live drill feed</span>
          </div>
          <div className="simulationList">
            {simulations.map((simulation) => (
              <div className="simulation" key={simulation.name}>
                <div>
                  <strong>{simulation.name}</strong>
                  <span>{simulation.scope}</span>
                </div>
                <span className={`status ${stateClass(simulation.result)}`}>{simulation.result}</span>
                <small>{simulation.time}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Responder timing</p>
            <span>target vs observed</span>
          </div>
          <div className="timingList">
            {timing.map((item) => (
              <div className="timing" key={item.lane}>
                <div>
                  <strong>{item.lane}</strong>
                  <span>Target {item.target}</span>
                </div>
                <span>{item.observed}</span>
                <small className={stateClass(item.status)}>{item.status}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="evidenceLayout">
        <div className="panel">
          <div className="sectionTitle">
            <p>Failed controls</p>
            <span>repair queue</span>
          </div>
          <div className="failureList">
            {failedControls.map((item) => (
              <article className="failure" key={item.control}>
                <span className={`severity ${stateClass(item.severity)}`}>{item.severity}</span>
                <h3>{item.control}</h3>
                <p>{item.impact}</p>
                <small>{item.fix}</small>
              </article>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="sectionTitle">
            <p>Vault recovery evidence</p>
            <span>packet readiness</span>
          </div>
          <div className="evidenceList">
            {vaultEvidence.map((item) => (
              <div className="evidence" key={item.artifact}>
                <div>
                  <strong>{item.artifact}</strong>
                  <span>{item.owner}</span>
                </div>
                <span>{item.seal}</span>
                <small className={stateClass(item.status)}>{item.status}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="footerGrid">
        <div className="panel cleanup">
          <div className="sectionTitle">
            <p>Cleanup checklist</p>
            <span>rollback-safe closeout</span>
          </div>
          <ol>
            {cleanupSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="panel report">
          <div className="sectionTitle">
            <p>Rehearsal report</p>
            <span>sealed when complete</span>
          </div>
          {rollbackReport.map((item) => (
            <div className="reportRow" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
