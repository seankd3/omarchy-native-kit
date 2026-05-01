type VpnState = 'active' | 'review' | 'blocked';

type VpnProfile = {
  name: string;
  workspace: string;
  routes: string;
  killSwitch: string;
  rollback: string;
  state: VpnState;
};

type RouteLane = {
  name: string;
  scope: string;
  score: number;
  state: VpnState;
};

type TunnelChange = {
  mode: string;
  behavior: string;
  rollback: string;
  state: VpnState;
};

type VpnProbe = {
  target: string;
  action: string;
  command: string;
  state: VpnState;
};

const profiles: VpnProfile[] = [
  {
    name: 'Work WireGuard',
    workspace: 'VPN research',
    routes: 'corp ranges and split dns',
    killSwitch: 'required outside trusted lan',
    rollback: 'restore previous wg-quick profile',
    state: 'active'
  },
  {
    name: 'Package Mirror Tunnel',
    workspace: 'Build bench',
    routes: 'repo mirrors over private exit',
    killSwitch: 'review before batch updates',
    rollback: 'remove mirror route table',
    state: 'review'
  },
  {
    name: 'Privacy Exit',
    workspace: 'Browser vault',
    routes: 'default route through exit node',
    killSwitch: 'nft output deny fallback',
    rollback: 'drop exit-node mark',
    state: 'active'
  },
  {
    name: 'Legacy OpenVPN',
    workspace: 'Secrets desk',
    routes: 'unknown pushed routes',
    killSwitch: 'missing',
    rollback: 'block autostart profile',
    state: 'blocked'
  }
];

const lanes: RouteLane[] = [
  {
    name: 'Route ownership',
    scope: 'default routes, policy tables, and pushed prefixes',
    score: 76,
    state: 'review'
  },
  {
    name: 'Kill-switch posture',
    scope: 'nft fallback deny, DNS lock, and trusted LAN exceptions',
    score: 88,
    state: 'active'
  },
  {
    name: 'Workspace bindings',
    scope: 'profile selection by workspace, app group, and trust zone',
    score: 64,
    state: 'review'
  }
];

const changes: TunnelChange[] = [
  {
    mode: 'WireGuard handoff',
    behavior: 'bind research workspace to wg0 routes and split DNS domains',
    rollback: 'wg-quick down wg0 and restore saved config',
    state: 'active'
  },
  {
    mode: 'Exit-node fallback',
    behavior: 'keep browser traffic denied if the privacy exit drops',
    rollback: 'remove nft fallback chain',
    state: 'review'
  },
  {
    mode: 'Legacy quarantine',
    behavior: 'block OpenVPN autostart until pushed routes and DNS are named',
    rollback: 'restore autostart after route audit',
    state: 'blocked'
  }
];

const probes: VpnProbe[] = [
  {
    target: 'WireGuard state',
    action: 'Inspect peers, latest handshakes, and endpoint ownership',
    command: 'sudo wg show',
    state: 'active'
  },
  {
    target: 'Route tables',
    action: 'Compare default routes, policy rules, and tunnel-owned prefixes',
    command: 'ip route show table all',
    state: 'review'
  },
  {
    target: 'Kill switch',
    action: 'Confirm fallback deny rules remain loaded when the tunnel drops',
    command: 'sudo nft list chain inet omarchy vpn_killswitch',
    state: 'review'
  },
  {
    target: 'Legacy push',
    action: 'Block profiles that still push unnamed routes into sensitive workspaces',
    command: 'grep -R \"redirect-gateway\" /etc/openvpn',
    state: 'blocked'
  }
];

const stateLabels: Record<VpnState, string> = {
  active: 'Active',
  review: 'Review',
  blocked: 'Blocked'
};

const activeCount = profiles.filter((profile) => profile.state === 'active').length;
const reviewCount = profiles.filter((profile) => profile.state === 'review').length;
const blockedCount = profiles.filter((profile) => profile.state === 'blocked').length;

export function App() {
  return (
    <main className="shell">
      <section className="lab" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">VPN policy</p>
            <h1 id="page-title">Profile Coordinator</h1>
          </div>
          <button type="button">Stage Tunnel Change</button>
        </header>

        <section className="metrics" aria-label="VPN profile summary">
          <article>
            <span>{profiles.length}</span>
            <p>profiles inspected</p>
          </article>
          <article>
            <span>{activeCount}</span>
            <p>active</p>
          </article>
          <article>
            <span>{reviewCount}</span>
            <p>needs review</p>
          </article>
          <article>
            <span>{blockedCount}</span>
            <p>blocked</p>
          </article>
        </section>

        <section className="layout">
          <section className="profilePanel" aria-label="VPN profile matrix">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Profile matrix</p>
                <h2>VPN profiles, route ownership, kill-switch posture, workspace bindings, and rollback plans</h2>
              </div>
              <div className="profileBadge">
                <span />
                route-owned
              </div>
            </div>

            <div className="profileRows" role="list">
              {profiles.map((profile) => (
                <article className="profileRow" data-state={profile.state} key={profile.name} role="listitem" tabIndex={0}>
                  <div className="profileTitle">
                    <span>{stateLabels[profile.state]}</span>
                    <h3>{profile.name}</h3>
                    <p>{profile.workspace}</p>
                  </div>
                  <div className="profileMeta">
                    <div>
                      <small>routes</small>
                      <strong>{profile.routes}</strong>
                    </div>
                    <div>
                      <small>kill switch</small>
                      <strong>{profile.killSwitch}</strong>
                    </div>
                    <div>
                      <small>rollback</small>
                      <strong>{profile.rollback}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="sideRail">
            <section className="previewPanel" aria-label="VPN profile route preview">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Preview</p>
                  <h2>Tunnel route</h2>
                </div>
              </div>
              <pre aria-label="VPN route preview">{`workspace binding
  -> vpn profile selected
  -> route ownership checked
  -> kill switch confirmed
  -> dns route compared
  -> rollback profile retained`}</pre>
            </section>

            <section className="lanePanel" aria-label="VPN route planning lanes">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Coverage</p>
                  <h2>Route lanes</h2>
                </div>
              </div>
              <div className="laneList">
                {lanes.map((lane) => (
                  <article data-state={lane.state} key={lane.name}>
                    <div>
                      <span>{stateLabels[lane.state]}</span>
                      <h3>{lane.name}</h3>
                      <p>{lane.scope}</p>
                    </div>
                    <meter min="0" max="100" value={lane.score} aria-label={`${lane.name} coverage`} />
                  </article>
                ))}
              </div>
            </section>

            <section className="changePanel" aria-label="Rollback-safe VPN changes">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Changes</p>
                  <h2>Tunnel edits</h2>
                </div>
              </div>
              <div className="changeList">
                {changes.map((change) => (
                  <article data-state={change.state} key={change.mode}>
                    <span>{stateLabels[change.state]}</span>
                    <h3>{change.mode}</h3>
                    <p>{change.behavior}</p>
                    <strong>{change.rollback}</strong>
                  </article>
                ))}
              </div>
            </section>

            <section className="probePanel" aria-label="Staged VPN probes">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Staged probes</p>
                  <h2>Review commands</h2>
                </div>
              </div>
              <div className="probeList">
                {probes.map((probe) => (
                  <article data-state={probe.state} key={probe.target}>
                    <span>{stateLabels[probe.state]}</span>
                    <h3>{probe.target}</h3>
                    <p>{probe.action}</p>
                    <code>{probe.command}</code>
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
