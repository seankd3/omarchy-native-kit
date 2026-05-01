type Tone = 'gap' | 'watch' | 'ready' | 'hold';

type Scope = {
  name: string;
  population: string;
  resource: string;
  owner: string;
  reviewers: string;
  status: string;
  tone: Tone;
};

type Filter = {
  label: string;
  rule: string;
  count: string;
  concern: string;
  tone: Tone;
};

type Coverage = {
  reviewer: string;
  portfolio: string;
  assigned: string;
  coverage: string;
};

type Correction = {
  step: string;
  target: string;
  guardrail: string;
  window: string;
};

const metrics = [
  { label: 'certification scopes', value: '24', tone: 'ready' },
  { label: 'coverage gaps', value: '6', tone: 'gap' },
  { label: 'excluded accounts', value: '118', tone: 'watch' },
  { label: 'sampling windows', value: '4', tone: 'hold' }
] satisfies Array<{ label: string; value: string; tone: Tone }>;

const scopes: Scope[] = [
  {
    name: 'Finance privileged readers',
    population: 'Employees in finance cost centers',
    resource: 'Warehouse marts',
    owner: 'Rina Patel',
    reviewers: '9 of 11 mapped',
    status: 'owner gap',
    tone: 'gap'
  },
  {
    name: 'Support emergency access',
    population: 'On-call support leads',
    resource: 'Escalation console',
    owner: 'Marisol Chen',
    reviewers: 'all mapped',
    status: 'sample active',
    tone: 'watch'
  },
  {
    name: 'Vendor network access',
    population: 'Active sponsored contractors',
    resource: 'VPN groups',
    owner: 'Jon Bell',
    reviewers: 'sponsor mapped',
    status: 'exception hold',
    tone: 'hold'
  },
  {
    name: 'Release signing authority',
    population: 'Release captains and backups',
    resource: 'Artifact registry',
    owner: 'Avery Kim',
    reviewers: 'all mapped',
    status: 'ready',
    tone: 'ready'
  }
];

const filters: Filter[] = [
  {
    label: 'Population filter',
    rule: 'department = finance AND employment = active',
    count: '412 accounts',
    concern: 'missing acquisition cost center',
    tone: 'gap'
  },
  {
    label: 'Excluded accounts',
    rule: 'service accounts, break-glass, litigation hold',
    count: '118 excluded',
    concern: 'needs owner rationale on 14',
    tone: 'watch'
  },
  {
    label: 'Sampling window',
    rule: '15 percent sample across high-risk roles',
    count: '62 sampled',
    concern: 'locks May 03 at 09:00',
    tone: 'hold'
  }
];

const coverage: Coverage[] = [
  {
    reviewer: 'Nina Walsh',
    portfolio: 'Finance access',
    assigned: '84 decisions',
    coverage: '92 percent'
  },
  {
    reviewer: 'Cal Mateo',
    portfolio: 'Support operations',
    assigned: '71 decisions',
    coverage: '100 percent'
  },
  {
    reviewer: 'Priya Rao',
    portfolio: 'Vendor programs',
    assigned: '46 decisions',
    coverage: '77 percent'
  }
];

const corrections: Correction[] = [
  {
    step: 'Normalize population filters against HR source',
    target: 'Finance privileged readers',
    guardrail: 'snapshot pre-correction account set',
    window: 'today 13:00'
  },
  {
    step: 'Assign alternate reviewer for excluded accounts',
    target: 'Vendor network access',
    guardrail: 'keep sponsor rationale attached',
    window: 'today 15:00'
  },
  {
    step: 'Re-run sampling after owner correction',
    target: 'Support emergency access',
    guardrail: 'preserve original sample manifest',
    window: 'May 02'
  }
];

const rollbackSteps = [
  'Save the original scope definition and account population',
  'Apply correction to a draft certification first',
  'Compare reviewer coverage before publishing changes',
  'Keep the old scope restorable until decisions are sealed'
];

function toneLabel(tone: Tone) {
  return {
    gap: 'gap',
    watch: 'watch',
    ready: 'ready',
    hold: 'hold'
  }[tone];
}

export function App() {
  return (
    <main className="shell">
      <section className="masthead" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">Access certification</p>
          <h1 id="page-title">Scope mapper for review accuracy.</h1>
          <p className="lede">
            Inspect certification scopes, population filters, excluded accounts, resource ownership,
            reviewer coverage, sampling windows, and rollback-safe scope corrections.
          </p>
        </div>

        <div className="actions" aria-label="Scope actions">
          <button type="button">Publish draft</button>
          <button type="button">Export scope map</button>
        </div>
      </section>

      <section className="metrics" aria-label="Certification scope summary">
        {metrics.map((metric) => (
          <article className="metric" data-tone={metric.tone} key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </article>
        ))}
      </section>

      <section className="mapper-layout">
        <div className="panel scope-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Scopes</p>
              <h2>Certification map</h2>
            </div>
            <span>draft corrections</span>
          </div>

          <div className="scope-list" role="list" aria-label="Certification scopes">
            {scopes.map((scope) => (
              <button className="scope-row" data-tone={scope.tone} key={scope.name} type="button">
                <span className="status-dot" aria-hidden="true" />
                <span>
                  <strong>{scope.name}</strong>
                  <small>{scope.population}</small>
                </span>
                <span>{scope.resource}</span>
                <span>{scope.owner}</span>
                <em>{scope.reviewers}</em>
                <small>{scope.status}</small>
              </button>
            ))}
          </div>
        </div>

        <aside className="panel filter-panel" aria-label="Population filters and exclusions">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Filters</p>
              <h2>Population logic</h2>
            </div>
          </div>

          <div className="filter-list">
            {filters.map((filter) => (
              <article className="filter-card" data-tone={filter.tone} key={filter.label}>
                <span>{toneLabel(filter.tone)}</span>
                <strong>{filter.label}</strong>
                <p>{filter.rule}</p>
                <small>{filter.count}</small>
                <em>{filter.concern}</em>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="detail-grid">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Reviewers</p>
              <h2>Coverage lanes</h2>
            </div>
          </div>

          <div className="coverage-table" role="table" aria-label="Reviewer coverage">
            {coverage.map((lane) => (
              <div className="coverage-row" role="row" key={lane.reviewer}>
                <strong>{lane.reviewer}</strong>
                <span>{lane.portfolio}</span>
                <small>{lane.assigned}</small>
                <em>{lane.coverage}</em>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Corrections</p>
              <h2>Rollback-safe changes</h2>
            </div>
          </div>

          <div className="correction-list">
            {corrections.map((correction) => (
              <article className="correction-card" key={`${correction.target}-${correction.window}`}>
                <span>{correction.window}</span>
                <strong>{correction.step}</strong>
                <p>{correction.target}</p>
                <small>{correction.guardrail}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="panel rollback-panel" aria-label="Rollback-safe scope corrections">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Guardrails</p>
            <h2>Scope correction checklist</h2>
          </div>
          <button type="button" className="primary-action">
            Approve scope corrections
          </button>
        </div>

        <ol className="rollback-list">
          {rollbackSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </main>
  );
}
