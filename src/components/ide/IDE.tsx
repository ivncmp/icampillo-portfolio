import React, { useState, useRef, useEffect, type CSSProperties, type ReactNode } from 'react';
import { IDE_FILES, QUICK_OPEN_ITEMS, DEFAULT_OPEN_TABS, type IdeFile } from './ide-data';
import { BIO, SERVICES, PROJECTS, STACK, EXPERIENCE, OSS_REPOS, ENGAGEMENTS, CONTACT, SITE } from '../../data/index';

type SidePanel = 'explorer' | 'search' | 'git' | 'debug' | 'extensions' | 'accounts' | 'settings';

const fakeHash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h).toString(16).padStart(7, '0').slice(0, 7);
};

// ── Shared tiny components ──

const FileIcon = ({ ch, color }: { ch: string; color: string }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 16, height: 16, background: color, color: '#000',
    fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
    borderRadius: 2, flexShrink: 0,
  }}>{ch}</span>
);

const PulseDot = ({ color = 'var(--accent)', size = 6 }: { color?: string; size?: number }) => (
  <span style={{
    display: 'inline-block', width: size, height: size, borderRadius: 999,
    background: color, boxShadow: `0 0 0 0 ${color}`,
    animation: 'pulseRing 1.8s ease-out infinite', flexShrink: 0,
  }} />
);

const Kbd = ({ children }: { children: ReactNode }) => (
  <kbd style={{
    background: 'var(--bg-elev)', border: '1px solid var(--border-2)',
    padding: '1px 6px', borderRadius: 3, margin: '0 2px', fontFamily: 'var(--mono)',
  }}>{children}</kbd>
);

// ── Rotating caption below IDE ──

const TIPS: ReactNode[] = [
  <>▼ try <Kbd>⌘P</Kbd> to open files quickly</>,
  <>▼ click <span style={{ color: 'var(--accent-2)' }}>tabs</span> or <span style={{ color: 'var(--accent-2)' }}>explorer</span> to switch files</>,
  <>▼ type <span style={{ color: 'var(--accent)' }}>help</span> in the terminal to see all commands</>,
  <>▼ try <span style={{ color: 'var(--accent)' }}>ls</span>, <span style={{ color: 'var(--accent)' }}>cat cricket</span>, <span style={{ color: 'var(--accent)' }}>open work</span></>,
];

const RotatingCaption = () => {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIdx(i => (i + 1) % TIPS.length); setFade(true); }, 220);
    }, 4200);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{
      marginTop: 32, textAlign: 'center', minHeight: 20,
      fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg-mute)',
      letterSpacing: 0.5, opacity: fade ? 1 : 0, transition: 'opacity 0.22s ease',
    }}>{TIPS[idx]}</div>
  );
};

// ── Activity Bar ──

const ActivityBar = ({ activePanel, onPanelChange }: { activePanel: SidePanel; onPanelChange: (p: SidePanel) => void }) => {
  const icons: { ic: string; label: string; panel: SidePanel; badge?: string }[] = [
    { ic: '▦', label: 'Explorer', panel: 'explorer' },
    { ic: '⌕', label: 'Search', panel: 'search' },
    { ic: '⎇', label: 'Source Control', panel: 'git', badge: String(PROJECTS.filter(p => p.status !== 'archived').length) },
    { ic: '▶', label: 'Run & Debug', panel: 'debug' },
    { ic: '◉', label: 'Extensions', panel: 'extensions' },
  ];
  const bottom: typeof icons = [
    { ic: '◐', label: 'Accounts', panel: 'accounts' },
    { ic: '⚙', label: 'Settings', panel: 'settings' },
  ];
  const renderIcon = (item: typeof icons[0], i: number) => {
    const active = activePanel === item.panel;
    return (
      <div
        key={i} title={item.label}
        onClick={() => onPanelChange(item.panel)}
        style={{
          position: 'relative', width: 48, height: 48,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: active ? 'var(--fg)' : 'var(--fg-mute)', fontSize: 18,
          borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
          cursor: 'pointer', transition: 'color 0.15s',
        }}
        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--fg)'; }}
        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--fg-mute)'; }}
      >
        {item.ic}
        {item.badge && (
          <span style={{
            position: 'absolute', bottom: 8, right: 8,
            background: 'var(--accent)', color: '#000',
            fontSize: 9, fontFamily: 'var(--mono)', fontWeight: 700,
            padding: '0 4px', borderRadius: 6, lineHeight: '12px',
          }}>{item.badge}</span>
        )}
      </div>
    );
  };
  return (
    <div style={{
      background: '#010409', borderRight: '1px solid var(--border-2)',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      <div>{icons.map(renderIcon)}</div>
      <div>{bottom.map(renderIcon)}</div>
    </div>
  );
};

// ── Explorer ──

const Tree = ({ icon, name, depth = 0, active, color, onClick }: {
  icon: string; name: string; depth?: number; active?: boolean;
  color?: string; onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    style={{
      fontFamily: 'var(--mono)', fontSize: 12, padding: '3px 12px',
      paddingLeft: 12 + depth * 14,
      color: active ? 'var(--accent)' : (onClick ? 'var(--fg)' : 'var(--fg-mute)'),
      background: active ? 'rgba(200,255,0,0.06)' : 'transparent',
      borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
      display: 'flex', gap: 6, alignItems: 'center',
      cursor: onClick ? 'pointer' : 'default', transition: 'background 0.12s',
    }}
    onMouseEnter={e => { if (onClick && !active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
    onMouseLeave={e => { if (onClick && !active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
  >
    <span style={{ color: color || 'var(--fg-mute)', width: 12, fontSize: 10 }}>{icon}</span>
    <span>{name}</span>
  </div>
);

const Explorer = ({ activeFile, onOpenFile }: { activeFile: string; onOpenFile: (f: string) => void }) => (
  <div className="hide-scrollbar" style={{
    background: '#0d1117', borderRight: '1px solid var(--border-2)', overflow: 'auto',
  }}>
    <div style={{
      padding: '8px 12px', fontFamily: 'var(--mono)', fontSize: 11,
      color: 'var(--fg-mute)', letterSpacing: 1, textTransform: 'uppercase',
      borderBottom: '1px solid var(--border)', display: 'flex',
      justifyContent: 'space-between', alignItems: 'center',
    }}>
      <span>Explorer</span>
      <span style={{ color: 'var(--fg-mute)' }}>⋯</span>
    </div>
    <div style={{
      fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--fg)',
      padding: '6px 12px', fontWeight: 700,
    }}>▾ ICAMPILLO</div>

    <Tree icon="▾" name="hero/" depth={1} color="var(--warn)" />
    <Tree icon="●" name="whoami.md" depth={2} active={activeFile === 'whoami.md'} onClick={() => onOpenFile('whoami.md')} />
    <Tree icon="●" name="roles.ts" depth={2} active={activeFile === 'roles.ts'} onClick={() => onOpenFile('roles.ts')} />

    <Tree icon="▾" name="services/" depth={1} color="var(--warn)" />
    <Tree icon="●" name="services.ts" depth={2} active={activeFile === 'services.ts'} onClick={() => onOpenFile('services.ts')} />
    {SERVICES.filter(s => s.details).map(s => (
      <Tree key={s.id} icon="●" name={`${s.id}.ts`} depth={2} active={activeFile === `${s.id}.ts`} onClick={() => onOpenFile(`${s.id}.ts`)} />
    ))}

    <Tree icon="▾" name="work/" depth={1} color="var(--warn)" />
    <Tree icon="●" name="projects.json" depth={2} active={activeFile === 'projects.json'} onClick={() => onOpenFile('projects.json')} />
    <Tree icon="▸" name="..." depth={2} />

    <Tree icon="▸" name="stack/" depth={1} color="var(--warn)" />
    <Tree icon="▸" name="career/" depth={1} color="var(--warn)" />
    <Tree icon="▸" name="oss/" depth={1} color="var(--warn)" />
    <Tree icon="●" name="contact.yml" depth={1} color="var(--accent-2)" active={activeFile === 'contact.yml'} onClick={() => onOpenFile('contact.yml')} />
    <Tree icon="●" name="README.md" depth={1} color="#519aba" active={activeFile === 'README.md'} onClick={() => onOpenFile('README.md')} />

    <div style={{
      fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-mute)',
      padding: '12px 12px 4px', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600,
    }}>timeline</div>
    <div style={{ padding: '0 12px 10px', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-mute)', lineHeight: 1.7 }}>
      {PROJECTS.filter(p => p.status !== 'archived').slice(0, 3).map((p, i) => (
        <div key={i}>▸ {p.year.split(' ')[0]} · {p.id}</div>
      ))}
    </div>
  </div>
);

// ── Side Panels ──

const panelBg = { background: '#0d1117', borderRight: '1px solid var(--border-2)', overflow: 'auto' } as const;
const panelHeadStyle: CSSProperties = {
  padding: '8px 12px', fontFamily: 'var(--mono)', fontSize: 11,
  color: 'var(--fg-mute)', letterSpacing: 1, textTransform: 'uppercase',
  borderBottom: '1px solid var(--border)', display: 'flex',
  justifyContent: 'space-between', alignItems: 'center',
};
const panelInputStyle: CSSProperties = {
  flex: 1, background: 'transparent', border: 'none', outline: 'none',
  color: 'var(--fg)', fontFamily: 'var(--mono)', fontSize: 11,
};

// ── Search Panel ──

const SearchPanel = ({ onOpenFile }: { onOpenFile: (f: string) => void }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  type Hit = { label: string; detail: string; cat: string; file: string };
  const results: Hit[] = (() => {
    if (query.length < 2) return [];
    const q = query.toLowerCase();
    const r: Hit[] = [];
    BIO.roles.forEach(role => {
      if (role.title.toLowerCase().includes(q) || role.brief.toLowerCase().includes(q))
        r.push({ label: role.title, detail: role.brief, cat: 'Bio', file: 'whoami.md' });
    });
    SERVICES.forEach(s => {
      if (s.title.toLowerCase().includes(q) || s.tags.some(t => t.toLowerCase().includes(q)))
        r.push({ label: s.title, detail: s.tags.join(' · '), cat: 'Service', file: s.details ? `${s.id}.ts` : 'services.ts' });
    });
    PROJECTS.forEach(p => {
      if (p.name.toLowerCase().includes(q) || p.stack.some(t => t.toLowerCase().includes(q)) || p.desc.toLowerCase().includes(q))
        r.push({ label: p.name, detail: `${p.role} · ${p.year}`, cat: 'Project', file: 'projects.json' });
    });
    Object.entries(STACK).forEach(([cat, items]) => {
      items.forEach(item => {
        if (item.toLowerCase().includes(q))
          r.push({ label: item, detail: cat, cat: 'Stack', file: 'services.ts' });
      });
    });
    EXPERIENCE.forEach(e => {
      if (e.company.toLowerCase().includes(q) || e.role.toLowerCase().includes(q))
        r.push({ label: e.company, detail: `${e.role} · ${e.years}`, cat: 'Career', file: 'roles.ts' });
    });
    return r;
  })();

  const hl = (text: string): ReactNode => {
    const q = query.toLowerCase();
    const i = text.toLowerCase().indexOf(q);
    if (i === -1 || q.length < 2) return text;
    return <>{text.slice(0, i)}<span style={{ color: 'var(--accent)', fontWeight: 700 }}>{text.slice(i, i + q.length)}</span>{text.slice(i + q.length)}</>;
  };

  return (
    <div className="hide-scrollbar" style={panelBg}>
      <div style={panelHeadStyle}>Search</div>
      <div style={{ padding: '8px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--border-2)', borderRadius: 4, padding: '6px 10px', background: 'var(--bg-elev)' }}>
          <span style={{ color: 'var(--fg-mute)', fontSize: 12 }}>⌕</span>
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search portfolio..." style={panelInputStyle} />
        </div>
      </div>
      {query.length >= 2 && (
        <div style={{ padding: '4px 14px', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-mute)' }}>
          {results.length} result{results.length !== 1 ? 's' : ''} in portfolio
        </div>
      )}
      {results.map((r, i) => (
        <div key={i} onClick={() => onOpenFile(r.file)} style={{
          padding: '8px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border)', transition: 'background 0.12s',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--fg)' }}>{hl(r.label)}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-mute)', marginTop: 2 }}>{r.detail}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--accent)', marginTop: 2 }}>{r.cat} → {r.file}</div>
        </div>
      ))}
      {query.length >= 2 && results.length === 0 && (
        <div style={{ padding: '20px 14px', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg-mute)', textAlign: 'center' }}>
          No matches for "{query}"
        </div>
      )}
    </div>
  );
};

// ── Git Panel ──

const gitChanges = Object.keys(IDE_FILES).slice(0, 5).map((name, i) => ({
  status: i < 3 ? 'M' : 'A',
  file: name,
  color: i < 3 ? 'var(--warn)' : 'var(--accent-2)',
}));

const gitCommits = PROJECTS
  .slice()
  .sort((a, b) => parseInt(b.year) - parseInt(a.year))
  .slice(0, 8)
  .map(p => ({ hash: fakeHash(p.id), name: p.name, year: p.year.split(' ')[0], status: p.status }));

const GitPanel = () => {
  const [commitMsg, setCommitMsg] = useState('');
  const [committed, setCommitted] = useState(false);
  const doCommit = () => {
    if (!commitMsg.trim()) return;
    setCommitted(true);
    setTimeout(() => setCommitted(false), 2000);
    setCommitMsg('');
  };

  return (
    <div className="hide-scrollbar" style={panelBg}>
      <div style={panelHeadStyle}>Source Control</div>

      {committed && (
        <div style={{ padding: '8px 12px', background: 'rgba(126,231,135,0.08)', borderBottom: '1px solid var(--border)', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent-2)' }}>
          ✓ Committed to main
        </div>
      )}

      <div style={{ padding: '8px 12px' }}>
        <input value={commitMsg} onChange={e => setCommitMsg(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) doCommit(); }}
          placeholder="Message (⌘↵ to commit)"
          style={{ width: '100%', padding: '6px 10px', border: '1px solid var(--border-2)', borderRadius: 4, background: 'var(--bg-elev)', color: 'var(--fg)', fontFamily: 'var(--mono)', fontSize: 11, outline: 'none', boxSizing: 'border-box' }}
        />
        <button onClick={doCommit} style={{
          width: '100%', marginTop: 6, padding: '6px', background: 'var(--accent)', color: '#000',
          border: 'none', borderRadius: 4, fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, cursor: 'pointer',
        }}>✓ Commit</button>
      </div>

      <div style={{ padding: '8px 12px 4px', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-mute)', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>
        Changes <span style={{ color: 'var(--accent)' }}>({gitChanges.length})</span>
      </div>
      {gitChanges.map((c, i) => (
        <div key={i} style={{ padding: '3px 12px 3px 20px', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--fg)', display: 'flex', justifyContent: 'space-between' }}>
          <span>{c.file}</span>
          <span style={{ color: c.color, fontWeight: 700, fontSize: 10 }}>{c.status}</span>
        </div>
      ))}

      <div style={{ padding: '12px 12px 6px', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-mute)', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600, borderTop: '1px solid var(--border)', marginTop: 8 }}>
        Commits
      </div>
      {gitCommits.map((c, i) => (
        <div key={i} style={{ padding: '6px 12px', display: 'flex', gap: 8, alignItems: 'flex-start', fontFamily: 'var(--mono)', fontSize: 11 }}>
          <span style={{ color: c.status === 'live' ? 'var(--accent-2)' : c.status === 'oss' ? 'var(--cyan)' : 'var(--fg-mute)', marginTop: 2 }}>●</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: 'var(--fg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
            <div style={{ color: 'var(--fg-mute)', fontSize: 10 }}>{c.hash} · {c.year}</div>
          </div>
        </div>
      ))}

      <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border)', marginTop: 8, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-dim)' }}>
        <div>⎇ main <span style={{ color: 'var(--accent-2)' }}>● up to date</span></div>
        <div style={{ marginTop: 4, color: 'var(--fg-mute)' }}>last push: 2d ago</div>
      </div>
    </div>
  );
};

// ── Debug Panel ──

const BUILD_STEPS = [
  '$ npm run build',
  '',
  `> portfolio@${SITE.version} build`,
  '> astro build',
  '',
  '[types] Generated 214ms',
  '[build] output: "static"',
  '[build] Collecting build info...',
  '[build] ✓ Completed in 220ms.',
  '[build] Building static entrypoints...',
  '[vite] ✓ built in 626ms',
  '[vite] ✓ built in 314ms',
  '',
  ' generating static routes ',
  '  ├─ /index.html (+26ms)',
  '✓ Completed in 87ms.',
  '',
  `[build] 1 page(s) built in 1.29s`,
  '[build] Complete!',
];

const DebugPanel = () => {
  const [building, setBuilding] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  const runBuild = () => {
    if (building) return;
    setBuilding(true); setDone(false); setLog([]);
    BUILD_STEPS.forEach((step, i) => {
      setTimeout(() => {
        setLog(prev => [...prev, step]);
        if (i === BUILD_STEPS.length - 1) { setBuilding(false); setDone(true); }
      }, (i + 1) * 180);
    });
  };

  return (
    <div className="hide-scrollbar" style={panelBg}>
      <div style={panelHeadStyle}>Run and Debug</div>
      <div style={{ padding: 12 }}>
        <button onClick={runBuild} disabled={building} style={{
          width: '100%', padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          background: building ? 'var(--bg-elev)' : 'var(--accent)',
          color: building ? 'var(--fg-mute)' : '#000',
          border: building ? '1px solid var(--border)' : 'none',
          borderRadius: 6, fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700,
          cursor: building ? 'default' : 'pointer',
        }}>
          {building ? '◌ Building...' : done ? '✓ Rebuild' : '▶ Run Build'}
        </button>
      </div>

      {log.length > 0 && (
        <div ref={logRef} className="hide-scrollbar" style={{
          margin: '0 12px', padding: 10, background: 'var(--bg-panel)', border: '1px solid var(--border)',
          borderRadius: 6, maxHeight: 280, overflow: 'auto', fontFamily: 'var(--mono)', fontSize: 10, lineHeight: 1.6,
        }}>
          {log.map((line, i) => (
            <div key={i} style={{
              color: line.startsWith('✓') ? 'var(--accent-2)' : line.startsWith('[build]') || line.startsWith('[vite]') || line.startsWith('[types]') ? 'var(--fg-dim)' : line.startsWith('$') ? 'var(--accent)' : line.includes('├') ? 'var(--cyan)' : 'var(--fg-mute)',
            }}>
              {line || ' '}
            </div>
          ))}
          {building && <span style={{ display: 'inline-block', width: 6, height: 12, background: 'var(--accent)', animation: 'terminal-blink 1.1s steps(2, start) infinite' }} />}
        </div>
      )}

      <div style={{ padding: '12px', marginTop: 8 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-mute)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, fontWeight: 600 }}>
          Deploy Status
        </div>
        {[
          { label: 'Platform', value: 'Vercel', color: 'var(--fg)' },
          { label: 'Status', value: done ? '● Deployed' : '○ Ready', color: done ? 'var(--accent-2)' : 'var(--fg-mute)' },
          { label: 'URL', value: 'icampillo.com', color: 'var(--accent)' },
          { label: 'Build', value: done ? '1.29s' : '—', color: done ? 'var(--accent-2)' : 'var(--fg-mute)' },
          { label: 'Region', value: 'cdg1 (Paris)', color: 'var(--fg-dim)' },
        ].map((row, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 11, padding: '3px 0' }}>
            <span style={{ color: 'var(--fg-mute)' }}>{row.label}</span>
            <span style={{ color: row.color }}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Extensions Panel ──

const stackExtensions = Object.entries(STACK).flatMap(([cat, items]) =>
  items.map(name => {
    const h = fakeHash(name);
    return { name, category: cat, installs: `${(parseInt(h.slice(0, 2), 16) % 90) + 10}K`, stars: (parseInt(h.slice(2, 4), 16) % 2) + 4 };
  })
);

const ExtensionsPanel = () => {
  const [filter, setFilter] = useState('');
  const filtered = filter ? stackExtensions.filter(e => e.name.toLowerCase().includes(filter.toLowerCase())) : stackExtensions;

  return (
    <div className="hide-scrollbar" style={panelBg}>
      <div style={panelHeadStyle}>
        <span>Extensions</span>
        <span style={{ fontSize: 9, letterSpacing: 0, fontWeight: 400 }}>{stackExtensions.length}</span>
      </div>
      <div style={{ padding: '8px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--border-2)', borderRadius: 4, padding: '6px 10px', background: 'var(--bg-elev)' }}>
          <span style={{ color: 'var(--fg-mute)', fontSize: 12 }}>⌕</span>
          <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter extensions..." style={panelInputStyle} />
        </div>
      </div>
      <div style={{ padding: '4px 12px 6px', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-mute)', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>
        Installed
      </div>
      {filtered.map((ext, i) => (
        <div key={i} style={{
          padding: '8px 12px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 10, transition: 'background 0.12s',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 4, background: `hsl(${(i * 47 + 120) % 360}, 50%, 30%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0, color: '#fff', fontWeight: 700,
            fontFamily: 'var(--mono)',
          }}>{ext.name.slice(0, 2)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--fg)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ext.name}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--fg-mute)', marginTop: 2 }}>
              <span style={{ color: '#ffa657' }}>{'★'.repeat(ext.stars)}</span>{'☆'.repeat(5 - ext.stars)} · {ext.installs}
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--accent)', marginTop: 1 }}>{ext.category}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Accounts Panel ──

const AccountsPanel = () => (
  <div className="hide-scrollbar" style={panelBg}>
    <div style={panelHeadStyle}>Accounts</div>
    <div style={{ padding: 16, textAlign: 'center' }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%', margin: '0 auto 12px',
        background: 'linear-gradient(135deg, #0d1117, #161b22)',
        border: '2px solid rgba(200,255,0,0.3)', overflow: 'hidden',
      }}>
        <img src="/avatar.png" alt={BIO.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 700, color: 'var(--fg)' }}>{BIO.name}</div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg-mute)', marginTop: 2 }}>{BIO.handle}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 8 }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--accent-2)', boxShadow: '0 0 6px var(--accent-2)' }} />
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--accent-2)' }}>Available {CONTACT.availability.quarter}</span>
      </div>
    </div>

    <div style={{ padding: '0 12px 12px' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-mute)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, fontWeight: 600 }}>Roles</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {BIO.roles.map((r, i) => (
          <span key={i} style={{
            fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--fg)',
            border: '1px solid var(--border-2)', padding: '2px 6px', borderRadius: 3,
          }}>{r.title}</span>
        ))}
      </div>
    </div>

    <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border)' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-mute)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, fontWeight: 600 }}>Links</div>
      {Object.entries(CONTACT.social).map(([key, value], i) => (
        <div key={i} style={{ padding: '4px 0', fontFamily: 'var(--mono)', fontSize: 11 }}>
          <span style={{ color: 'var(--fg-mute)' }}>{key}: </span>
          <span style={{ color: 'var(--accent-2)' }}>{value}</span>
        </div>
      ))}
      <div style={{ padding: '4px 0', fontFamily: 'var(--mono)', fontSize: 11 }}>
        <span style={{ color: 'var(--fg-mute)' }}>email: </span>
        <span style={{ color: 'var(--accent-2)' }}>{BIO.email}</span>
      </div>
    </div>

    <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 10 }}>
        <span style={{ color: 'var(--fg-mute)' }}>{BIO.location}</span>
        <span style={{ color: 'var(--fg-mute)' }}>{BIO.timezone}</span>
      </div>
    </div>

    <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
      <a href="#contact" style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6,
        padding: 10, background: 'var(--accent)', color: '#000',
        fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, borderRadius: 4, textDecoration: 'none',
      }}>▸ hire me</a>
    </div>
  </div>
);

// ── Settings Panel ──

const SettingsPanel = () => {
  const groups = [
    { title: 'Editor', items: [
      { key: 'fontFamily', value: 'JetBrains Mono' },
      { key: 'fontSize', value: '13' },
      { key: 'tabSize', value: '2' },
      { key: 'theme', value: 'icampillo-dark' },
      { key: 'minimap', value: 'true' },
      { key: 'wordWrap', value: 'on' },
      { key: 'bracketPairs', value: 'true' },
    ]},
    { title: 'Terminal', items: [
      { key: 'shell', value: 'zsh' },
      { key: 'fontSize', value: '12' },
      { key: 'cursor', value: 'block' },
    ]},
    { title: 'Portfolio', items: [
      { key: 'version', value: SITE.version },
      { key: 'sections', value: String(SITE.sections.length) },
      { key: 'services', value: String(SERVICES.length) },
      { key: 'projects', value: String(PROJECTS.length) },
      { key: 'experience', value: `${EXPERIENCE.length} roles` },
    ]},
    { title: 'Deploy', items: [
      { key: 'platform', value: 'Vercel' },
      { key: 'region', value: 'cdg1 (Paris)' },
      { key: 'buildCmd', value: 'astro build' },
      { key: 'output', value: 'dist/' },
    ]},
  ];

  return (
    <div className="hide-scrollbar" style={panelBg}>
      <div style={panelHeadStyle}>Settings</div>
      <div style={{ padding: '8px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--border-2)', borderRadius: 4, padding: '6px 10px', background: 'var(--bg-elev)' }}>
          <span style={{ color: 'var(--fg-mute)', fontSize: 12 }}>⌕</span>
          <input placeholder="Search settings..." style={panelInputStyle} />
        </div>
      </div>

      {groups.map((g, gi) => (
        <React.Fragment key={gi}>
          <div style={{ padding: '10px 12px 4px', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-mute)', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>
            {g.title}
          </div>
          {g.items.map((s, i) => (
            <div key={i} style={{
              padding: '5px 12px', fontFamily: 'var(--mono)', fontSize: 11,
              display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)',
            }}>
              <span style={{ color: 'var(--fg-dim)' }}>{s.key}</span>
              <span style={{ color: s.value === 'true' ? 'var(--accent-2)' : 'var(--accent)' }}>{s.value}</span>
            </div>
          ))}
        </React.Fragment>
      ))}

      <div style={{ padding: '12px 12px 4px', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-mute)', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>
        Theme Colors
      </div>
      <div style={{ padding: '8px 12px 16px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {[
          { c: '#c8ff00', l: '--accent' }, { c: '#7ee787', l: '--accent-2' },
          { c: '#79c0ff', l: '--cyan' }, { c: '#d2a8ff', l: '--purple' },
          { c: '#ffa657', l: '--warn' }, { c: '#ff7b72', l: '--red' },
          { c: '#a5d6ff', l: '--blue' }, { c: '#f0f6fc', l: '--fg' },
        ].map((swatch, i) => (
          <div key={i} title={swatch.l} style={{
            width: 24, height: 24, borderRadius: 4, background: swatch.c,
            border: i === 0 ? '2px solid var(--fg)' : '1px solid var(--border)',
            cursor: 'pointer', transition: 'transform 0.12s',
          }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.2)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          />
        ))}
      </div>
    </div>
  );
};

// ── Editor Content ──

const EditorContent = ({ filename, onMarkDirty, scrollRef }: {
  filename: string; onMarkDirty?: (f: string) => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const file = IDE_FILES[filename];
  if (!file) return null;
  return (
    <div style={{ flex: 1, overflow: 'hidden', background: 'var(--bg-panel)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{
        padding: '6px 16px', borderBottom: '1px solid var(--border)',
        fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg-mute)', flexShrink: 0,
      }}>
        {file.breadcrumb.map((b, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ color: 'var(--fg-mute)' }}> › </span>}
            <span style={{ color: i === file.breadcrumb.length - 1 ? 'var(--fg)' : 'var(--fg-mute)' }}>{b}</span>
          </React.Fragment>
        ))}
      </div>
      <div
        ref={scrollRef}
        onClick={() => onMarkDirty?.(filename)}
        className="hide-scrollbar"
        style={{ flex: 1, overflow: 'auto', padding: '14px 0', minHeight: 0 }}
      >
        <div style={{
          display: 'grid', gridTemplateColumns: '40px 1fr',
          fontFamily: 'var(--mono)', fontSize: 13, lineHeight: '22px',
        }}>
          {file.lines.map((el, i) => (
            <React.Fragment key={i}>
              <div style={{ color: 'var(--fg-mute)', textAlign: 'right', paddingRight: 10, userSelect: 'none', opacity: 0.6 }}>{i + 1}</div>
              <div style={{ color: 'var(--fg)', paddingRight: 24, whiteSpace: 'pre' }}>
                {el === '' ? <>&nbsp;</> : el}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Minimap ──

const Minimap = ({ scrollRef, totalLines }: { scrollRef: React.RefObject<HTMLDivElement | null>; totalLines: number }) => {
  const [scrollPct, setScrollPct] = useState(0);
  const [viewportPct, setViewportPct] = useState(0.3);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const maxScroll = el.scrollHeight - el.clientHeight;
      setScrollPct(maxScroll > 0 ? el.scrollTop / maxScroll : 0);
      setViewportPct(el.scrollHeight > 0 ? el.clientHeight / el.scrollHeight : 1);
    };
    onScroll();
    el.addEventListener('scroll', onScroll);
    const ro = new ResizeObserver(onScroll);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', onScroll); ro.disconnect(); };
  }, [scrollRef, totalLines]);

  const lineBars = Array.from({ length: totalLines }).map((_, i) => {
    const seed = (i * 37) % 100;
    const w = 20 + (seed % 60);
    const isBlank = seed < 10;
    return {
      w: isBlank ? 0 : w,
      color: seed % 7 === 0 ? 'var(--accent)' : seed % 5 === 0 ? '#79c0ff' : seed % 3 === 0 ? '#ffa657' : 'var(--fg-dim)',
    };
  });

  const handleClick = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientY - rect.top) / rect.height;
    el.scrollTop = pct * (el.scrollHeight - el.clientHeight);
  };

  return (
    <div onClick={handleClick} style={{
      width: 64, background: 'var(--bg-panel)', borderLeft: '1px solid var(--border)',
      padding: '8px 6px', position: 'relative', cursor: 'pointer', overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {lineBars.map((b, i) => (
          <div key={i} style={{ height: 2, width: `${b.w}%`, background: b.color, opacity: 0.5 }} />
        ))}
      </div>
      <div style={{
        position: 'absolute', left: 0, right: 0,
        top: `${scrollPct * (100 - viewportPct * 100)}%`,
        height: `${viewportPct * 100}%`,
        background: 'rgba(255,255,255,0.06)',
        borderTop: '1px solid rgba(255,255,255,0.15)',
        borderBottom: '1px solid rgba(255,255,255,0.15)',
        pointerEvents: 'none',
      }} />
    </div>
  );
};

// ── Preview Panels ──

const WhoamiPreview = () => (
  <>
    <div style={{
      width: '100%', aspectRatio: '1', marginBottom: 14,
      background: 'linear-gradient(135deg, #0d1117, #161b22)',
      border: '1px solid rgba(200,255,0,0.2)',
      borderRadius: 8, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 10px, rgba(200,255,0,0.04) 10px 11px), repeating-linear-gradient(90deg, transparent 0 10px, rgba(200,255,0,0.04) 10px 11px)',
      }} />
      <img src="/avatar.png" alt="Iván Campillo" style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        width: '100%', height: '95%', objectFit: 'contain', objectPosition: 'center bottom',
      }} />
      <div style={{
        position: 'absolute', bottom: 8, left: 8,
        fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--fg-mute)',
        background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: 2,
      }}>avatar.png · 32×32</div>
    </div>
    <div style={{ fontFamily: 'var(--sans)', fontSize: 17, fontWeight: 700, color: 'var(--fg)', letterSpacing: -0.3 }}>{BIO.name}</div>
    <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-dim)', marginTop: 2 }}>{BIO.roles.map(r => r.title.split(' ')[0]).slice(0, 4).join(' · ')}</div>
    <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--fg-dim)', marginTop: 10, lineHeight: 1.5 }}>
      {BIO.taglineEn}.
    </div>
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 12 }}>
      {BIO.shortTags.map(t => (
        <span key={t} style={{
          fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--fg)',
          border: '1px solid var(--border-2)', padding: '2px 6px', borderRadius: 3,
        }}>{t}</span>
      ))}
    </div>
    <a href="#contact" style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6,
      marginTop: 14, padding: 10, background: 'var(--accent)', color: '#000',
      fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, borderRadius: 4, textDecoration: 'none',
    }}>▸ let's talk</a>
  </>
);

const SERVICE_COLORS = ['#79c0ff', 'var(--purple)', 'var(--accent)', '#ffa657', 'var(--accent-2)', 'var(--cyan)'];

const ServicesPreview = () => {
  return (
    <>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-mute)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>▸ service depth</div>
      {SERVICES.map((svc, i) => {
        const color = SERVICE_COLORS[i % SERVICE_COLORS.length];
        return (
          <div key={svc.id} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 11 }}>
              <span style={{ color: 'var(--fg)' }}>{svc.title.split(' ')[0]}</span>
              <span style={{ color }}>{svc.depthScore}%</span>
            </div>
            <div style={{ height: 4, background: 'var(--border)', marginTop: 4, borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: `${svc.depthScore}%`, height: '100%', background: color, boxShadow: `0 0 8px ${color}66` }} />
            </div>
          </div>
        );
      })}
      <div style={{
        marginTop: 20, padding: 12, background: 'var(--bg-elev)',
        border: '1px solid var(--border)', borderRadius: 6,
        fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg-dim)',
      }}>
        <div style={{ color: 'var(--accent)', marginBottom: 4 }}>✓ {SERVICES.length} services</div>
        <div>{BIO.metrics[3].value} tech stacks</div>
        <div>{BIO.metrics[0].value} years experience</div>
        <div>end-to-end capable</div>
      </div>
    </>
  );
};

const ProjectsPreview = () => (
  <>
    <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-mute)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>▸ live dashboard</div>
    {BIO.projectHighlights.map(m => (
      <div key={m.label} style={{
        padding: '10px 12px', marginBottom: 6,
        background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 6,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg-dim)' }}>{m.label}</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 700, color: m.color }}>{m.value}</span>
      </div>
    ))}
    <a href="#work" style={{
      display: 'block', marginTop: 12, padding: 10,
      background: 'transparent', border: '1px solid var(--border-2)',
      borderRadius: 4, textAlign: 'center',
      fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent)', textDecoration: 'none',
    }}>→ ver todos los proyectos</a>
  </>
);

const ContactPreview = () => (
  <>
    <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-mute)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>▸ status</div>
    <div style={{
      padding: 14, background: 'rgba(126,231,135,0.08)',
      border: '1px solid rgba(126,231,135,0.3)', borderRadius: 6, marginBottom: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{
          width: 8, height: 8, borderRadius: 999, background: 'var(--accent-2)',
          boxShadow: '0 0 8px var(--accent-2)', animation: 'pulse 1.6s ease-in-out infinite',
        }} />
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent-2)', fontWeight: 700 }}>AVAILABLE {CONTACT.availability.quarter}</span>
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-dim)', lineHeight: 1.6 }}>
        {CONTACT.availability.commitment.split(' · ').map((s, i) => <span key={i}>{s}<br /></span>)}responds in &lt;{CONTACT.responseTime}
      </div>
    </div>
    <a href={`mailto:${BIO.email}`} style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6,
      padding: 12, background: 'var(--accent)', color: '#000',
      fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, borderRadius: 4, textDecoration: 'none', marginBottom: 8,
    }}>✉ send email</a>
    <a href="#contact" style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6,
      padding: 10, border: '1px solid var(--border-2)',
      fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg)', borderRadius: 4, textDecoration: 'none',
    }}>→ open form</a>
    <div style={{
      marginTop: 14, padding: 10, background: 'var(--bg-elev)',
      border: '1px solid var(--border)', borderRadius: 6,
      fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-mute)', lineHeight: 1.7,
    }}>
      {Object.entries(CONTACT.social).map(([, value], i) => (
        <div key={i}>⌘ {value}</div>
      ))}
    </div>
  </>
);

const PREVIEW_MAP: Record<string, React.ComponentType> = {
  'whoami.md': WhoamiPreview,
  'roles.ts': WhoamiPreview,
  'services.ts': ServicesPreview,
  'cloud.ts': ServicesPreview,
  'ai.ts': ServicesPreview,
  'web3.ts': ServicesPreview,
  'projects.json': ProjectsPreview,
  'contact.yml': ContactPreview,
  'README.md': WhoamiPreview,
};

const PreviewPanel = ({ activeFile }: { activeFile: string }) => {
  const Preview = PREVIEW_MAP[activeFile];
  return (
    <div className="hide-scrollbar" style={{
      background: 'var(--bg-panel)', borderLeft: '1px solid var(--border-2)',
      padding: 16, overflow: 'auto',
    }}>
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-mute)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14,
      }}>
        <span style={{ display: 'flex', gap: 8 }}>
          <span>◀</span><span>▶</span>
          <span style={{ color: 'var(--fg)', marginLeft: 6 }}>Preview</span>
        </span>
        <span style={{
          padding: '1px 6px', background: 'rgba(200,255,0,0.1)',
          color: 'var(--accent)', border: '1px solid rgba(200,255,0,0.3)', borderRadius: 3, fontSize: 9,
        }}>live</span>
      </div>
      {Preview && <Preview />}
    </div>
  );
};

// ── Quick Open Modal ──

const QuickOpenModal = ({ open, onClose, onSelect }: {
  open: boolean; onClose: () => void; onSelect: (f: string) => void;
}) => {
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) { setQuery(''); setCursor(0); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  const fuzzy = (s: string, q: string) => {
    if (!q) return true;
    let i = 0;
    const sl = s.toLowerCase(), ql = q.toLowerCase();
    for (const c of sl) if (c === ql[i]) i++;
    return i === ql.length;
  };
  const results = QUICK_OPEN_ITEMS.filter(it => fuzzy(it.name, query) || fuzzy(it.path, query));

  useEffect(() => setCursor(0), [query]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    else if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(c + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      const sel = results[cursor];
      if (sel) { onSelect(sel.name); onClose(); }
    }
  };

  if (!open) return null;

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
      display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '12vh',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 'min(640px, 90vw)', background: '#252526',
        border: '1px solid var(--border-2)', borderRadius: 8,
        boxShadow: '0 30px 80px rgba(0,0,0,0.6)', overflow: 'hidden',
      }}>
        <div style={{
          padding: '10px 14px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ color: 'var(--fg-mute)', fontFamily: 'var(--mono)', fontSize: 12 }}>→</span>
          <input
            ref={inputRef} value={query}
            onChange={e => setQuery(e.target.value)} onKeyDown={handleKey}
            placeholder="Go to file..."
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--fg)', fontFamily: 'var(--mono)', fontSize: 13,
            }}
          />
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-mute)',
            border: '1px solid var(--border-2)', padding: '1px 6px', borderRadius: 3,
          }}>esc</span>
        </div>
        <div style={{ maxHeight: 360, overflowY: 'auto' }}>
          {results.length === 0 && (
            <div style={{ padding: 20, color: 'var(--fg-mute)', fontFamily: 'var(--mono)', fontSize: 12 }}>
              No files match "{query}"
            </div>
          )}
          {results.map((it, i) => (
            <div
              key={it.name}
              onClick={() => { onSelect(it.name); onClose(); }}
              onMouseEnter={() => setCursor(i)}
              style={{
                padding: '6px 14px', fontFamily: 'var(--mono)', fontSize: 12,
                display: 'flex', alignItems: 'center', gap: 10,
                background: i === cursor ? 'rgba(200,255,0,0.08)' : 'transparent',
                borderLeft: i === cursor ? '2px solid var(--accent)' : '2px solid transparent',
                cursor: 'pointer',
              }}
            >
              <FileIcon ch={it.icon} color={it.iconColor} />
              <span style={{ color: 'var(--fg)' }}>{it.name}</span>
              <span style={{ color: 'var(--fg-mute)', marginLeft: 'auto' }}>{it.path}</span>
            </div>
          ))}
        </div>
        <div style={{
          padding: '6px 14px', borderTop: '1px solid var(--border)',
          background: '#1a1a1a', fontFamily: 'var(--mono)', fontSize: 10,
          color: 'var(--fg-mute)', display: 'flex', gap: 16,
        }}>
          <span>↑↓ navigate</span><span>↵ open</span><span>esc close</span>
          <span style={{ marginLeft: 'auto' }}>{results.length} file{results.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
};

// ── Terminal ──

const Prompt = () => (
  <>
    <span style={{ color: 'var(--accent-2)' }}>ivan</span>
    <span style={{ color: 'var(--fg-mute)' }}>@portfolio</span>
    <span style={{ color: 'var(--fg-mute)' }}>:</span>
    <span style={{ color: 'var(--cyan)' }}>~</span>
    <span style={{ color: 'var(--fg-mute)', marginRight: 8 }}>$</span>
  </>
);

const COMMANDS = ['help', 'whoami', 'ls', 'cat', 'open', 'stats', 'stack', 'contact', 'collab', 'clear', 'date', 'echo', 'pwd'];

const autoComplete = (input: string): string | null => {
  const matches = COMMANDS.filter(c => c.startsWith(input.toLowerCase()));
  return matches.length === 1 ? matches[0] : null;
};

const acc = 'var(--accent)';
const acc2 = 'var(--accent-2)';
const dim = 'var(--fg-mute)';
const warn = 'var(--warn)';
const cyan = 'var(--cyan)';
const red = 'var(--red)';

function runCommand(cmdLine: string, ctx: { clear: () => void }): ReactNode[] | null {
  const parts = cmdLine.trim().split(/\s+/);
  const cmd = parts[0]?.toLowerCase();
  const args = parts.slice(1);
  if (!cmd) return [];

  switch (cmd) {
    case 'help': return [
      <span style={{ color: acc }}>available commands:</span>,
      <>  <span style={{ color: acc2 }}>whoami</span>       — bio rápida</>,
      <>  <span style={{ color: acc2 }}>ls</span> [dir]     — lista secciones o contenido</>,
      <>  <span style={{ color: acc2 }}>cat</span> {'<id>'}     — detalle de un proyecto/servicio</>,
      <>  <span style={{ color: acc2 }}>open</span> {'<section>'} — scroll suave a la sección</>,
      <>  <span style={{ color: acc2 }}>stats</span>        — números de trayectoria</>,
      <>  <span style={{ color: acc2 }}>stack</span>        — stack tecnológico completo</>,
      <>  <span style={{ color: acc2 }}>contact</span>      — email, linkedin, github</>,
      <>  <span style={{ color: acc2 }}>collab</span>       — cómo trabajar conmigo</>,
      <>  <span style={{ color: acc2 }}>clear</span>        — limpia la terminal</>,
      <>  <span style={{ color: acc2 }}>date</span>         — fecha y hora actual</>,
      <>  <span style={{ color: acc2 }}>echo</span> {'<text>'}   — imprime texto</>,
      <>  <span style={{ color: dim }}># pro tip: ↑/↓ para historial · tab para sugerencias</span></>,
    ];

    case 'whoami': return [
      <span style={{ color: acc, fontWeight: 700 }}>{BIO.name}</span>,
      <><span style={{ color: dim }}>└─</span> {BIO.roles.map(r => r.title).join(' · ')}</>,
      <><span style={{ color: dim }}>└─</span> {BIO.location} ({BIO.timezone}) · {BIO.metrics[0].value} años shipping</>,
      <><span style={{ color: dim }}>└─</span> {ENGAGEMENTS.map(e => e.role).join(' · ')}</>,
      <span style={{ color: acc2 }}>✓ available {CONTACT.availability.quarter}</span>,
    ];

    case 'ls': {
      const dir = args[0];
      if (!dir) return [
        <span style={{ color: cyan }}>total 7</span>,
        <><span style={{ color: warn }}>drwxr-xr-x</span>  services/     6 items</>,
        <><span style={{ color: warn }}>drwxr-xr-x</span>  work/         6 items</>,
        <><span style={{ color: warn }}>drwxr-xr-x</span>  stack/        7 groups</>,
        <><span style={{ color: warn }}>drwxr-xr-x</span>  career/       7 roles</>,
        <><span style={{ color: warn }}>drwxr-xr-x</span>  oss/          4 repos</>,
        <><span style={{ color: acc2 }}>-rw-r--r--</span>  whoami.md</>,
        <><span style={{ color: acc2 }}>-rw-r--r--</span>  contact.yml</>,
      ];
      if (dir === 'services' || dir === 'services/') {
        return SERVICES.map(s => <>  <span style={{ color: acc }}>{s.id}</span>  <span style={{ color: dim }}>·</span>  {s.title}</>);
      }
      if (dir === 'work' || dir === 'work/' || dir === 'projects') {
        return PROJECTS.map(p => <>  <span style={{ color: acc }}>{p.id}</span>  <span style={{ color: dim }}>·</span>  {p.name}  <span style={{ color: p.status === 'live' ? acc2 : dim }}>[{p.status}]</span></>);
      }
      if (dir === 'stack' || dir === 'stack/') {
        return Object.entries(STACK).map(([k, v]) => <>  <span style={{ color: warn }}>{k}/</span>  <span style={{ color: dim }}>({v.length} items)</span></>);
      }
      if (dir === 'career' || dir === 'career/') {
        return EXPERIENCE.map(e => <>  <span style={{ color: dim }}>{e.years}</span>  <span style={{ color: acc }}>{e.role}</span>  <span style={{ color: dim }}>@</span> {e.company}</>);
      }
      if (dir === 'oss' || dir === 'oss/') {
        return OSS_REPOS.map(r => <>  <span style={{ color: acc }}>{r.name}</span>  <span style={{ color: warn }}>★ {r.stars}</span>  <span style={{ color: dim }}>·</span> {r.desc}</>);
      }
      return [<span style={{ color: red }}>ls: {dir}: No such directory</span>];
    }

    case 'cat': {
      const id = args[0];
      if (!id) return [<span style={{ color: red }}>cat: missing filename — try: cat {'<project-id>'}</span>];
      const proj = PROJECTS.find(p => p.id === id || p.id.startsWith(id));
      if (proj) return [
        <span style={{ color: acc, fontWeight: 700 }}>{proj.name}</span>,
        <span style={{ color: dim }}>───</span>,
        <>{proj.desc}</>,
        '',
        <><span style={{ color: warn }}>role</span>:     {proj.role}</>,
        <><span style={{ color: warn }}>status</span>:   <span style={{ color: proj.status === 'live' ? acc2 : dim }}>{proj.status}</span></>,
        <><span style={{ color: warn }}>stack</span>:    {proj.stack.join(', ')}</>,
        <><span style={{ color: warn }}>year</span>:     {proj.year}</>,
      ];
      const svc = SERVICES.find(s => s.id === id);
      if (svc) return [
        <span style={{ color: acc, fontWeight: 700 }}>{svc.title}</span>,
        <span style={{ color: dim }}>───</span>,
        <>{svc.desc}</>,
        '',
        <><span style={{ color: warn }}>tags</span>: {svc.tags.join(', ')}</>,
      ];
      return [<span style={{ color: red }}>cat: {id}: No such file or id</span>];
    }

    case 'open': {
      const sec = args[0];
      const map: Record<string, string> = {
        whoami: '#whoami', services: '#services', work: '#work',
        projects: '#work', stack: '#stack', career: '#career',
        oss: '#oss', contact: '#contact',
      };
      if (!sec || !map[sec]) return [<span style={{ color: red }}>open: usage — open [whoami|services|work|stack|career|oss|contact]</span>];
      setTimeout(() => document.querySelector(map[sec])?.scrollIntoView({ behavior: 'smooth' }), 100);
      return [<><span style={{ color: acc2 }}>→ navigating to</span> {map[sec]}</>];
    }

    case 'stats': return [
      <span style={{ color: acc }}>$ stats --summary</span>,
      ...BIO.metrics.map(m => (
        <><span style={{ color: warn }}>{m.target}</span>{m.suffix} {m.label}</>
      )),
      <span style={{ color: acc2 }}>✓ build successful — ready to ship</span>,
    ];

    case 'stack': {
      const out: ReactNode[] = [<span style={{ color: acc }}>$ stack --full</span>];
      Object.entries(STACK).forEach(([k, v]) => {
        out.push(<span style={{ color: warn }}>{k}</span>);
        out.push(<>  <span style={{ color: dim }}>└─</span> {v.join(' · ')}</>);
      });
      return out;
    }

    case 'contact': return [
      <span style={{ color: acc, fontWeight: 700 }}>contact info</span>,
      <>  <span style={{ color: warn }}>email</span>:    <a href={`mailto:${BIO.email}`} style={{ color: acc2, textDecoration: 'underline' }}>{BIO.email}</a></>,
      ...Object.entries(CONTACT.social).map(([key, value]) => (
        <>  <span style={{ color: warn }}>{key}</span>:{' '.repeat(Math.max(1, 9 - key.length))}<span style={{ color: acc2 }}>{value}</span></>
      )),
      <>  <span style={{ color: warn }}>location</span>: {BIO.location} ({BIO.timezone})</>,
      <>  <span style={{ color: warn }}>response</span>: {'<'}{CONTACT.responseTime}</>,
    ];

    case 'collab': return [
      <span style={{ color: acc, fontWeight: 700 }}>$ ./collab.sh</span>,
      <span style={{ color: dim }}>───</span>,
      <><span style={{ color: warn }}>roles</span>:         {ENGAGEMENTS.map(e => e.role).join(' · ')}</>,
      <><span style={{ color: warn }}>commitment</span>:    {CONTACT.availability.commitment}</>,
      <><span style={{ color: warn }}>status</span>:        <span style={{ color: acc2 }}>● available {CONTACT.availability.quarter}</span></>,
      <><span style={{ color: warn }}>response</span>:      {'<'}{CONTACT.responseTime}</>,
      '',
      <>→ run <span style={{ color: acc2 }}>open contact</span> to jump to the form</>,
      <>→ or email <a href={`mailto:${BIO.email}`} style={{ color: acc2, textDecoration: 'underline' }}>{BIO.email}</a></>,
    ];

    case 'clear': ctx.clear(); return null;
    case 'date': return [<>{new Date().toString()}</>];
    case 'echo': return [<>{args.join(' ')}</>];
    case 'pwd': return [<>/home/ivan/portfolio</>];
    case 'sudo': return [
      <span style={{ color: red }}>[sudo] password for ivan:</span>,
      <span style={{ color: red }}>Sorry, try again.</span>,
      <span style={{ color: dim }}>(hint: no sudo aquí, estamos bien sin root)</span>,
    ];
    case 'rm': return [<span style={{ color: red }}>rm: permission denied — nice try</span>];
    case 'exit': case 'quit': return [<span style={{ color: dim }}>you can't exit this terminal — it's your portfolio</span>];
    case 'hello': case 'hola': return [
      <span style={{ color: acc }}>👋 hey!</span>,
      <>¿qué necesitas construir? prueba <span style={{ color: acc2 }}>collab</span> o <span style={{ color: acc2 }}>contact</span></>,
    ];
    case 'npm': return [
      <span style={{ color: dim }}>&gt; portfolio@{SITE.version} {args.join(' ')}</span>,
      <>{BIO.metrics.map(m => <span key={m.label}><span style={{ color: warn }}>{m.value}</span> {m.label} · </span>)}</>,
      <span style={{ color: acc2 }}>{'✓ build successful — { "ready": true }'}</span>,
    ];

    default: return [
      <span style={{ color: red }}>{cmd}: command not found</span>,
      <span style={{ color: dim }}>type <span style={{ color: acc2 }}>help</span> for available commands</span>,
    ];
  }
}

// ── ExecutableTerminal ──

interface HistoryEntry { type: 'cmd' | 'out'; text?: string; el?: ReactNode }

const ExecutableTerminal = ({ height = 180, onResize }: { height?: number; onResize?: (h: number) => void }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: 'out', el: <span style={{ color: dim }}>welcome to icampillo/portfolio · this terminal is real — try the commands below</span> },
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const clear = () => setHistory([]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const executeCommand = (cmdText: string) => {
    const ctx = { clear };
    const out = runCommand(cmdText, ctx);
    const newEntries: HistoryEntry[] = [{ type: 'cmd', text: cmdText }];
    if (out === null) {
      setCmdHistory(h => [...h, cmdText].slice(-50));
      setHistoryIdx(-1);
      return;
    }
    out.forEach(el => newEntries.push({ type: 'out', el: el === '' ? <>&nbsp;</> : el }));
    setHistory(h => [...h, ...newEntries]);
    setCmdHistory(h => [...h, cmdText].slice(-50));
    setHistoryIdx(-1);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (input.trim()) executeCommand(input); else setHistory(h => [...h, { type: 'cmd', text: '' }]);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const newIdx = historyIdx === -1 ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(newIdx);
      setInput(cmdHistory[newIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx === -1) return;
      const newIdx = historyIdx + 1;
      if (newIdx >= cmdHistory.length) { setHistoryIdx(-1); setInput(''); }
      else { setHistoryIdx(newIdx); setInput(cmdHistory[newIdx]); }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const parts = input.split(' ');
      if (parts.length === 1) { const c = autoComplete(input); if (c) setInput(c + ' '); }
    } else if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault(); clear();
    }
  };

  const dragging = useRef(false);
  const startY = useRef(0);
  const startH = useRef(0);

  const onResizeStart = (e: React.MouseEvent) => {
    dragging.current = true;
    startY.current = e.clientY;
    startH.current = height;
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
    const onMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      const dy = startY.current - ev.clientY;
      const newH = Math.max(60, Math.min(500, startH.current + dy));
      onResize?.(newH);
    };
    const onUp = () => {
      dragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div style={{ borderTop: '1px solid var(--border-2)', background: 'var(--bg-panel)', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
      <div
        onMouseDown={onResizeStart}
        style={{ height: 4, cursor: 'row-resize', background: 'transparent', transition: 'background 0.15s' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--accent)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
        title="drag to resize"
      />
      <div style={{
        background: 'var(--bg-panel-2)', display: 'flex',
        fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-mute)',
        borderBottom: '1px solid var(--border)',
      }}>
        {['PROBLEMS', 'OUTPUT', 'DEBUG', 'TERMINAL'].map((t, i) => (
          <div key={i} style={{
            padding: '8px 14px', letterSpacing: 1,
            color: i === 3 ? 'var(--fg)' : 'var(--fg-mute)',
            borderBottom: i === 3 ? '2px solid var(--accent)' : '2px solid transparent',
            background: i === 3 ? 'var(--bg-panel)' : 'transparent',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            {t}
            {i === 0 && <span style={{ background: 'var(--red)', color: '#000', padding: '0 4px', borderRadius: 3, fontSize: 9 }}>0</span>}
          </div>
        ))}
        <div style={{ marginLeft: 'auto', padding: '6px 12px', display: 'flex', gap: 10 }}>
          <span style={{ fontSize: 9 }}>zsh</span>
          <span>+</span><span>⛶</span><span>×</span>
        </div>
      </div>

      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        className="hide-scrollbar"
        style={{
          padding: '10px 16px', fontFamily: 'var(--mono)', fontSize: 12,
          color: 'var(--fg)', lineHeight: 1.7, height, overflowY: 'auto', cursor: 'text',
        }}
      >
        {history.map((h, i) => (
          <div key={i}>{h.type === 'cmd' ? <><Prompt />{h.text}</> : h.el}</div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          <Prompt />
          <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
            <span style={{ color: 'var(--fg)', fontFamily: 'var(--mono)', fontSize: 12, whiteSpace: 'pre' }}>{input}</span>
            <span style={{
              display: 'inline-block', width: 8, height: 14,
              background: 'var(--accent)', marginLeft: 1,
              animation: 'terminal-blink 1.1s steps(2, start) infinite',
              boxShadow: '0 0 6px rgba(200,255,0,0.4)',
            }} />
            <input
              ref={inputRef} value={input}
              onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
              style={{
                position: 'absolute', inset: 0,
                background: 'transparent', border: 'none', outline: 'none',
                color: 'transparent', fontFamily: 'var(--mono)', fontSize: 12,
                caretColor: 'transparent', width: '100%',
              }}
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main IDE Component ──

export default function IDE() {
  const [openTabs, setOpenTabs] = useState(DEFAULT_OPEN_TABS);
  const [activeTab, setActiveTab] = useState('whoami.md');
  const [dirtyTabs, setDirtyTabs] = useState<Record<string, boolean>>({});
  const [quickOpenOpen, setQuickOpenOpen] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(180);
  const [sidePanel, setSidePanel] = useState<SidePanel>('explorer');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setQuickOpenOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const openFile = (filename: string) => {
    if (!IDE_FILES[filename]) return;
    setOpenTabs(tabs => tabs.includes(filename) ? tabs : [...tabs, filename]);
    setActiveTab(filename);
    setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, 0);
  };

  const closeTab = (filename: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (openTabs.length <= 1) return;
    setOpenTabs(tabs => {
      const next = tabs.filter(t => t !== filename);
      if (activeTab === filename) {
        const idx = tabs.indexOf(filename);
        setActiveTab(next[Math.max(0, idx - 1)] || next[0]);
      }
      return next;
    });
    setDirtyTabs(d => { const n = { ...d }; delete n[filename]; return n; });
  };

  const markDirty = (filename: string) => setDirtyTabs(d => ({ ...d, [filename]: true }));

  const file = IDE_FILES[activeTab];

  return (
    <div style={{ padding: '40px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-2)',
          borderRadius: 12, overflow: 'hidden',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3), 0 20px 60px rgba(0,0,0,0.6), 0 40px 120px rgba(200,255,0,0.06), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}>
          {/* Title bar */}
          <div style={{
            background: 'var(--bg-panel-2)', padding: '10px 14px',
            display: 'flex', alignItems: 'center', gap: 10,
            borderBottom: '1px solid var(--border-2)',
          }}>
            <span style={{ width: 12, height: 12, borderRadius: 999, background: '#ff5f56' }} />
            <span style={{ width: 12, height: 12, borderRadius: 999, background: '#ffbd2e' }} />
            <span style={{ width: 12, height: 12, borderRadius: 999, background: '#27c93f' }} />
            <div style={{
              flex: 1, textAlign: 'center',
              fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg-dim)',
            }}>icampillo — portfolio.code-workspace</div>
            <button
              onClick={() => setQuickOpenOpen(true)}
              style={{
                fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-mute)',
                display: 'flex', alignItems: 'center', gap: 10,
                border: '1px solid var(--border-2)', padding: '2px 8px', borderRadius: 4,
                background: 'transparent', cursor: 'pointer',
              }}
            >
              <PulseDot />
              <span style={{ color: 'var(--fg-mute)' }}>⌕</span> search or run command
              <span style={{ color: 'var(--fg-mute)', marginLeft: 12 }}>⌘P</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="hide-scrollbar" style={{
            background: 'var(--bg-panel-2)', display: 'flex',
            borderBottom: '1px solid var(--border-2)', overflowX: 'auto',
          }}>
            {openTabs.map(tn => {
              const t = IDE_FILES[tn];
              if (!t) return null;
              const isActive = activeTab === tn;
              const isDirty = dirtyTabs[tn];
              return (
                <div
                  key={tn} onClick={() => setActiveTab(tn)}
                  style={{
                    padding: '8px 10px 8px 12px',
                    fontFamily: 'var(--mono)', fontSize: 11,
                    background: isActive ? 'var(--bg-panel)' : 'transparent',
                    color: isActive ? 'var(--fg)' : 'var(--fg-dim)',
                    borderRight: '1px solid var(--border)',
                    borderTop: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                    display: 'flex', alignItems: 'center', gap: 8,
                    cursor: 'pointer', flexShrink: 0,
                  }}
                >
                  <FileIcon ch={t.icon} color={t.iconColor} />
                  {tn}
                  <span
                    onClick={e => closeTab(tn, e)}
                    style={{
                      color: isDirty ? 'var(--accent)' : 'var(--fg-mute)',
                      marginLeft: 4, opacity: isDirty ? 1 : 0.6,
                      width: 16, height: 16, borderRadius: 3,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: isDirty ? 14 : 12, fontWeight: isDirty ? 700 : 400,
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                    title={isDirty ? 'unsaved changes — click to close' : 'close'}
                  >
                    {isDirty ? '●' : '×'}
                  </span>
                </div>
              );
            })}
            <div style={{ flex: 1 }} />
          </div>

          {/* Body grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '48px 220px 1fr 64px 300px',
            gridTemplateRows: '680px',
          }}>
            <ActivityBar activePanel={sidePanel} onPanelChange={setSidePanel} />
            {sidePanel === 'explorer' ? <Explorer activeFile={activeTab} onOpenFile={openFile} /> :
             sidePanel === 'search' ? <SearchPanel onOpenFile={openFile} /> :
             sidePanel === 'git' ? <GitPanel /> :
             sidePanel === 'debug' ? <DebugPanel /> :
             sidePanel === 'extensions' ? <ExtensionsPanel /> :
             sidePanel === 'accounts' ? <AccountsPanel /> :
             <SettingsPanel />}
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0, minWidth: 0 }}>
              <EditorContent filename={activeTab} onMarkDirty={markDirty} scrollRef={scrollRef} />
              <ExecutableTerminal height={terminalHeight} onResize={setTerminalHeight} />
            </div>
            <Minimap scrollRef={scrollRef} totalLines={file ? file.lines.length : 20} />
            <PreviewPanel activeFile={activeTab} />
          </div>

          {/* Status bar */}
          <div style={{
            background: 'var(--accent)', color: '#000',
            fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 500,
            padding: '4px 14px',
            display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <span>⎇ main</span>
              <span>✓ 0 errors</span>
              <span>⚡ 120ms</span>
              <span>{file ? file.lang : 'Plain'}</span>
              <span>UTF-8</span>
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <span>Ln {file ? file.lines.length + 1 : 1}, Col 1</span>
              <span>Spaces: 2</span>
              <span>● available · CET</span>
            </div>
          </div>
        </div>

        <RotatingCaption />
      </div>

      <QuickOpenModal open={quickOpenOpen} onClose={() => setQuickOpenOpen(false)} onSelect={openFile} />
    </div>
  );
}
