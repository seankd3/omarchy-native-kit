const metrics = [
  { label: 'Sealed packets', value: '128', detail: '31 from this week' },
  { label: 'Rollback expiring', value: '9', detail: 'within 24 hours' },
  { label: 'Auditor requests', value: '6', detail: '3 due today' },
  { label: 'Retention coverage', value: '94%', detail: '7 packets need receipts' }
];

const packets = [
  {
    batch: 'Finance warehouse cleanup A',
    owner: 'Rina Patel',
    sealed: '2026-05-01 23:18',
    snapshot: 'ENT-SNAP-8831',
    rollback: '18h left',
    receipts: 'Complete',
    retention: '7 years',
    status: 'Sealed'
  },
  {
    batch: 'Support console contractors B',
    owner: 'Jon Bell',
    sealed: '2026-04-30 10:42',
    snapshot: 'ENT-SNAP-8807',
    rollback: 'Expired',
    receipts: 'Missing 2',
    retention: 'Hold',
    status: 'Auditor hold'
  },
  {
    batch: 'Legacy VPN vendor grants C',
    owner: 'Marisol Chen',
    sealed: '2026-04-29 19:05',
    snapshot: 'ENT-SNAP-8794',
    rollback: '6h left',
    receipts: 'Complete',
    retention: '3 years',
    status: 'Reopen watch'
  },
  {
    batch: 'Release signing backup group D',
    owner: 'Priya Rao',
    sealed: '2026-04-28 21:28',
    snapshot: 'ENT-SNAP-8772',
    rollback: 'Expired',
    receipts: 'Complete',
    retention: '7 years',
    status: 'Sealed'
  }
];

const requests = [
  { auditor: 'Nina Walsh', packet: 'Support console contractors B', ask: 'Receipt trail for contractor notices', due: 'Today 16:00', state: 'Open' },
  { auditor: 'Cal Mateo', packet: 'Finance warehouse cleanup A', ask: 'Pre-removal export checksum', due: 'May 2 11:00', state: 'Ready' },
  { auditor: 'Dee Okafor', packet: 'Legacy VPN vendor grants C', ask: 'Exception reopen rationale', due: 'Today 14:30', state: 'Open' },
  { auditor: 'Iris Tan', packet: 'Release signing backup group D', ask: 'Owner quorum evidence', due: 'May 3 09:00', state: 'Ready' }
];

const reopenings = [
  { target: 'Vendor VPN grant V-119', reason: 'Provider support extension', approver: 'Marisol Chen', window: '4h', state: 'Pending' },
  { target: 'Support macro role', reason: 'Escalation macro dependency', approver: 'Jon Bell', window: '2h', state: 'Denied' },
  { target: 'BI extract analyst', reason: 'Revenue close exception', approver: 'Rina Patel', window: '8h', state: 'Approved' }
];

const receipts = [
  { channel: '#fin-access', batch: 'Finance A', delivered: '46/46', archived: 'Yes' },
  { channel: '#cx-ops', batch: 'Support B', delivered: '29/31', archived: 'Partial' },
  { channel: '#netsec', batch: 'VPN C', delivered: '58/58', archived: 'Yes' },
  { channel: '#release', batch: 'Signing D', delivered: '49/49', archived: 'Yes' }
];

const retention = [
  { label: 'Legal hold packets', value: '12', tone: 'warning' },
  { label: 'Checksum verified', value: '121', tone: 'success' },
  { label: 'Receipts missing', value: '7', tone: 'danger' },
  { label: 'Auto purge blocked', value: '4', tone: 'info' }
];

const chain = [
  'Removal plan approved',
  'Pre-removal entitlement snapshot sealed',
  'Dry-run and rollback output retained',
  'Communication receipts archived',
  'Post-removal access diff signed'
];

function statusClass(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export function App() {
  return (
    <main className="shell">
      <section className="hero" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">Access governance</p>
          <h1 id="page-title">Removal evidence vault</h1>
          <p className="lede">
            Inspect completed removal batches, sealed entitlement snapshots, rollback expiry,
            communication receipts, auditor requests, exception reopenings, and cleanup evidence retention.
          </p>
        </div>
        <div className="vaultDial" aria-label="Vault readiness">
          <span>Vault readiness</span>
          <strong>94%</strong>
          <small>Seven packets need receipt repair before quarterly audit export.</small>
        </div>
      </section>

      <section className="metrics" aria-label="Evidence vault metrics">
        {metrics.map((metric) => (
          <article className="metric" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.detail}</small>
          </article>
        ))}
      </section>

      <section className="layout">
        <article className="panel packetPanel">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Sealed packets</p>
              <h2>Completed removal batches</h2>
            </div>
            <button type="button">Export audit set</button>
          </div>
          <div className="packetList" aria-label="Completed removal evidence packets">
            {packets.map((packet) => (
              <article className="packet" key={packet.batch}>
                <div className="packetTitle">
                  <div>
                    <span className={`status ${statusClass(packet.status)}`}>{packet.status}</span>
                    <h3>{packet.batch}</h3>
                  </div>
                  <code>{packet.snapshot}</code>
                </div>
                <dl>
                  <div>
                    <dt>Owner</dt>
                    <dd>{packet.owner}</dd>
                  </div>
                  <div>
                    <dt>Sealed</dt>
                    <dd>{packet.sealed}</dd>
                  </div>
                  <div>
                    <dt>Rollback</dt>
                    <dd>{packet.rollback}</dd>
                  </div>
                  <div>
                    <dt>Receipts</dt>
                    <dd>{packet.receipts}</dd>
                  </div>
                  <div>
                    <dt>Retention</dt>
                    <dd>{packet.retention}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </article>

        <aside className="panel retentionPanel" aria-labelledby="retention-title">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Retention</p>
              <h2 id="retention-title">Vault posture</h2>
            </div>
          </div>
          <div className="retentionGrid">
            {retention.map((item) => (
              <div className={`retentionCard ${item.tone}`} key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
          <ol className="chain">
            {chain.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </aside>
      </section>

      <section className="threeColumn">
        <article className="panel">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Auditors</p>
              <h2>Open requests</h2>
            </div>
          </div>
          <div className="requestList">
            {requests.map((request) => (
              <div className="request" key={`${request.auditor}-${request.packet}`}>
                <div>
                  <strong>{request.auditor}</strong>
                  <span>{request.packet}</span>
                </div>
                <p>{request.ask}</p>
                <div className="requestFooter">
                  <small>{request.due}</small>
                  <b className={statusClass(request.state)}>{request.state}</b>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Exceptions</p>
              <h2>Reopening queue</h2>
            </div>
          </div>
          <div className="reopenList">
            {reopenings.map((reopen) => (
              <div className="reopen" key={reopen.target}>
                <span className={`status ${statusClass(reopen.state)}`}>{reopen.state}</span>
                <strong>{reopen.target}</strong>
                <p>{reopen.reason}</p>
                <small>{reopen.approver} · {reopen.window}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Receipts</p>
              <h2>Communication archive</h2>
            </div>
          </div>
          <div className="receiptList">
            {receipts.map((receipt) => (
              <div className="receipt" key={receipt.channel}>
                <code>{receipt.channel}</code>
                <div>
                  <strong>{receipt.batch}</strong>
                  <span>{receipt.delivered} delivered</span>
                </div>
                <b className={statusClass(receipt.archived)}>{receipt.archived}</b>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
