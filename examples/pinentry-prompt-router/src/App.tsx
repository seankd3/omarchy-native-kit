type PromptState = 'ready' | 'review' | 'blocked';

type PinentryVariant = {
  name: string;
  binary: string;
  surface: string;
  fallback: string;
  state: PromptState;
};

type PromptRoute = {
  request: string;
  source: string;
  route: string;
  cache: string;
  state: PromptState;
};

type Boundary = {
  title: string;
  policy: string;
  rollback: string;
  state: PromptState;
};

type Probe = {
  label: string;
  command: string;
  note: string;
  state: PromptState;
};

const variants: PinentryVariant[] = [
  {
    name: 'Desktop prompt',
    binary: 'pinentry-gnome3',
    surface: 'Wayland desktop',
    fallback: 'pinentry-gtk-2',
    state: 'ready'
  },
  {
    name: 'Terminal prompt',
    binary: 'pinentry-curses',
    surface: 'TTY and SSH sessions',
    fallback: 'pinentry-tty',
    state: 'review'
  },
  {
    name: 'Qt prompt',
    binary: 'pinentry-qt',
    surface: 'Qt apps and mixed sessions',
    fallback: 'desktop prompt',
    state: 'ready'
  },
  {
    name: 'Missing fallback',
    binary: 'pinentry-emacs',
    surface: 'editor subprocess',
    fallback: 'not installed',
    state: 'blocked'
  }
];

const routes: PromptRoute[] = [
  {
    request: 'Git signing',
    source: 'terminal workspace',
    route: 'pinentry-curses',
    cache: '15 minute confirm',
    state: 'review'
  },
  {
    request: 'Mail decrypt',
    source: 'desktop client',
    route: 'pinentry-gnome3',
    cache: 'session scoped',
    state: 'ready'
  },
  {
    request: 'Release signing',
    source: 'build shell',
    route: 'pinentry-curses with touch policy',
    cache: 'no shared cache',
    state: 'ready'
  },
  {
    request: 'Editor commit',
    source: 'emacsclient',
    route: 'missing emacs pinentry',
    cache: 'unknown',
    state: 'blocked'
  }
];

const boundaries: Boundary[] = [
  {
    title: 'TTY fallback',
    policy: 'route SSH and bare TTY prompts to curses before desktop handoff',
    rollback: 'restore previous pinentry-program line',
    state: 'review'
  },
  {
    title: 'Cache separation',
    policy: 'split release signing prompts from general decrypt cache windows',
    rollback: 'restore default-cache-ttl',
    state: 'ready'
  },
  {
    title: 'Editor integration',
    policy: 'disable missing emacs route until binary and env vars are present',
    rollback: 'keep editor on desktop prompt path',
    state: 'blocked'
  }
];

const probes: Probe[] = [
  {
    label: 'Program',
    command: 'gpgconf --list-options gpg-agent | rg pinentry-program',
    note: 'inspect configured pinentry binary before changing routes',
    state: 'ready'
  },
  {
    label: 'TTY',
    command: 'printf "%s\\n" "$GPG_TTY"',
    note: 'confirm TTY export for shell prompts',
    state: 'review'
  },
  {
    label: 'Reload',
    command: 'gpgconf --reload gpg-agent',
    note: 'stage reload only after config and rollback review',
    state: 'ready'
  },
  {
    label: 'Fallbacks',
    command: 'command -v pinentry-gnome3 pinentry-curses pinentry-tty',
    note: 'verify installed prompt variants',
    state: 'blocked'
  }
];

const stateLabels: Record<PromptState, string> = {
  ready: 'Ready',
  review: 'Review',
  blocked: 'Blocked'
};

const readyCount = variants.filter((variant) => variant.state === 'ready').length;
const reviewCount = routes.filter((route) => route.state === 'review').length;
const blockedCount = variants.filter((variant) => variant.state === 'blocked').length;
const boundaryCount = boundaries.length;

export function App() {
  return (
    <main className="shell">
      <section className="workspace" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Pinentry routing</p>
            <h1 id="page-title">Prompt Router</h1>
          </div>
          <button type="button">Stage Route</button>
        </header>

        <section className="metrics" aria-label="Pinentry prompt routing summary">
          <article>
            <span>{variants.length}</span>
            <p>variants</p>
          </article>
          <article>
            <span>{readyCount}</span>
            <p>ready routes</p>
          </article>
          <article>
            <span>{reviewCount + boundaryCount}</span>
            <p>review items</p>
          </article>
          <article>
            <span>{blockedCount}</span>
            <p>blocked fallback</p>
          </article>
        </section>

        <section className="layout">
          <section className="variantPanel" aria-label="Pinentry variants">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Variant map</p>
                <h2>Pinentry variants, desktop prompt routing, TTY fallback behavior, passphrase cache boundaries, and rollback-safe prompt changes</h2>
              </div>
              <div className="statusBadge">
                <span />
                prompt scoped
              </div>
            </div>

            <div className="variantRows" role="list">
              {variants.map((variant) => (
                <article className="variantRow" data-state={variant.state} key={variant.binary} role="listitem" tabIndex={0}>
                  <div className="variantTitle">
                    <span>{stateLabels[variant.state]}</span>
                    <h3>{variant.name}</h3>
                    <p>{variant.binary}</p>
                  </div>
                  <div className="variantMeta">
                    <div>
                      <small>surface</small>
                      <strong>{variant.surface}</strong>
                    </div>
                    <div>
                      <small>fallback</small>
                      <strong>{variant.fallback}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="sideRail">
            <section className="routePanel" aria-label="Prompt request routes">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Requests</p>
                  <h2>Prompt routes</h2>
                </div>
              </div>
              <div className="routeList">
                {routes.map((route) => (
                  <article data-state={route.state} key={route.request}>
                    <span>{stateLabels[route.state]}</span>
                    <h3>{route.request}</h3>
                    <p>{route.source}</p>
                    <strong>{route.route}</strong>
                    <small>{route.cache}</small>
                  </article>
                ))}
              </div>
            </section>

            <section className="boundaryPanel" aria-label="Passphrase cache boundaries">
              <div className="panelHeader compact">
                <div>
                  <p className="eyebrow">Boundaries</p>
                  <h2>Cache policy</h2>
                </div>
              </div>
              <div className="boundaryList">
                {boundaries.map((boundary) => (
                  <article data-state={boundary.state} key={boundary.title}>
                    <span>{stateLabels[boundary.state]}</span>
                    <h3>{boundary.title}</h3>
                    <p>{boundary.policy}</p>
                    <strong>{boundary.rollback}</strong>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </section>

        <section className="probePanel" aria-label="Pinentry inspection commands">
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
