type PasskeyState = 'compliant' | 'review' | 'tighten';

type PasskeyRegistration = {
  user: string;
  device: string;
  resident: string;
  attestation: string;
  state: PasskeyState;
};

type DeviceFinding = {
  title: string;
  user: string;
  evidence: string;
  state: PasskeyState;
};

type PolicyChange = {
  title: string;
  change: string;
  rollback: string;
  state: PasskeyState;
};

type RecoveryWindow = {
  group: string;
  window: string;
  probe: string;
  state: PasskeyState;
};

const registrations: PasskeyRegistration[] = [
  {
    user: 'Release Desk',
    device: 'YubiKey Bio',
    resident: 'resident credential',
    attestation: 'enterprise attested',
    state: 'compliant'
  },
  {
    user: 'Design Lead',
    device: 'Laptop platform key',
    resident: 'synced passkey',
    attestation: 'self attested',
    state: 'review'
  },
  {
    user: 'Legacy Admin',
    device: 'Unknown roaming key',
    resident: 'discoverable credential',
    attestation: 'missing attestation',
    state: 'tighten'
  },
  {
    user: 'On-call Runner',
    device: 'Phone secure enclave',
    resident: 'synced passkey',
    attestation: 'device attested',
    state: 'compliant'
  }
];

const findings: DeviceFinding[] = [
  {
    title: 'Unknown roaming authenticator',
    user: 'Legacy Admin',
    evidence: 'No owner confirmation and last successful assertion was 143 days ago',
    state: 'tighten'
  },
  {
    title: 'Synced passkey allowed for privileged role',
    user: 'Design Lead',
    evidence: 'Role can approve releases but attestation is self-reported',
    state: 'review'
  },
  {
    title: 'Enterprise attestation is fresh',
    user: 'Release Desk',
    evidence: 'Authenticator AAGUID matches approved hardware inventory',
    state: 'compliant'
  }
];

const changes: PolicyChange[] = [
  {
    title: 'Require attestation for admins',
    change: 'Block new privileged registrations without approved authenticator attestation',
    rollback: 'Allow temporary registration only with break-glass approval',
    state: 'tighten'
  },
  {
    title: 'Review synced passkeys',
    change: 'Flag synced credentials for roles that approve production changes',
    rollback: 'Keep current allowlist until owner confirms replacement device',
    state: 'review'
  },
  {
    title: 'Preserve on-call access',
    change: 'Keep phone secure enclave passkey for pager handoff',
    rollback: 'Fallback to hardware token if assertion probe fails',
    state: 'compliant'
  }
];

const windows: RecoveryWindow[] = [
  {
    group: 'Legacy admins',
    window: 'today 16:00',
    probe: 'confirm hardware token enrollment before stale passkey removal',
    state: 'tighten'
  },
  {
    group: 'Release approvers',
    window: 'next release freeze',
    probe: 'test attested registration and assertion replay protection',
    state: 'review'
  },
  {
    group: 'On-call rotation',
    window: 'weekly readiness drill',
    probe: 'passkey assertion succeeds on backup workstation',
    state: 'compliant'
  }
];

const labels: Record<PasskeyState, string> = {
  compliant: 'Compliant',
  review: 'Review',
  tighten: 'Tighten'
};

const compliantCount = registrations.filter((item) => item.state === 'compliant').length + findings.filter((finding) => finding.state === 'compliant').length;
const reviewCount = registrations.filter((item) => item.state === 'review').length + changes.filter((change) => change.state === 'review').length;
const tightenCount = registrations.filter((item) => item.state === 'tighten').length + windows.filter((window) => window.state === 'tighten').length;

export function App() {
  return (
    <main className="shell">
      <section className="workspace" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">WebAuthn policy</p>
            <h1 id="page-title">Passkey Center</h1>
          </div>
          <button type="button">Stage Policy Change</button>
        </header>

        <section className="summary" aria-label="Passkey policy summary">
          <article>
            <span>{registrations.length}</span>
            <p>registrations</p>
          </article>
          <article>
            <span>{compliantCount}</span>
            <p>compliant keys</p>
          </article>
          <article>
            <span>{reviewCount}</span>
            <p>review items</p>
          </article>
          <article>
            <span>{tightenCount}</span>
            <p>tighten actions</p>
          </article>
        </section>

        <section className="registrationPanel" aria-label="Passkey registration inventory">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Credential ledger</p>
              <h2>Passkey registrations, resident credentials, authenticator attestation, stale devices, owner intent, and rollback-safe WebAuthn policy changes</h2>
            </div>
            <div className="policyBadge">
              <span />
              attested access
            </div>
          </div>

          <div className="registrationGrid" role="list">
            {registrations.map((registration) => (
              <article className="registrationCard" data-state={registration.state} key={registration.user} role="listitem" tabIndex={0}>
                <div className="cardStatus">
                  <span>{labels[registration.state]}</span>
                  <strong>{registration.attestation}</strong>
                </div>
                <h3>{registration.user}</h3>
                <code>{registration.resident}</code>
                <p>{registration.device}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="split">
          <section className="findingPanel" aria-labelledby="findings-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Devices</p>
              <h2 id="findings-title">Stale device findings</h2>
            </div>
            <div className="findingList" role="list">
              {findings.map((finding) => (
                <article data-state={finding.state} key={finding.title} role="listitem" tabIndex={0}>
                  <span>{labels[finding.state]}</span>
                  <h3>{finding.title}</h3>
                  <p>{finding.user}</p>
                  <strong>{finding.evidence}</strong>
                </article>
              ))}
            </div>
          </section>

          <section className="changePanel" aria-labelledby="changes-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Policy</p>
              <h2 id="changes-title">Rollback-safe changes</h2>
            </div>
            <div className="changeList" role="list">
              {changes.map((change) => (
                <article data-state={change.state} key={change.title} role="listitem" tabIndex={0}>
                  <span>{labels[change.state]}</span>
                  <h3>{change.title}</h3>
                  <p>{change.change}</p>
                  <strong>{change.rollback}</strong>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section className="windowPanel" aria-labelledby="windows-title">
          <div className="panelHeader compact">
            <p className="eyebrow">Windows</p>
            <h2 id="windows-title">Recovery windows</h2>
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
