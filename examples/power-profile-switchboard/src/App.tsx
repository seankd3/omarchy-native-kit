type Mode = 'performance' | 'balanced' | 'saver';

type WorkspaceProfile = {
  workspace: string;
  mode: Mode;
  brightness: number;
  idle: string;
  target: string;
  command: string;
  drain: string;
};

type DeviceSignal = {
  label: string;
  value: string;
  detail: string;
  state: Mode;
};

type Automation = {
  trigger: string;
  action: string;
  guardrail: string;
};

const profiles: WorkspaceProfile[] = [
  {
    workspace: 'Build',
    mode: 'performance',
    brightness: 92,
    idle: 'Stay awake',
    target: 'Release Console, AUR Packager',
    command: 'powerprofilesctl set performance',
    drain: '18% / hr'
  },
  {
    workspace: 'Design',
    mode: 'balanced',
    brightness: 74,
    idle: 'Dim after 12 min',
    target: 'Theme Forge, Native Gallery',
    command: 'powerprofilesctl set balanced',
    drain: '11% / hr'
  },
  {
    workspace: 'Focus',
    mode: 'saver',
    brightness: 48,
    idle: 'Lock after 8 min',
    target: 'Prompt Foundry, Docs Reader',
    command: 'powerprofilesctl set power-saver',
    drain: '6% / hr'
  },
  {
    workspace: 'Ops',
    mode: 'balanced',
    brightness: 68,
    idle: 'Keep alerts visible',
    target: 'Ops Deck, Notification Routing Board',
    command: 'powerprofilesctl set balanced',
    drain: '9% / hr'
  }
];

const deviceSignals: DeviceSignal[] = [
  {
    label: 'Battery',
    value: '63%',
    detail: '2h 44m projected at current mix',
    state: 'balanced'
  },
  {
    label: 'Thermals',
    value: 'Calm',
    detail: 'Fan curve below review threshold',
    state: 'saver'
  },
  {
    label: 'Display',
    value: '74%',
    detail: 'Design workspace owns brightness',
    state: 'balanced'
  },
  {
    label: 'CPU bias',
    value: 'Burst',
    detail: 'Build profile can temporarily boost',
    state: 'performance'
  }
];

const automations: Automation[] = [
  {
    trigger: 'Battery below 25%',
    action: 'Switch non-build workspaces to saver',
    guardrail: 'Ask before dimming during presentation mode'
  },
  {
    trigger: 'Release build starts',
    action: 'Pin Build workspace to performance',
    guardrail: 'Return to previous mode after verifier passes'
  },
  {
    trigger: 'Idle on Focus workspace',
    action: 'Dim display and pause non-urgent alerts',
    guardrail: 'Keep backup and release failures visible'
  }
];

const modeLabels: Record<Mode, string> = {
  performance: 'Performance',
  balanced: 'Balanced',
  saver: 'Saver'
};

const averageBrightness = Math.round(profiles.reduce((sum, profile) => sum + profile.brightness, 0) / profiles.length);
const saverProfiles = profiles.filter((profile) => profile.mode === 'saver').length;
const boostedProfiles = profiles.filter((profile) => profile.mode === 'performance').length;

export function App() {
  return (
    <main className="shell">
      <section className="switchboard" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Power profiles</p>
            <h1 id="page-title">Switchboard</h1>
          </div>
          <div className="activeMode">
            <span />
            Balanced policy armed
          </div>
        </header>

        <section className="metrics" aria-label="Power summary">
          <article>
            <span>{profiles.length}</span>
            <p>workspace profiles</p>
          </article>
          <article>
            <span>{averageBrightness}%</span>
            <p>average brightness</p>
          </article>
          <article>
            <span>{saverProfiles}</span>
            <p>saver route</p>
          </article>
          <article>
            <span>{boostedProfiles}</span>
            <p>boost lane</p>
          </article>
        </section>

        <section className="grid">
          <div className="profilePanel">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Workspace map</p>
                <h2>Profile assignments</h2>
              </div>
              <button type="button">Stage Changes</button>
            </div>

            <div className="profileList" role="list" aria-label="Workspace power profiles">
              {profiles.map((profile) => (
                <article className="profile" data-mode={profile.mode} key={profile.workspace} role="listitem">
                  <div className="profileTitle">
                    <span>{modeLabels[profile.mode]}</span>
                    <h3>{profile.workspace}</h3>
                    <p>{profile.target}</p>
                  </div>

                  <div className="brightness">
                    <div>
                      <strong>{profile.brightness}%</strong>
                      <small>{profile.idle}</small>
                    </div>
                    <div className="meter" aria-label={`${profile.brightness}% brightness`}>
                      <span style={{ inlineSize: `${profile.brightness}%` }} />
                    </div>
                  </div>

                  <div className="commandBlock">
                    <code>{profile.command}</code>
                    <small>{profile.drain}</small>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="sideRail">
            <section className="signalPanel" aria-label="Device signals">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Device signals</p>
                  <h2>Live readout</h2>
                </div>
              </div>
              <div className="signalList">
                {deviceSignals.map((signal) => (
                  <article data-state={signal.state} key={signal.label}>
                    <div>
                      <h3>{signal.label}</h3>
                      <p>{signal.detail}</p>
                    </div>
                    <strong>{signal.value}</strong>
                  </article>
                ))}
              </div>
            </section>

            <section className="automationPanel" aria-label="Automation rules">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Automation</p>
                  <h2>Guardrails</h2>
                </div>
              </div>
              <div className="automationList">
                {automations.map((automation) => (
                  <article key={automation.trigger}>
                    <span />
                    <div>
                      <h3>{automation.trigger}</h3>
                      <p>{automation.action}</p>
                      <small>{automation.guardrail}</small>
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
