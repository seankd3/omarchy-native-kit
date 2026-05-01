type RecipeState = 'armed' | 'draft' | 'blocked';

type Recipe = {
  name: string;
  state: RecipeState;
  trigger: string;
  launch: string;
  hook: string;
  rollback: string;
};

type HookCheck = {
  label: string;
  command: string;
  result: string;
};

type Guardrail = {
  trigger: string;
  action: string;
  owner: string;
};

const recipes: Recipe[] = [
  {
    name: 'Morning Ops',
    state: 'armed',
    trigger: 'First unlock before 10:00',
    launch: 'Ops Deck, Signal Desk, App Health Monitor',
    hook: 'theme sync + catalog refresh',
    rollback: 'Close staged apps only'
  },
  {
    name: 'Build Sprint',
    state: 'draft',
    trigger: 'Workspace 3 selected',
    launch: 'Release Console, AUR Packager',
    hook: 'power performance + notifications live',
    rollback: 'Restore balanced power profile'
  },
  {
    name: 'Deep Focus',
    state: 'armed',
    trigger: 'Focus timer starts',
    launch: 'Prompt Foundry, Docs Reader',
    hook: 'quiet hours + audio mixer preset',
    rollback: 'Re-enable non-critical alerts'
  },
  {
    name: 'External Display',
    state: 'blocked',
    trigger: 'Dock attached',
    launch: 'Display Layout Planner',
    hook: 'apply monitor layout',
    rollback: 'Needs display trust confirmation'
  }
];

const hookChecks: HookCheck[] = [
  {
    label: 'Theme hook',
    command: 'omarchy-native app hook ./examples/ops-deck',
    result: 'safe script'
  },
  {
    label: 'Desktop launcher',
    command: 'omarchy-native app desktop ./examples/release-console',
    result: 'preview only'
  },
  {
    label: 'Contract gate',
    command: 'omarchy-native verify --all examples',
    result: '27/27 green'
  }
];

const guardrails: Guardrail[] = [
  {
    trigger: 'Recipe launches more than three apps',
    action: 'Require confirmation before applying',
    owner: 'Session Restore Planner'
  },
  {
    trigger: 'Hook mutates display, input, or network state',
    action: 'Link rollback command before export',
    owner: 'Config Diff Studio'
  },
  {
    trigger: 'Automation changes notification routing',
    action: 'Check quiet hours and escalation routes',
    owner: 'Notification Routing Board'
  }
];

const stateLabels: Record<RecipeState, string> = {
  armed: 'Armed',
  draft: 'Draft',
  blocked: 'Blocked'
};

const armedRecipes = recipes.filter((recipe) => recipe.state === 'armed').length;
const draftRecipes = recipes.filter((recipe) => recipe.state === 'draft').length;
const blockedRecipes = recipes.filter((recipe) => recipe.state === 'blocked').length;

export function App() {
  return (
    <main className="shell">
      <section className="builder" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Workspace automation</p>
            <h1 id="page-title">Recipe Builder</h1>
          </div>
          <div className="syncBadge">
            <span />
            rollback-first mode
          </div>
        </header>

        <section className="metrics" aria-label="Automation summary">
          <article>
            <span>{recipes.length}</span>
            <p>recipes</p>
          </article>
          <article>
            <span>{armedRecipes}</span>
            <p>armed</p>
          </article>
          <article>
            <span>{draftRecipes}</span>
            <p>draft</p>
          </article>
          <article>
            <span>{blockedRecipes}</span>
            <p>blocked</p>
          </article>
        </section>

        <section className="layout">
          <div className="recipePanel">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Recipe canvas</p>
                <h2>Staged automations</h2>
              </div>
              <button type="button">Export Recipe</button>
            </div>

            <div className="recipeList" role="list" aria-label="Workspace automation recipes">
              {recipes.map((recipe) => (
                <article className="recipe" data-state={recipe.state} key={recipe.name} role="listitem">
                  <div className="recipeTitle">
                    <span>{stateLabels[recipe.state]}</span>
                    <h3>{recipe.name}</h3>
                    <p>{recipe.trigger}</p>
                  </div>
                  <div className="recipeMeta">
                    <span>{recipe.launch}</span>
                    <span>{recipe.hook}</span>
                    <span>{recipe.rollback}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="sideRail">
            <section className="hookPanel" aria-label="Hook checks">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Hook checks</p>
                  <h2>Generated commands</h2>
                </div>
              </div>
              <div className="hookList">
                {hookChecks.map((check) => (
                  <article key={check.label}>
                    <div>
                      <h3>{check.label}</h3>
                      <code>{check.command}</code>
                    </div>
                    <strong>{check.result}</strong>
                  </article>
                ))}
              </div>
            </section>

            <section className="guardPanel" aria-label="Automation guardrails">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Guardrails</p>
                  <h2>Rollback checks</h2>
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
