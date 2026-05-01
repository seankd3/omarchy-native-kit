type ClipState = 'safe' | 'redacted' | 'review';

type Clip = {
  title: string;
  state: ClipState;
  source: string;
  route: string;
  age: string;
  content: string;
};

type Rule = {
  label: string;
  action: string;
  owner: string;
};

type Pin = {
  label: string;
  value: string;
  detail: string;
};

const clips: Clip[] = [
  {
    title: 'Release command',
    state: 'safe',
    source: 'Release Console',
    route: 'Build workspace',
    age: '3 min',
    content: 'npm run verify:examples:build'
  },
  {
    title: 'API token',
    state: 'redacted',
    source: 'Browser',
    route: 'Credential Session Vault',
    age: '9 min',
    content: 'ghp_••••••••••••••••'
  },
  {
    title: 'Window rule snippet',
    state: 'safe',
    source: 'Window Rule Lab',
    route: 'Config Diff Studio',
    age: '18 min',
    content: 'windowrulev2 = workspace 4,class:^(Code)$'
  },
  {
    title: 'Unknown password field',
    state: 'review',
    source: 'Unknown app',
    route: 'Hold buffer',
    age: '24 min',
    content: '••••••••••••'
  }
];

const pins: Pin[] = [
  {
    label: 'Safe command',
    value: 'verify',
    detail: 'Pinned for release prep only'
  },
  {
    label: 'Theme path',
    value: 'colors.toml',
    detail: 'Allowed in all workspaces'
  },
  {
    label: 'Support note',
    value: 'template',
    detail: 'Expires at session end'
  }
];

const rules: Rule[] = [
  {
    label: 'Secret pattern detected',
    action: 'Redact immediately and route to vault',
    owner: 'Credential Session Vault'
  },
  {
    label: 'Config snippet copied',
    action: 'Open reversible diff lane',
    owner: 'Config Diff Studio'
  },
  {
    label: 'Clipboard crosses workspace',
    action: 'Ask before pasting into untrusted surface',
    owner: 'Workspace Automation Builder'
  }
];

const stateLabels: Record<ClipState, string> = {
  safe: 'Safe',
  redacted: 'Redacted',
  review: 'Review'
};

const safeClips = clips.filter((clip) => clip.state === 'safe').length;
const redactedClips = clips.filter((clip) => clip.state === 'redacted').length;
const reviewClips = clips.filter((clip) => clip.state === 'review').length;

export function App() {
  return (
    <main className="shell">
      <section className="curator" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Clipboard history</p>
            <h1 id="page-title">Clip Curator</h1>
          </div>
          <div className="syncBadge">
            <span />
            secret scan armed
          </div>
        </header>

        <section className="metrics" aria-label="Clipboard summary">
          <article>
            <span>{clips.length}</span>
            <p>recent clips</p>
          </article>
          <article>
            <span>{safeClips}</span>
            <p>safe</p>
          </article>
          <article>
            <span>{redactedClips}</span>
            <p>redacted</p>
          </article>
          <article>
            <span>{reviewClips}</span>
            <p>needs review</p>
          </article>
        </section>

        <section className="layout">
          <div className="clipPanel">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Review lane</p>
                <h2>Recent clipboard items</h2>
              </div>
              <button type="button">Export Policy</button>
            </div>

            <div className="clipList" role="list" aria-label="Clipboard history items">
              {clips.map((clip) => (
                <article className="clip" data-state={clip.state} key={`${clip.title}-${clip.age}`} role="listitem">
                  <div className="clipTitle">
                    <span>{stateLabels[clip.state]}</span>
                    <h3>{clip.title}</h3>
                    <p>{clip.source} · {clip.age}</p>
                  </div>
                  <div className="clipContent">
                    <code>{clip.content}</code>
                    <small>{clip.route}</small>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="sideRail">
            <section className="pinPanel" aria-label="Pinned snippets">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Pinned safe clips</p>
                  <h2>Snippets</h2>
                </div>
              </div>
              <div className="pinList">
                {pins.map((pin) => (
                  <article key={pin.label}>
                    <div>
                      <h3>{pin.label}</h3>
                      <p>{pin.detail}</p>
                    </div>
                    <strong>{pin.value}</strong>
                  </article>
                ))}
              </div>
            </section>

            <section className="rulePanel" aria-label="Clipboard guardrails">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Guardrails</p>
                  <h2>Routing rules</h2>
                </div>
              </div>
              <div className="ruleList">
                {rules.map((rule) => (
                  <article key={rule.label}>
                    <span />
                    <div>
                      <h3>{rule.label}</h3>
                      <p>{rule.action}</p>
                      <small>{rule.owner}</small>
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
