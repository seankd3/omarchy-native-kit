type DisplayState = 'primary' | 'warm' | 'standby';

type Display = {
  name: string;
  state: DisplayState;
  resolution: string;
  scale: string;
  temperature: string;
  workspaces: string;
  placement: string;
};

type LayoutRule = {
  label: string;
  command: string;
  guardrail: string;
};

type Signal = {
  label: string;
  value: string;
  detail: string;
  state: DisplayState;
};

const displays: Display[] = [
  {
    name: 'Studio 4K',
    state: 'primary',
    resolution: '3840 x 2160',
    scale: '150%',
    temperature: '5200K',
    workspaces: 'Build, Ops',
    placement: 'center'
  },
  {
    name: 'Side Portrait',
    state: 'warm',
    resolution: '1440 x 2560',
    scale: '125%',
    temperature: '4600K',
    workspaces: 'Docs, Chat',
    placement: 'left rotated'
  },
  {
    name: 'Projector',
    state: 'standby',
    resolution: '1920 x 1080',
    scale: '100%',
    temperature: '6500K',
    workspaces: 'Presentation',
    placement: 'disabled until docked'
  }
];

const rules: LayoutRule[] = [
  {
    label: 'Desk docked',
    command: 'hyprctl keyword monitor DP-1,3840x2160@144,0x0,1.5',
    guardrail: 'Preview before moving active Build workspace'
  },
  {
    label: 'Evening focus',
    command: 'hyprsunset temperature 4600',
    guardrail: 'Skip while color review app is focused'
  },
  {
    label: 'Presentation',
    command: 'hyprctl dispatch moveworkspacetomonitor 8 HDMI-A-1',
    guardrail: 'Confirm projector is trusted before apply'
  }
];

const signals: Signal[] = [
  {
    label: 'Layout',
    value: '3 heads',
    detail: 'Two active, one staged standby',
    state: 'primary'
  },
  {
    label: 'Scaling',
    value: 'Mixed',
    detail: 'No fractional overlap warnings',
    state: 'warm'
  },
  {
    label: 'Temperature',
    value: '5200K',
    detail: 'Warms after sunset profile',
    state: 'warm'
  },
  {
    label: 'Apply risk',
    value: 'Low',
    detail: 'Workspace moves are reversible',
    state: 'primary'
  }
];

const stateLabels: Record<DisplayState, string> = {
  primary: 'Primary',
  warm: 'Warm',
  standby: 'Standby'
};

const activeDisplays = displays.filter((display) => display.state !== 'standby').length;
const stagedDisplays = displays.filter((display) => display.state === 'standby').length;
const workspaceCount = displays.reduce((sum, display) => sum + display.workspaces.split(',').length, 0);

export function App() {
  return (
    <main className="shell">
      <section className="planner" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Display layout</p>
            <h1 id="page-title">Layout Planner</h1>
          </div>
          <div className="syncBadge">
            <span />
            Preview safe
          </div>
        </header>

        <section className="metrics" aria-label="Display summary">
          <article>
            <span>{activeDisplays}</span>
            <p>active displays</p>
          </article>
          <article>
            <span>{stagedDisplays}</span>
            <p>staged standby</p>
          </article>
          <article>
            <span>{workspaceCount}</span>
            <p>workspace lanes</p>
          </article>
          <article>
            <span>0</span>
            <p>overlap warnings</p>
          </article>
        </section>

        <section className="layout">
          <div className="displayPanel">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Monitor map</p>
                <h2>Planned arrangement</h2>
              </div>
              <button type="button">Stage Apply</button>
            </div>

            <div className="displayList" role="list" aria-label="Display layout plans">
              {displays.map((display) => (
                <article className="display" data-state={display.state} key={display.name} role="listitem">
                  <div className="displayTitle">
                    <span>{stateLabels[display.state]}</span>
                    <h3>{display.name}</h3>
                    <p>{display.placement}</p>
                  </div>
                  <div className="displayMeta">
                    <span>{display.resolution}</span>
                    <span>{display.scale}</span>
                    <span>{display.temperature}</span>
                  </div>
                  <div className="workspaceBlock">
                    <strong>{display.workspaces}</strong>
                    <small>assigned workspaces</small>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="sideRail">
            <section className="signalsPanel" aria-label="Display signals">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Live signals</p>
                  <h2>Readiness</h2>
                </div>
              </div>
              <div className="signalList">
                {signals.map((signal) => (
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

            <section className="rulesPanel" aria-label="Layout rules">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Apply rules</p>
                  <h2>Commands</h2>
                </div>
              </div>
              <div className="ruleList">
                {rules.map((rule) => (
                  <article key={rule.label}>
                    <span />
                    <div>
                      <h3>{rule.label}</h3>
                      <code>{rule.command}</code>
                      <small>{rule.guardrail}</small>
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
