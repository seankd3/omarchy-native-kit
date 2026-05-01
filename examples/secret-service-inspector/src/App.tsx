type SecretState = 'locked' | 'review' | 'ready';

type Provider = {
  name: string;
  service: string;
  unlock: string;
  secrets: number;
  stale: number;
  state: SecretState;
};

type AccessGrant = {
  app: string;
  collection: string;
  scope: string;
  lastUsed: string;
  state: SecretState;
};

type CleanupStep = {
  title: string;
  intent: string;
  rollback: string;
  state: SecretState;
};

type Probe = {
  label: string;
  command: string;
  note: string;
  state: SecretState;
};

const providers: Provider[] = [
  {
    name: 'Login keyring',
    service: 'org.freedesktop.secrets',
    unlock: 'session unlocked',
    secrets: 42,
    stale: 3,
    state: 'ready'
  },
  {
    name: 'KeePassXC bridge',
    service: 'org.keepassxc.KeePassXC.MainWindow',
    unlock: 'manual approval',
    secrets: 18,
    stale: 1,
    state: 'review'
  },
  {
    name: 'Legacy collection',
    service: 'org.gnome.keyring.SystemPrompter',
    unlock: 'locked at login',
    secrets: 9,
    stale: 6,
    state: 'locked'
  }
];

const grants: AccessGrant[] = [
  {
    app: 'Git credential helper',
    collection: 'Login',
    scope: 'github.com token read',
    lastUsed: 'today',
    state: 'ready'
  },
  {
    app: 'Browser profile',
    collection: 'Default',
    scope: 'network passwords',
    lastUsed: '2 days ago',
    state: 'review'
  },
  {
    app: 'Old sync client',
    collection: 'Legacy',
    scope: 'cloud password read-write',
    lastUsed: '94 days ago',
    state: 'locked'
  },
  {
    app: 'VPN launcher',
    collection: 'Login',
    scope: 'wireguard passphrase read',
    lastUsed: 'yesterday',
    state: 'ready'
  }
];

const cleanupSteps: CleanupStep[] = [
  {
    title: 'Quarantine stale entries',
    intent: 'move unused secrets into a review collection before deletion',
    rollback: 'restore original collection labels',
    state: 'review'
  },
  {
    title: 'Unlock policy audit',
    intent: 'compare login unlock state with active desktop sessions',
    rollback: 'keep existing PAM and keyring hooks unchanged',
    state: 'ready'
  },
  {
    title: 'Legacy client removal',
    intent: 'revoke access from clients with no recent successful unlock',
    rollback: 're-enable client after credential export',
    state: 'locked'
  }
];

const probes: Probe[] = [
  {
    label: 'Providers',
    command: 'busctl --user list | rg secrets',
    note: 'find Secret Service owners and bridge providers',
    state: 'ready'
  },
  {
    label: 'Collections',
    command: 'secret-tool search --all xdg:schema org.freedesktop.Secret.Collection',
    note: 'inventory collections before cleanup',
    state: 'review'
  },
  {
    label: 'Keyring daemon',
    command: 'systemctl --user status gnome-keyring-daemon',
    note: 'check unlock state and session integration',
    state: 'review'
  },
  {
    label: 'Rollback export',
    command: 'secret-tool lookup service <service-name>',
    note: 'confirm a readable value before removing stale metadata',
    state: 'locked'
  }
];

const stateLabels: Record<SecretState, string> = {
  locked: 'Locked',
  review: 'Review',
  ready: 'Ready'
};

const readyCount = providers.filter((provider) => provider.state === 'ready').length;
const reviewCount = providers.filter((provider) => provider.state === 'review').length;
const staleTotal = providers.reduce((total, provider) => total + provider.stale, 0);
const secretTotal = providers.reduce((total, provider) => total + provider.secrets, 0);

export function App() {
  return (
    <main className="shell">
      <section className="workspace" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Secret Service</p>
            <h1 id="page-title">Inspector</h1>
          </div>
          <button type="button">Stage Cleanup</button>
        </header>

        <section className="summary" aria-label="Secret Service summary">
          <article>
            <span>{providers.length}</span>
            <p>providers</p>
          </article>
          <article>
            <span>{readyCount}</span>
            <p>ready</p>
          </article>
          <article>
            <span>{reviewCount}</span>
            <p>review paths</p>
          </article>
          <article>
            <span>{staleTotal}</span>
            <p>stale secrets</p>
          </article>
        </section>

        <section className="grid">
          <section className="providerPanel" aria-label="Secret Service providers">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Provider map</p>
                <h2>Secret Service providers, keyring unlock state, app access, stale secrets, and rollback-safe cleanup</h2>
              </div>
              <div className="totalBadge">
                <span>{secretTotal}</span>
                stored secrets
              </div>
            </div>

            <div className="providerRows" role="list">
              {providers.map((provider) => (
                <article className="providerRow" data-state={provider.state} key={provider.service} role="listitem" tabIndex={0}>
                  <div className="providerTitle">
                    <span>{stateLabels[provider.state]}</span>
                    <h3>{provider.name}</h3>
                    <p>{provider.service}</p>
                  </div>
                  <div className="providerMeta">
                    <div>
                      <small>unlock</small>
                      <strong>{provider.unlock}</strong>
                    </div>
                    <div>
                      <small>secrets</small>
                      <strong>{provider.secrets}</strong>
                    </div>
                    <div>
                      <small>stale</small>
                      <strong>{provider.stale}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="sideRail">
            <section className="accessPanel" aria-label="Application secret access">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">App access</p>
                  <h2>Grant ledger</h2>
                </div>
              </div>
              <div className="grantList">
                {grants.map((grant) => (
                  <article data-state={grant.state} key={grant.app}>
                    <span>{stateLabels[grant.state]}</span>
                    <h3>{grant.app}</h3>
                    <p>{grant.collection}</p>
                    <strong>{grant.scope}</strong>
                    <small>{grant.lastUsed}</small>
                  </article>
                ))}
              </div>
            </section>

            <section className="cleanupPanel" aria-label="Rollback-safe credential cleanup">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Cleanup</p>
                  <h2>Rollback plan</h2>
                </div>
              </div>
              <div className="cleanupList">
                {cleanupSteps.map((step) => (
                  <article data-state={step.state} key={step.title}>
                    <span>{stateLabels[step.state]}</span>
                    <h3>{step.title}</h3>
                    <p>{step.intent}</p>
                    <strong>{step.rollback}</strong>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </section>

        <section className="probePanel" aria-label="Secret Service inspection commands">
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
