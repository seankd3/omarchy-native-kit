const metrics = [
  { label: 'Drills active', value: '6', detail: '3 high-risk systems' },
  { label: 'Median response', value: '7m', detail: 'target under 10m' },
  { label: 'Failed approvals', value: '4', detail: '2 missing backup coverage' },
  { label: 'Reports sealed', value: '82%', detail: '9 evidence packets complete' }
];

const drills = [
  {
    scenario: 'Finance warehouse break-glass',
    approver: 'Nia Brooks',
    backup: 'Theo Marin',
    grant: 'Revenue analyst emergency role',
    response: '6m 12s',
    coverage: 'Covered',
    evidence: 'Snapshot and approval memo',
    state: 'Passed'
  },
  {
    scenario: 'Support console escalation',
    approver: 'Maya Frost',
    backup: 'Kara Singh',
    grant: 'Support macro repair role',
    response: '14m 08s',
    coverage: 'Partial',
    evidence: 'Missing response receipt',
    state: 'Failed'
  },
  {
    scenario: 'Vendor VPN outage',
    approver: 'Omar Saleh',
    backup: 'Lee Novak',
    grant: 'VPN policy emergency override',
    response: '8m 44s',
    coverage: 'Covered',
    evidence: 'Firewall diff attached',
    state: 'Review'
  },
  {
    scenario: 'Release signing quorum',
    approver: 'Iris Tan',
    backup: 'Owen Grant',
    grant: 'Signing backup vault access',
    response: '5m 31s',
    coverage: 'Covered',
    evidence: 'Quorum drill report sealed',
    state: 'Passed'
  }
];

const failures = [
  { drill: 'Support console escalation', cause: 'Backup approver lacked macro export scope', owner: 'Jon Bell', due: 'Today 17:00', state: 'Open' },
  { drill: 'Vendor VPN outage', cause: 'Firewall evidence attached after response window', owner: 'Marisol Chen', due: 'May 2 10:30', state: 'Review' },
  { drill: 'Privileged role reset', cause: 'Pager rotation sent stale contact', owner: 'Priya Rao', due: 'May 2 14:00', state: 'Queued' },
  { drill: 'Finance warehouse break-glass', cause: 'Report lacks rollback checksum', owner: 'Rina Patel', due: 'May 3 09:00', state: 'Watching' }
];

const responseLanes = [
  { lane: 'Pager acknowledgement', target: '2m', actual: '1m 46s', status: 'On target' },
  { lane: 'Simulated grant approval', target: '5m', actual: '4m 58s', status: 'On target' },
  { lane: 'Rollback command proof', target: '8m', actual: '9m 12s', status: 'Late' },
  { lane: 'Evidence packet seal', target: '12m', actual: '11m 40s', status: 'On target' }
];

const coverage = [
  { group: 'Finance analytics', primary: 'Nia Brooks', backup: 'Theo Marin', readiness: 'Ready' },
  { group: 'Support operations', primary: 'Maya Frost', backup: 'Kara Singh', readiness: 'Partial' },
  { group: 'Network security', primary: 'Omar Saleh', backup: 'Lee Novak', readiness: 'Ready' },
  { group: 'Release engineering', primary: 'Iris Tan', backup: 'Owen Grant', readiness: 'Ready' }
];

const evidence = [
  { packet: 'Simulated grant transcript', coverage: '6/6', note: 'All grant attempts recorded' },
  { packet: 'Approver response receipt', coverage: '4/6', note: 'Two receipts missing from support drill' },
  { packet: 'Rollback dry-run output', coverage: '5/6', note: 'One checksum pending' },
  { packet: 'Final drill report', coverage: '9/11', note: 'Two reports need owner sign-off' }
];

const timeline = [
  { time: '14:26', event: 'Support drill marked failed for missing backup scope', actor: 'Access bot' },
  { time: '13:58', event: 'Finance emergency grant approved under target', actor: 'Nia Brooks' },
  { time: '13:35', event: 'VPN rollback proof attached after target window', actor: 'Omar Saleh' },
  { time: '12:52', event: 'Release signing drill report sealed', actor: 'Iris Tan' }
];

const controls = [
  'Simulate emergency grant without production privilege drift',
  'Measure approver and backup response times',
  'Capture failed approvals with root cause and owner',
  'Attach review evidence and rollback dry-run output',
  'Seal drill report before quarterly access review'
];

function statusClass(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export function App() {
  return (
    <main className="shell">
      <section className="masthead" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">Access governance</p>
          <h1 id="page-title">Emergency approver drill</h1>
          <p className="lede">
            Inspect emergency approver drills, simulated access grants, response times, backup coverage,
            failed approvals, review evidence, and rollback-safe drill reports.
          </p>
        </div>
        <div className="drillPanel" aria-label="Drill readiness">
          <span>Drill readiness</span>
          <strong>82%</strong>
          <small>Two drill reports need owner sign-off before the quarterly access review.</small>
        </div>
      </section>

      <section className="metrics" aria-label="Emergency approver drill metrics">
        {metrics.map((metric) => (
          <article className="metric" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.detail}</small>
          </article>
        ))}
      </section>

      <section className="mainGrid">
        <article className="panel drillQueue">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Drills</p>
              <h2>Simulated emergency grants</h2>
            </div>
            <button type="button">Export drill report</button>
          </div>
          <div className="drillList" aria-label="Emergency approver drills">
            {drills.map((drill) => (
              <article className="drill" key={drill.scenario}>
                <div className="cardTop">
                  <div>
                    <span className={`status ${statusClass(drill.state)}`}>{drill.state}</span>
                    <h3>{drill.scenario}</h3>
                  </div>
                  <strong>{drill.response}</strong>
                </div>
                <dl>
                  <div>
                    <dt>Approver</dt>
                    <dd>{drill.approver}</dd>
                  </div>
                  <div>
                    <dt>Backup</dt>
                    <dd>{drill.backup}</dd>
                  </div>
                  <div>
                    <dt>Grant</dt>
                    <dd>{drill.grant}</dd>
                  </div>
                  <div>
                    <dt>Coverage</dt>
                    <dd>{drill.coverage}</dd>
                  </div>
                  <div>
                    <dt>Evidence</dt>
                    <dd>{drill.evidence}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </article>

        <aside className="panel timelinePanel" aria-labelledby="timeline-title">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Trail</p>
              <h2 id="timeline-title">Drill events</h2>
            </div>
          </div>
          <div className="timelineList">
            {timeline.map((item) => (
              <div className="timeline" key={`${item.time}-${item.event}`}>
                <code>{item.time}</code>
                <div>
                  <strong>{item.event}</strong>
                  <span>{item.actor}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="threeColumn">
        <article className="panel">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Failures</p>
              <h2>Approval repairs</h2>
            </div>
          </div>
          <div className="failureList">
            {failures.map((failure) => (
              <div className="failure" key={failure.drill}>
                <span className={`status ${statusClass(failure.state)}`}>{failure.state}</span>
                <strong>{failure.drill}</strong>
                <p>{failure.cause}</p>
                <small>{failure.owner} · due {failure.due}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Response</p>
              <h2>Timed lanes</h2>
            </div>
          </div>
          <div className="responseList">
            {responseLanes.map((lane) => (
              <div className="response" key={lane.lane}>
                <div>
                  <strong>{lane.lane}</strong>
                  <span>target {lane.target}</span>
                </div>
                <b>{lane.actual}</b>
                <small className={statusClass(lane.status)}>{lane.status}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Coverage</p>
              <h2>Backup approvers</h2>
            </div>
          </div>
          <div className="coverageList">
            {coverage.map((item) => (
              <div className="coverage" key={item.group}>
                <span className={`status ${statusClass(item.readiness)}`}>{item.readiness}</span>
                <strong>{item.group}</strong>
                <p>{item.primary} with backup {item.backup}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="bottomGrid">
        <article className="panel">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Evidence</p>
              <h2>Review packets</h2>
            </div>
          </div>
          <div className="evidenceList">
            {evidence.map((item) => (
              <div className="evidence" key={item.packet}>
                <strong>{item.packet}</strong>
                <span>{item.coverage}</span>
                <p>{item.note}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel controlPanel">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Controls</p>
              <h2>Drill checklist</h2>
            </div>
          </div>
          <ul>
            {controls.map((item) => (
              <li key={item}>
                <span aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
