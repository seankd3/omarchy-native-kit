type DeviceState = 'active' | 'staged' | 'needs-review';

type InputDevice = {
  name: string;
  type: string;
  state: DeviceState;
  layout: string;
  repeat: string;
  workspace: string;
  command: string;
};

type Variant = {
  label: string;
  value: string;
  detail: string;
};

type Guardrail = {
  trigger: string;
  action: string;
  owner: string;
};

const devices: InputDevice[] = [
  {
    name: 'Moonlander',
    type: 'keyboard',
    state: 'active',
    layout: 'us/colemak-dh',
    repeat: 'delay 220, rate 42',
    workspace: 'Build, Focus',
    command: 'hyprctl keyword input:kb_layout us'
  },
  {
    name: 'ThinkPad TrackPoint',
    type: 'pointer',
    state: 'staged',
    layout: 'natural scroll off',
    repeat: 'accel 0.28',
    workspace: 'Docs',
    command: 'hyprctl keyword input:accel_profile adaptive'
  },
  {
    name: 'Drawing Tablet',
    type: 'tablet',
    state: 'needs-review',
    layout: 'absolute mapped',
    repeat: 'pressure curve soft',
    workspace: 'Design',
    command: 'hyprctl keyword device:wacom:transform 0'
  },
  {
    name: 'Travel Keyboard',
    type: 'keyboard',
    state: 'staged',
    layout: 'us/intl',
    repeat: 'delay 260, rate 36',
    workspace: 'Mobile Ops',
    command: 'hyprctl keyword input:kb_variant intl'
  }
];

const variants: Variant[] = [
  {
    label: 'Primary typing',
    value: 'colemak-dh',
    detail: 'Fast repeat and caps-to-escape enabled'
  },
  {
    label: 'Pairing session',
    value: 'us',
    detail: 'Default layout with slower repeat for shared desks'
  },
  {
    label: 'Writing mode',
    value: 'intl',
    detail: 'Dead keys enabled, shortcuts unchanged'
  }
];

const guardrails: Guardrail[] = [
  {
    trigger: 'Keyboard layout changes',
    action: 'Keep rollback binding on Super+Esc',
    owner: 'Shortcut Trainer'
  },
  {
    trigger: 'Pointer acceleration staged',
    action: 'Require 30 second movement check',
    owner: 'Focus Flight Recorder'
  },
  {
    trigger: 'Tablet mapping changes',
    action: 'Preview against active display layout',
    owner: 'Display Layout Planner'
  }
];

const stateLabels: Record<DeviceState, string> = {
  active: 'Active',
  staged: 'Staged',
  'needs-review': 'Review'
};

const activeDevices = devices.filter((device) => device.state === 'active').length;
const stagedDevices = devices.filter((device) => device.state === 'staged').length;
const reviewDevices = devices.filter((device) => device.state === 'needs-review').length;

export function App() {
  return (
    <main className="shell">
      <section className="studio" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Input methods</p>
            <h1 id="page-title">Input Studio</h1>
          </div>
          <div className="syncBadge">
            <span />
            Rollback binding ready
          </div>
        </header>

        <section className="metrics" aria-label="Input summary">
          <article>
            <span>{devices.length}</span>
            <p>known devices</p>
          </article>
          <article>
            <span>{activeDevices}</span>
            <p>active profile</p>
          </article>
          <article>
            <span>{stagedDevices}</span>
            <p>staged changes</p>
          </article>
          <article>
            <span>{reviewDevices}</span>
            <p>needs review</p>
          </article>
        </section>

        <section className="layout">
          <div className="devicePanel">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Device workbench</p>
                <h2>Profiles before apply</h2>
              </div>
              <button type="button">Export Diff</button>
            </div>

            <div className="deviceList" role="list" aria-label="Input device profiles">
              {devices.map((device) => (
                <article className="device" data-state={device.state} key={device.name} role="listitem">
                  <div className="deviceTitle">
                    <span>{stateLabels[device.state]}</span>
                    <h3>{device.name}</h3>
                    <p>{device.type}</p>
                  </div>
                  <div className="deviceMeta">
                    <span>{device.layout}</span>
                    <span>{device.repeat}</span>
                    <span>{device.workspace}</span>
                  </div>
                  <code>{device.command}</code>
                </article>
              ))}
            </div>
          </div>

          <aside className="sideRail">
            <section className="variantPanel" aria-label="Layout variants">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Layout variants</p>
                  <h2>Mode presets</h2>
                </div>
              </div>
              <div className="variantList">
                {variants.map((variant) => (
                  <article key={variant.label}>
                    <div>
                      <h3>{variant.label}</h3>
                      <p>{variant.detail}</p>
                    </div>
                    <strong>{variant.value}</strong>
                  </article>
                ))}
              </div>
            </section>

            <section className="guardPanel" aria-label="Input guardrails">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Guardrails</p>
                  <h2>Apply checks</h2>
                </div>
              </div>
              <div className="guardList">
                {guardrails.map((guardrail) => (
                  <article key={guardrail.trigger}>
                    <span />
                    <div>
                      <h3>{guardrail.trigger}</h3>
                      <p>{guardrail.action}</p>
                      <small>{guardrail.owner}</small>
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
