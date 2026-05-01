type GpgState = 'trusted' | 'review' | 'exposed';

type AgentSocket = {
  name: string;
  socket: string;
  role: string;
  ttl: string;
  state: GpgState;
};

type SigningKey = {
  label: string;
  fingerprint: string;
  trust: string;
  usage: string;
  state: GpgState;
};

type PolicyChange = {
  title: string;
  change: string;
  rollback: string;
  state: GpgState;
};

type Probe = {
  label: string;
  command: string;
  note: string;
  state: GpgState;
};

const sockets: AgentSocket[] = [
  {
    name: 'GPG agent',
    socket: '/run/user/1000/gnupg/S.gpg-agent',
    role: 'sign and decrypt',
    ttl: '2h cache',
    state: 'trusted'
  },
  {
    name: 'SSH bridge',
    socket: '/run/user/1000/gnupg/S.gpg-agent.ssh',
    role: 'ssh auth via gpg-agent',
    ttl: '30m cache',
    state: 'review'
  },
  {
    name: 'Browser socket',
    socket: '/run/user/1000/gnupg/S.gpg-agent.browser',
    role: 'extension handoff',
    ttl: 'unknown cache',
    state: 'exposed'
  }
];

const keys: SigningKey[] = [
  {
    label: 'work signing',
    fingerprint: '8F2A C981 A7B2 44FA',
    trust: 'ultimate',
    usage: 'git signatures',
    state: 'trusted'
  },
  {
    label: 'smartcard auth',
    fingerprint: '7B91 3D2E F00D 19AA',
    trust: 'card present',
    usage: 'admin shells',
    state: 'review'
  },
  {
    label: 'legacy decrypt',
    fingerprint: '1C4E 77AC 9921 0BEE',
    trust: 'expired ownertrust',
    usage: 'old backups',
    state: 'exposed'
  },
  {
    label: 'release signing',
    fingerprint: 'F32B 1180 4D91 77C2',
    trust: 'full',
    usage: 'package releases',
    state: 'trusted'
  }
];

const policies: PolicyChange[] = [
  {
    title: 'Cache TTL alignment',
    change: 'set default-cache-ttl and max-cache-ttl for desktop sessions',
    rollback: 'restore previous gpg-agent.conf',
    state: 'review'
  },
  {
    title: 'Smartcard prompt',
    change: 'require touch confirmation for admin authentication keys',
    rollback: 'keep current card policy until export is verified',
    state: 'trusted'
  },
  {
    title: 'Legacy key quarantine',
    change: 'move expired decrypt key into backup-only policy group',
    rollback: 'restore ownertrust import',
    state: 'exposed'
  }
];

const probes: Probe[] = [
  {
    label: 'Sockets',
    command: 'gpgconf --list-dirs agent-socket agent-ssh-socket',
    note: 'compare agent sockets across shell and desktop launchers',
    state: 'trusted'
  },
  {
    label: 'Smartcard',
    command: 'gpg --card-status',
    note: 'confirm card presence before changing auth policy',
    state: 'review'
  },
  {
    label: 'Trust DB',
    command: 'gpg --list-keys --with-colons',
    note: 'inspect trust and capabilities without exporting secrets',
    state: 'review'
  },
  {
    label: 'Reload',
    command: 'gpgconf --reload gpg-agent',
    note: 'stage a reversible reload after config diff review',
    state: 'exposed'
  }
];

const stateLabels: Record<GpgState, string> = {
  trusted: 'Trusted',
  review: 'Review',
  exposed: 'Exposed'
};

const trustedCount = keys.filter((key) => key.state === 'trusted').length;
const reviewCount = keys.filter((key) => key.state === 'review').length;
const exposedCount = keys.filter((key) => key.state === 'exposed').length;
const socketReviewCount = sockets.filter((socket) => socket.state !== 'trusted').length;

export function App() {
  return (
    <main className="shell">
      <section className="workspace" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">GPG keyring</p>
            <h1 id="page-title">Policy Lab</h1>
          </div>
          <button type="button">Stage Policy</button>
        </header>

        <section className="metrics" aria-label="GPG keyring policy summary">
          <article>
            <span>{keys.length}</span>
            <p>signing keys</p>
          </article>
          <article>
            <span>{trustedCount}</span>
            <p>trusted</p>
          </article>
          <article>
            <span>{reviewCount + socketReviewCount}</span>
            <p>review paths</p>
          </article>
          <article>
            <span>{exposedCount}</span>
            <p>exposed keys</p>
          </article>
        </section>

        <section className="layout">
          <section className="socketPanel" aria-label="GPG agent sockets">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Agent sockets</p>
                <h2>GPG agent sockets, smartcard state, signing key trust, cache TTLs, and rollback-safe cryptographic policy changes</h2>
              </div>
              <div className="statusBadge">
                <span />
                trust scoped
              </div>
            </div>

            <div className="socketRows" role="list">
              {sockets.map((socket) => (
                <article className="socketRow" data-state={socket.state} key={socket.socket} role="listitem" tabIndex={0}>
                  <div className="socketTitle">
                    <span>{stateLabels[socket.state]}</span>
                    <h3>{socket.name}</h3>
                    <p>{socket.socket}</p>
                  </div>
                  <div className="socketMeta">
                    <div>
                      <small>role</small>
                      <strong>{socket.role}</strong>
                    </div>
                    <div>
                      <small>ttl</small>
                      <strong>{socket.ttl}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="sideRail">
            <section className="keyPanel" aria-label="Signing key trust">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Keys</p>
                  <h2>Trust ledger</h2>
                </div>
              </div>
              <div className="keyList">
                {keys.map((key) => (
                  <article data-state={key.state} key={key.fingerprint}>
                    <span>{stateLabels[key.state]}</span>
                    <h3>{key.label}</h3>
                    <p>{key.fingerprint}</p>
                    <strong>{key.trust}</strong>
                    <small>{key.usage}</small>
                  </article>
                ))}
              </div>
            </section>

            <section className="policyPanel" aria-label="Rollback-safe GPG policy changes">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Policy</p>
                  <h2>Change plan</h2>
                </div>
              </div>
              <div className="policyList">
                {policies.map((policy) => (
                  <article data-state={policy.state} key={policy.title}>
                    <span>{stateLabels[policy.state]}</span>
                    <h3>{policy.title}</h3>
                    <p>{policy.change}</p>
                    <strong>{policy.rollback}</strong>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </section>

        <section className="probePanel" aria-label="GPG inspection commands">
          <div className="panelHeader compact">
            <div>
              <p className="eyebrow">Inspection queue</p>
              <h2>Command probes</h2>
            </div>
          </div>
          <div className="probeGrid">
            {probes.map((probe) => (
              <article data-state={probe.state} key={probe.label}>
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
