type LeakState = 'contained' | 'investigate' | 'exposed';

type Fingerprint = {
  secret: string;
  fingerprint: string;
  source: string;
  workspace: string;
  state: LeakState;
};

type TimelineEvent = {
  time: string;
  event: string;
  evidence: string;
  state: LeakState;
};

type ScannerFinding = {
  scanner: string;
  match: string;
  confidence: string;
  action: string;
  state: LeakState;
};

type CleanupCheck = {
  title: string;
  verification: string;
  owner: string;
  state: LeakState;
};

const fingerprints: Fingerprint[] = [
  {
    secret: 'release webhook',
    fingerprint: 'sha256:9f42...a19c',
    source: 'public paste mirror',
    workspace: 'release',
    state: 'exposed'
  },
  {
    secret: 'metrics reader',
    fingerprint: 'sha256:7721...bb0e',
    source: 'commit history scan',
    workspace: 'observability',
    state: 'contained'
  },
  {
    secret: 'sandbox token',
    fingerprint: 'sha256:44ad...9012',
    source: 'CI artifact',
    workspace: 'sandbox',
    state: 'investigate'
  },
  {
    secret: 'legacy deploy key',
    fingerprint: 'sha256:0a81...7ccd',
    source: 'unknown scanner hit',
    workspace: 'unmapped',
    state: 'exposed'
  }
];

const timeline: TimelineEvent[] = [
  {
    time: '09:12',
    event: 'Scanner reported public paste hit',
    evidence: 'fingerprint matched release webhook secret',
    state: 'exposed'
  },
  {
    time: '09:18',
    event: 'Release webhook revoked',
    evidence: 'old token rejected by delivery probe',
    state: 'contained'
  },
  {
    time: '09:27',
    event: 'CI artifact review started',
    evidence: 'artifact retention and downloads under review',
    state: 'investigate'
  },
  {
    time: '09:44',
    event: 'Legacy deploy key owner missing',
    evidence: 'no matching owner in service index',
    state: 'exposed'
  }
];

const findings: ScannerFinding[] = [
  {
    scanner: 'gitleaks',
    match: 'release webhook pattern',
    confidence: 'high',
    action: 'rotate and purge commit cache',
    state: 'exposed'
  },
  {
    scanner: 'trufflehog',
    match: 'metrics reader entropy',
    confidence: 'verified',
    action: 'document containment evidence',
    state: 'contained'
  },
  {
    scanner: 'artifact audit',
    match: 'sandbox token in CI bundle',
    confidence: 'medium',
    action: 'review download logs',
    state: 'investigate'
  },
  {
    scanner: 'owner map',
    match: 'legacy deploy key',
    confidence: 'blocked',
    action: 'assign owner before destructive cleanup',
    state: 'exposed'
  }
];

const cleanup: CleanupCheck[] = [
  {
    title: 'Rotate exposed credentials',
    verification: 'new fingerprints differ and old probes fail',
    owner: 'release',
    state: 'exposed'
  },
  {
    title: 'Purge leaked artifacts',
    verification: 'artifact cache and paste mirror report no hits',
    owner: 'infra',
    state: 'investigate'
  },
  {
    title: 'Close workspace impact',
    verification: 'affected workspace list matches scanner evidence',
    owner: 'security',
    state: 'contained'
  },
  {
    title: 'Archive evidence bundle',
    verification: 'timeline, hashes, and revocation proofs are sealed',
    owner: 'incident lead',
    state: 'contained'
  }
];

const stateLabels: Record<LeakState, string> = {
  contained: 'Contained',
  investigate: 'Investigate',
  exposed: 'Exposed'
};

const containedCount = fingerprints.filter((item) => item.state === 'contained').length + cleanup.filter((item) => item.state === 'contained').length;
const investigateCount = fingerprints.filter((item) => item.state === 'investigate').length + findings.filter((item) => item.state === 'investigate').length;
const exposedCount = fingerprints.filter((item) => item.state === 'exposed').length + findings.filter((item) => item.state === 'exposed').length;

export function App() {
  return (
    <main className="shell">
      <section className="workspace" aria-labelledby="page-title">
        <header className="masthead">
          <div>
            <p className="eyebrow">Leak forensics</p>
            <h1 id="page-title">Credential Leak Desk</h1>
          </div>
          <button type="button">Seal Evidence</button>
        </header>

        <section className="summary" aria-label="Credential leak summary">
          <article>
            <span>{fingerprints.length}</span>
            <p>fingerprints</p>
          </article>
          <article>
            <span>{containedCount}</span>
            <p>contained</p>
          </article>
          <article>
            <span>{investigateCount}</span>
            <p>investigations</p>
          </article>
          <article>
            <span>{exposedCount}</span>
            <p>exposed hits</p>
          </article>
        </section>

        <section className="fingerprintPanel" aria-label="Leaked secret fingerprints">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Fingerprint ledger</p>
              <h2>Leaked secret fingerprints, exposure timelines, affected workspaces, scanner evidence, containment status, and cleanup verification</h2>
            </div>
            <div className="forensicsBadge">
              <span />
              evidence first
            </div>
          </div>

          <div className="fingerprintGrid" role="list">
            {fingerprints.map((item) => (
              <article className="fingerprintCard" data-state={item.state} key={item.fingerprint} role="listitem" tabIndex={0}>
                <div className="cardStatus">
                  <span>{stateLabels[item.state]}</span>
                  <strong>{item.workspace}</strong>
                </div>
                <h3>{item.secret}</h3>
                <code>{item.fingerprint}</code>
                <p>{item.source}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="split">
          <section className="timelinePanel" aria-labelledby="timeline-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Timeline</p>
              <h2 id="timeline-title">Exposure sequence</h2>
            </div>
            <div className="timelineList" role="list">
              {timeline.map((item) => (
                <article data-state={item.state} key={`${item.time}-${item.event}`} role="listitem" tabIndex={0}>
                  <span>{item.time}</span>
                  <h3>{item.event}</h3>
                  <p>{item.evidence}</p>
                  <strong>{stateLabels[item.state]}</strong>
                </article>
              ))}
            </div>
          </section>

          <section className="scannerPanel" aria-labelledby="scanner-title">
            <div className="panelHeader compact">
              <p className="eyebrow">Scanners</p>
              <h2 id="scanner-title">Evidence quality</h2>
            </div>
            <div className="scannerList" role="list">
              {findings.map((finding) => (
                <article data-state={finding.state} key={finding.scanner} role="listitem" tabIndex={0}>
                  <span>{stateLabels[finding.state]}</span>
                  <h3>{finding.scanner}</h3>
                  <p>{finding.match}</p>
                  <strong>{finding.confidence}</strong>
                  <small>{finding.action}</small>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section className="cleanupPanel" aria-labelledby="cleanup-title">
          <div className="panelHeader compact">
            <p className="eyebrow">Verification</p>
            <h2 id="cleanup-title">Cleanup proof checklist</h2>
          </div>
          <div className="cleanupList" role="list">
            {cleanup.map((item) => (
              <article data-state={item.state} key={item.title} role="listitem" tabIndex={0}>
                <span>{stateLabels[item.state]}</span>
                <h3>{item.title}</h3>
                <p>{item.verification}</p>
                <strong>{item.owner}</strong>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
