type Trust = 'trusted' | 'guarded' | 'blocked';

type NetworkProfile = {
  name: string;
  trust: Trust;
  vpn: string;
  dns: string;
  workspace: string;
  latency: string;
  policy: string;
};

type RouteRule = {
  workspace: string;
  route: string;
  posture: string;
  fallback: string;
};

type Signal = {
  label: string;
  value: string;
  detail: string;
  trust: Trust;
};

const profiles: NetworkProfile[] = [
  {
    name: 'Home Fiber',
    trust: 'trusted',
    vpn: 'Split tunnel',
    dns: 'Local resolver',
    workspace: 'Design + Docs',
    latency: '8 ms',
    policy: 'Allow local devices and package mirrors'
  },
  {
    name: 'Coffee Shop',
    trust: 'guarded',
    vpn: 'Full tunnel',
    dns: 'Encrypted DNS',
    workspace: 'Focus only',
    latency: '42 ms',
    policy: 'Block file shares and require portal review'
  },
  {
    name: 'Hotel Wi-Fi',
    trust: 'guarded',
    vpn: 'Full tunnel',
    dns: 'VPN resolver',
    workspace: 'Ops review',
    latency: '76 ms',
    policy: 'Allow release dashboards, mute discovery'
  },
  {
    name: 'Unknown AP',
    trust: 'blocked',
    vpn: 'Required',
    dns: 'Quarantine',
    workspace: 'No workspace',
    latency: 'n/a',
    policy: 'Hold traffic until user confirms network'
  }
];

const routeRules: RouteRule[] = [
  {
    workspace: 'Build',
    route: 'AUR Packager to package mirrors',
    posture: 'Trusted or VPN required',
    fallback: 'Queue build fetches'
  },
  {
    workspace: 'Ops',
    route: 'Release Console to GitHub',
    posture: 'VPN optional on trusted networks',
    fallback: 'Read-only release status'
  },
  {
    workspace: 'Focus',
    route: 'Docs Reader and Prompt Foundry',
    posture: 'Encrypted DNS required',
    fallback: 'Local docs only'
  }
];

const signals: Signal[] = [
  {
    label: 'VPN',
    value: 'Healthy',
    detail: 'WireGuard peer rotated 14 min ago',
    trust: 'trusted'
  },
  {
    label: 'DNS',
    value: 'Guarded',
    detail: 'Encrypted resolver pinned for public networks',
    trust: 'guarded'
  },
  {
    label: 'Portal',
    value: 'Clear',
    detail: 'No captive portal detected',
    trust: 'trusted'
  },
  {
    label: 'Discovery',
    value: 'Paused',
    detail: 'mDNS disabled outside trusted networks',
    trust: 'blocked'
  }
];

const trustLabels: Record<Trust, string> = {
  trusted: 'Trusted',
  guarded: 'Guarded',
  blocked: 'Blocked'
};

const trustedCount = profiles.filter((profile) => profile.trust === 'trusted').length;
const guardedCount = profiles.filter((profile) => profile.trust === 'guarded').length;
const blockedCount = profiles.filter((profile) => profile.trust === 'blocked').length;
const vpnRequired = profiles.filter((profile) => profile.vpn.includes('Full') || profile.vpn.includes('Required')).length;

export function App() {
  return (
    <main className="shell">
      <section className="mapper" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Network profiles</p>
            <h1 id="page-title">Profile Mapper</h1>
          </div>
          <div className="postureBadge">
            <span />
            VPN posture verified
          </div>
        </header>

        <section className="metrics" aria-label="Network posture summary">
          <article>
            <span>{trustedCount}</span>
            <p>trusted</p>
          </article>
          <article>
            <span>{guardedCount}</span>
            <p>guarded</p>
          </article>
          <article>
            <span>{blockedCount}</span>
            <p>blocked</p>
          </article>
          <article>
            <span>{vpnRequired}</span>
            <p>vpn required</p>
          </article>
        </section>

        <section className="layout">
          <div className="profilePanel">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Known networks</p>
                <h2>Trust map</h2>
              </div>
              <button type="button">Stage Policy</button>
            </div>

            <div className="profileList" role="list" aria-label="Network profile policies">
              {profiles.map((profile) => (
                <article className="profile" data-trust={profile.trust} key={profile.name} role="listitem">
                  <div className="profileTitle">
                    <span>{trustLabels[profile.trust]}</span>
                    <h3>{profile.name}</h3>
                    <p>{profile.policy}</p>
                  </div>
                  <div className="profileMeta">
                    <span>{profile.vpn}</span>
                    <span>{profile.dns}</span>
                    <span>{profile.workspace}</span>
                  </div>
                  <div className="latency">
                    <strong>{profile.latency}</strong>
                    <small>latency</small>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="sideRail">
            <section className="signalsPanel" aria-label="Network signals">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Live signals</p>
                  <h2>Posture</h2>
                </div>
              </div>
              <div className="signalList">
                {signals.map((signal) => (
                  <article data-trust={signal.trust} key={signal.label}>
                    <div>
                      <h3>{signal.label}</h3>
                      <p>{signal.detail}</p>
                    </div>
                    <strong>{signal.value}</strong>
                  </article>
                ))}
              </div>
            </section>

            <section className="rulesPanel" aria-label="Workspace route rules">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Workspace routes</p>
                  <h2>Connectivity rules</h2>
                </div>
              </div>
              <div className="ruleList">
                {routeRules.map((rule) => (
                  <article key={rule.workspace}>
                    <span />
                    <div>
                      <h3>{rule.workspace}</h3>
                      <p>{rule.route}</p>
                      <small>{rule.posture}; {rule.fallback}</small>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </section>
      </section>
    </main>
  );
}
