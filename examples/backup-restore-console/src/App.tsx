import { useMemo, useState } from 'react';

type BackupJob = {
  app: string;
  scope: string;
  lastRun: string;
  restorePoint: string;
  size: string;
  status: 'ready' | 'stale' | 'missing';
};

const jobs: BackupJob[] = [
  {
    app: 'Config Diff Studio',
    scope: 'staged patches',
    lastRun: '6 min ago',
    restorePoint: 'patch-set-042',
    size: '24 KB',
    status: 'ready'
  },
  {
    app: 'Window Rule Lab',
    scope: 'draft rules',
    lastRun: '18 min ago',
    restorePoint: 'rules-018',
    size: '12 KB',
    status: 'ready'
  },
  {
    app: 'Theme Forge',
    scope: 'token exports',
    lastRun: '2 days ago',
    restorePoint: 'theme-107',
    size: '41 KB',
    status: 'stale'
  },
  {
    app: 'Portal Permission Center',
    scope: 'handler review',
    lastRun: 'never',
    restorePoint: 'none',
    size: '0 KB',
    status: 'missing'
  }
];

const statusClass: Record<BackupJob['status'], string> = {
  ready: 'ready',
  stale: 'stale',
  missing: 'missing'
};

export function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeJob = jobs[activeIndex];
  const readyCount = useMemo(() => jobs.filter((job) => job.status === 'ready').length, []);
  const attentionCount = jobs.length - readyCount;

  return (
    <main className="shell">
      <section className="workspace" aria-label="Backup restore console">
        <div className="topbar">
          <span className="app-id">backup.restore</span>
          <span className="state">{attentionCount} review</span>
        </div>

        <section className="brief" aria-labelledby="brief-title">
          <div>
            <p className="eyebrow">Rollback readiness</p>
            <h1 id="brief-title">Know which app state can come back.</h1>
          </div>
          <div className="metricPair" aria-label="Backup coverage summary">
            <div>
              <strong>{readyCount}</strong>
              <span>ready</span>
            </div>
            <div>
              <strong>{jobs.length}</strong>
              <span>apps</span>
            </div>
          </div>
        </section>

        <div className="consoleGrid">
          <div className="jobList" role="list" aria-label="Backup jobs">
            {jobs.map((job, index) => (
              <button
                className={`jobRow ${index === activeIndex ? 'selected' : ''}`}
                key={job.app}
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                <span>
                  <strong>{job.app}</strong>
                  <small>{job.scope}</small>
                </span>
                <em className={statusClass[job.status]}>{job.status}</em>
              </button>
            ))}
          </div>

          <section className="restoreTable" aria-label="Restore point details">
            {jobs.map((job) => (
              <div className={`restoreRow ${job.status}`} key={job.app}>
                <span>
                  <strong>{job.restorePoint}</strong>
                  <small>{job.app}</small>
                </span>
                <code>{job.size}</code>
                <b>{job.lastRun}</b>
              </div>
            ))}
          </section>

          <aside className="inspector" aria-label="Backup inspector">
            <div className="backupCard">
              <span>{activeJob.status}</span>
              <strong>{activeJob.app}</strong>
            </div>

            <dl>
              <div>
                <dt>Scope</dt>
                <dd>{activeJob.scope}</dd>
              </div>
              <div>
                <dt>Restore point</dt>
                <dd>{activeJob.restorePoint}</dd>
              </div>
              <div>
                <dt>Rollback cue</dt>
                <dd>{rollbackCue(activeJob)}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
    </main>
  );
}

function rollbackCue(job: BackupJob) {
  if (job.status === 'ready') return 'Restore point is current enough for a confident rollback.';
  if (job.status === 'stale') return 'Run a fresh backup before applying risky changes.';
  return 'Create the first restore point before this app can join automation.';
}
