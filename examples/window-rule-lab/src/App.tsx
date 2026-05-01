import { useMemo, useState } from 'react';

type WindowSample = {
  app: string;
  title: string;
  className: string;
  workspace: string;
  state: 'floating' | 'tiled' | 'scratch';
};

type DraftRule = {
  name: string;
  match: 'class' | 'title' | 'state';
  value: string;
  action: string;
  risk: 'safe' | 'review' | 'danger';
};

const windows: WindowSample[] = [
  { app: 'Kit Docs', title: 'README.md - Docs Reader', className: 'docs-reader', workspace: '2', state: 'tiled' },
  { app: 'Theme Forge', title: 'Token export preview', className: 'theme-forge', workspace: '3', state: 'floating' },
  { app: 'Signal Desk', title: 'Release checks', className: 'signal-desk', workspace: '1', state: 'tiled' },
  { app: 'Scratch Terminal', title: 'journalctl follow', className: 'Alacritty', workspace: 'scratch', state: 'scratch' }
];

const draftRules: DraftRule[] = [
  {
    name: 'Pin docs to workspace 2',
    match: 'class',
    value: 'docs-reader',
    action: 'move to workspace 2',
    risk: 'safe'
  },
  {
    name: 'Float token previews',
    match: 'title',
    value: 'preview',
    action: 'float centered',
    risk: 'review'
  },
  {
    name: 'Catch every scratch window',
    match: 'state',
    value: 'scratch',
    action: 'send to scratchpad',
    risk: 'safe'
  },
  {
    name: 'Broad terminal override',
    match: 'class',
    value: 'term',
    action: 'force workspace 9',
    risk: 'danger'
  }
];

const riskClass: Record<DraftRule['risk'], string> = {
  safe: 'safe',
  review: 'review',
  danger: 'danger'
};

export function App() {
  const [activeRuleIndex, setActiveRuleIndex] = useState(0);
  const activeRule = draftRules[activeRuleIndex];
  const matches = useMemo(() => windows.filter((window) => matchesRule(window, activeRule)), [activeRule]);
  const safeCount = draftRules.filter((rule) => rule.risk === 'safe').length;

  return (
    <main className="shell">
      <section className="workspace" aria-label="Window rule lab">
        <div className="topbar">
          <span className="app-id">window.rule.lab</span>
          <span className="state">{matches.length} matches</span>
        </div>

        <section className="brief" aria-labelledby="brief-title">
          <div>
            <p className="eyebrow">Rule staging</p>
            <h1 id="brief-title">Draft window rules before they touch config.</h1>
          </div>
          <div className="meter" aria-label={`${safeCount} safe draft rules`}>
            <strong>{safeCount}</strong>
            <span>safe drafts</span>
          </div>
        </section>

        <div className="labGrid">
          <div className="ruleList" role="list" aria-label="Draft rules">
            {draftRules.map((rule, index) => (
              <button
                className={`ruleRow ${index === activeRuleIndex ? 'selected' : ''}`}
                key={rule.name}
                onClick={() => setActiveRuleIndex(index)}
                type="button"
              >
                <span>
                  <strong>{rule.name}</strong>
                  <small>
                    {rule.match} contains {rule.value}
                  </small>
                </span>
                <em className={riskClass[rule.risk]}>{rule.risk}</em>
              </button>
            ))}
          </div>

          <section className="preview" aria-label="Rule match preview">
            <div className="previewHeader">
              <span>{activeRule.action}</span>
              <strong>{matches.length}/{windows.length}</strong>
            </div>

            <div className="windowTable">
              {windows.map((window) => {
                const matched = matches.includes(window);
                return (
                  <div className={`windowRow ${matched ? 'matched' : ''}`} key={`${window.app}-${window.title}`}>
                    <span>
                      <strong>{window.app}</strong>
                      <small>{window.title}</small>
                    </span>
                    <code>{window.className}</code>
                    <b>{matched ? 'match' : 'skip'}</b>
                  </div>
                );
              })}
            </div>
          </section>

          <aside className="inspector" aria-label="Rule safety inspector">
            <div className="ruleCard">
              <span>{activeRule.risk}</span>
              <strong>{activeRule.name}</strong>
            </div>

            <dl>
              <div>
                <dt>Matcher</dt>
                <dd>
                  {activeRule.match} contains <code>{activeRule.value}</code>
                </dd>
              </div>
              <div>
                <dt>Action</dt>
                <dd>{activeRule.action}</dd>
              </div>
              <div>
                <dt>Safety cue</dt>
                <dd>{safetyCue(activeRule, matches.length)}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
    </main>
  );
}

function matchesRule(window: WindowSample, rule: DraftRule) {
  const haystack = rule.match === 'class' ? window.className : rule.match === 'title' ? window.title : window.state;
  return haystack.toLowerCase().includes(rule.value.toLowerCase());
}

function safetyCue(rule: DraftRule, matchCount: number) {
  if (matchCount === 0) return 'No current windows match; test with a live sample before exporting.';
  if (rule.risk === 'danger') return 'Matcher is broad or action is disruptive; narrow it before applying.';
  if (rule.risk === 'review') return 'Review affected windows and confirm the action is reversible.';
  return 'Rule has a narrow matcher and predictable target.';
}
