type ComplianceState = 'compliant' | 'exception' | 'blocked';

type DeviceRecord = {
  device: string;
  owner: string;
  posture: string;
  attestation: string;
  state: ComplianceState;
};

type SignalFinding = {
  title: string;
  device: string;
  evidence: string;
  state: ComplianceState;
};

type PolicyAction = {
  title: string;
  change: string;
  rollback: string;
  state: ComplianceState;
};

type ExceptionWindow = {
  group: string;
  window: string;
  probe: string;
  state: ComplianceState;
};

const devices: DeviceRecord[] = [
  {
    device: 'release-laptop-07',
    owner: 'release desk',
    posture: 'disk encrypted, secure boot, EDR healthy',
    attestation: 'fresh 18 minutes ago',
    state: 'compliant'
  },
  {
    device: 'design-tablet-02',
    owner: 'design',
    posture: 'OS patch pending',
    attestation: 'fresh 2 hours ago',
    state: 'exception'
  },
  {
    device: 'legacy-buildbox',
    owner: 'unknown',
    posture: 'no endpoint signal',
    attestation: 'stale 19 days',
    state: 'blocked'
  },
  {
    device: 'oncall-phone-03',
    owner: 'operations',
    posture: 'managed profile, screen lock, MDM healthy',
    attestation: 'fresh 41 minutes ago',
    state: 'compliant'
  }
];

const findings: SignalFinding[] = [
  {
    title: 'Endpoint signal missing',
    device: 'legacy-buildbox',
    evidence: 'No compliance attestation since last package baseline update',
    state: 'blocked'
  },
  {
    title: 'Patch exception expires soon',
    device: 'design-tablet-02',
    evidence: 'Owner accepted 24-hour exception for presentation review',
    state: 'exception'
  },
  {
    title: 'Release laptop posture is strong',
    device: 'release-laptop-07',
    evidence: 'Secure boot and encrypted disk claims match device inventory',
    state: 'compliant'
  }
];

const actions: PolicyAction[] = [
  {
    title: 'Block stale buildbox access',
    change: 'Remove legacy-buildbox from production network policy',
    rollback: 'Restore access only after fresh MDM and EDR attestations',
    state: 'blocked'
  },
  {
    title: 'Time-box design tablet',
    change: 'Allow design-tablet-02 until patch window closes',
    rollback: 'Drop exception automatically if patch probe fails',
    state: 'exception'
  },
  {
    title: 'Preserve release access',
    change: 'Keep release-laptop-07 in privileged device group',
    rollback: 'Move to review if secure boot claim changes',
    state: 'compliant'
  }
];

const windows: ExceptionWindow[] = [
  {
    group: 'Legacy build hosts',
    window: 'immediate quarantine',
    probe: 'fresh posture attestation and owner confirmation',
    state: 'blocked'
  },
  {
    group: 'Design review devices',
    window: 'today 20:00',
    probe: 'OS patch applied and MDM inventory refreshed',
    state: 'exception'
  },
  {
    group: 'Release operators',
    window: 'next release freeze',
    probe: 'privileged workflow passes from compliant laptop only',
    state: 'compliant'
  }
];

const labels: Record<ComplianceState, string> = {
  compliant: 'Compliant',
  exception: 'Exception',
  blocked: 'Blocked'
};

const compliantCount = devices.filter((device) => device.state === 'compliant').length + findings.filter((finding) => finding.state === 'compliant').length;
const exceptionCount = devices.filter((device) => device.state === 'exception').length + actions.filter((action) => action.state === 'exception').length;
const blockedCount = devices.filter((device) => device.state === 'blocked').length + windows.filter((window) => window.state === 'blocked').length;

export function App() {
  return (
    <main className="shell">
      <section className="workspace" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Device compliance</p>
            <h1 id="page-title">Attestation Desk</h1>
          </div>
          <button type="button">Stage Policy Change</button>
        </header>

        <section className="summary" aria-label="Device compliance summary">
          <article>
            <span>{devices.length}</span>
            <p>enrolled devices</p>
          </article>
          <article>
            <span>{compliantCount}</span>
            <p>healthy signals</p>
          </article>
          <article>
            <span>{exceptionCount}</span>
            <p>exceptions</p>
          </article>
          <article>
            <span>{blockedCount}</span>
            <p>blocked paths</p>
          </article>
        </section>

        <section className="devicePanel" aria-label="Device posture inventory">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Posture ledger</p>
              <h2>Enrolled devices, posture attestations, stale compliance signals, owner intent, exception windows, and rollback-safe access policy changes</h2>
            </div>
            <div className="postureBadge">
              <span />
              managed posture
            </div>
          </div>

          <div className="deviceGrid" role="list">
            {devices.map((device) => (
              <article className="deviceCard" data-state={device.state} key={device.device} role="listitem" tabIndex={0}>
                <div className="cardStatus">
                  <span>{labels[device.state]}</span>
                  <strong>{device.attestation}</strong>
                </div>
                <h3>{device.device}</h3>
                <code>{device.posture}</code>
                <p>{device.owner}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="split">
          <section className="findingPanel" aria-labelledby="findings-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Signals</p>
              <h2 id="findings-title">Compliance findings</h2>
            </div>
            <div className="findingList" role="list">
              {findings.map((finding) => (
                <article data-state={finding.state} key={finding.title} role="listitem" tabIndex={0}>
                  <span>{labels[finding.state]}</span>
                  <h3>{finding.title}</h3>
                  <p>{finding.device}</p>
                  <strong>{finding.evidence}</strong>
                </article>
              ))}
            </div>
          </section>

          <section className="actionPanel" aria-labelledby="actions-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Access</p>
              <h2 id="actions-title">Rollback-safe policy changes</h2>
            </div>
            <div className="actionList" role="list">
              {actions.map((action) => (
                <article data-state={action.state} key={action.title} role="listitem" tabIndex={0}>
                  <span>{labels[action.state]}</span>
                  <h3>{action.title}</h3>
                  <p>{action.change}</p>
                  <strong>{action.rollback}</strong>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section className="windowPanel" aria-labelledby="windows-title">
          <div className="panelHeader compact">
            <p className="eyebrow">Windows</p>
            <h2 id="windows-title">Exception windows</h2>
          </div>
          <div className="windowList" role="list">
            {windows.map((item) => (
              <article data-state={item.state} key={item.group} role="listitem" tabIndex={0}>
                <span>{labels[item.state]}</span>
                <h3>{item.group}</h3>
                <p>{item.window}</p>
                <strong>{item.probe}</strong>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
