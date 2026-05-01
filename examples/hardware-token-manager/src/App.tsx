type TokenState = 'enrolled' | 'review' | 'blocked';

type HardwareToken = {
  name: string;
  kind: string;
  serial: string;
  touchPolicy: string;
  state: TokenState;
};

type Enrollment = {
  service: string;
  device: string;
  method: string;
  recovery: string;
  state: TokenState;
};

type TokenChange = {
  title: string;
  policy: string;
  rollback: string;
  state: TokenState;
};

type Probe = {
  label: string;
  command: string;
  note: string;
  state: TokenState;
};

const tokens: HardwareToken[] = [
  {
    name: 'YubiKey primary',
    kind: 'FIDO2 + PIV + OpenPGP',
    serial: 'yk-7429',
    touchPolicy: 'required for admin auth',
    state: 'enrolled'
  },
  {
    name: 'Solo backup',
    kind: 'FIDO2 resident keys',
    serial: 'solo-1182',
    touchPolicy: 'user presence only',
    state: 'review'
  },
  {
    name: 'Smartcard slot',
    kind: 'PIV certificate',
    serial: 'piv-empty',
    touchPolicy: 'not enrolled',
    state: 'blocked'
  },
  {
    name: 'Security key nano',
    kind: 'FIDO2 discoverable',
    serial: 'nano-0364',
    touchPolicy: 'always touch',
    state: 'enrolled'
  }
];

const enrollments: Enrollment[] = [
  {
    service: 'Workstation login',
    device: 'YubiKey primary',
    method: 'pam-u2f with backup key',
    recovery: 'password fallback retained',
    state: 'enrolled'
  },
  {
    service: 'SSH certificate auth',
    device: 'Security key nano',
    method: 'sk-ssh-ed25519',
    recovery: 'restore file-backed key',
    state: 'review'
  },
  {
    service: 'Admin PIV shell',
    device: 'Smartcard slot',
    method: 'PIV slot 9a',
    recovery: 'hold enrollment until cert is issued',
    state: 'blocked'
  },
  {
    service: 'Browser passkeys',
    device: 'Solo backup',
    method: 'resident credential audit',
    recovery: 'export recovery codes before reset',
    state: 'review'
  }
];

const changes: TokenChange[] = [
  {
    title: 'Touch policy hardening',
    policy: 'require touch for admin PIV and SSH security-key operations',
    rollback: 'restore previous per-slot policy file',
    state: 'review'
  },
  {
    title: 'Backup token check',
    policy: 'verify one backup token before changing login enforcement',
    rollback: 'keep password fallback active',
    state: 'enrolled'
  },
  {
    title: 'Empty PIV slot block',
    policy: 'prevent routing admin auth to an unenrolled smartcard slot',
    rollback: 'remove blocked route after certificate import',
    state: 'blocked'
  }
];

const probes: Probe[] = [
  {
    label: 'FIDO2',
    command: 'fido2-token -L',
    note: 'list visible hardware authenticators without changing enrollment',
    state: 'enrolled'
  },
  {
    label: 'PIV',
    command: 'ykman piv info',
    note: 'inspect certificates and touch policy before applying changes',
    state: 'review'
  },
  {
    label: 'OpenPGP',
    command: 'gpg --card-status',
    note: 'confirm card identity and signing slot state',
    state: 'review'
  },
  {
    label: 'Recovery',
    command: 'pamu2fcfg -n',
    note: 'stage a new mapping only after recovery path is present',
    state: 'blocked'
  }
];

const stateLabels: Record<TokenState, string> = {
  enrolled: 'Enrolled',
  review: 'Review',
  blocked: 'Blocked'
};

const enrolledCount = tokens.filter((token) => token.state === 'enrolled').length;
const reviewCount = tokens.filter((token) => token.state === 'review').length;
const blockedCount = tokens.filter((token) => token.state === 'blocked').length;
const recoveryCount = enrollments.filter((item) => item.recovery.includes('fallback') || item.recovery.includes('recovery')).length;

export function App() {
  return (
    <main className="shell">
      <section className="workspace" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Hardware tokens</p>
            <h1 id="page-title">Token Manager</h1>
          </div>
          <button type="button">Stage Enrollment</button>
        </header>

        <section className="metrics" aria-label="Hardware token summary">
          <article>
            <span>{tokens.length}</span>
            <p>devices</p>
          </article>
          <article>
            <span>{enrolledCount}</span>
            <p>enrolled</p>
          </article>
          <article>
            <span>{reviewCount + recoveryCount}</span>
            <p>review paths</p>
          </article>
          <article>
            <span>{blockedCount}</span>
            <p>blocked slots</p>
          </article>
        </section>

        <section className="layout">
          <section className="tokenPanel" aria-label="Hardware token inventory">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Device map</p>
                <h2>FIDO2, PIV, and smartcard devices, enrollment state, touch policies, recovery paths, and rollback-safe token changes</h2>
              </div>
              <div className="statusBadge">
                <span />
                recovery-aware
              </div>
            </div>

            <div className="tokenRows" role="list">
              {tokens.map((token) => (
                <article className="tokenRow" data-state={token.state} key={token.serial} role="listitem" tabIndex={0}>
                  <div className="tokenTitle">
                    <span>{stateLabels[token.state]}</span>
                    <h3>{token.name}</h3>
                    <p>{token.serial}</p>
                  </div>
                  <div className="tokenMeta">
                    <div>
                      <small>kind</small>
                      <strong>{token.kind}</strong>
                    </div>
                    <div>
                      <small>touch policy</small>
                      <strong>{token.touchPolicy}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="sideRail">
            <section className="enrollmentPanel" aria-label="Token enrollment state">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Enrollment</p>
                  <h2>Service bindings</h2>
                </div>
              </div>
              <div className="enrollmentList">
                {enrollments.map((item) => (
                  <article data-state={item.state} key={item.service} tabIndex={0}>
                    <span>{stateLabels[item.state]}</span>
                    <h3>{item.service}</h3>
                    <p>{item.device}</p>
                    <strong>{item.method}</strong>
                    <small>{item.recovery}</small>
                  </article>
                ))}
              </div>
            </section>

            <section className="changePanel" aria-label="Rollback-safe token changes">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Policy</p>
                  <h2>Change plan</h2>
                </div>
              </div>
              <div className="changeList">
                {changes.map((change) => (
                  <article data-state={change.state} key={change.title} tabIndex={0}>
                    <span>{stateLabels[change.state]}</span>
                    <h3>{change.title}</h3>
                    <p>{change.policy}</p>
                    <strong>{change.rollback}</strong>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </section>

        <section className="probePanel" aria-label="Hardware token inspection commands">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Inspection queue</p>
              <h2>Command probes</h2>
            </div>
          </div>
          <div className="probeGrid">
            {probes.map((probe) => (
              <article data-state={probe.state} key={probe.label} tabIndex={0}>
                <span>{stateLabels[probe.state]}</span>
                <h3>{probe.label}</h3>
                <code>{probe.command}</code>
                <p>{probe.note}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
