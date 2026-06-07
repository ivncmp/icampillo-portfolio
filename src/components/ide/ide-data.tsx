import type { ReactNode } from 'react';
import {
  BIO, SERVICES, PROJECTS, ENGAGEMENTS, CONTACT, SITE,
  type Service,
} from '../../data/index';

// Syntax highlighting color tokens
const kw = '#ff7b72';
const str = '#a5d6ff';
const num = '#79c0ff';
const fn = '#d2a8ff';
const prop = '#79c0ff';
const comm = '#8b949e';
const type = '#ffa657';

export interface IdeFile {
  icon: string;
  iconColor: string;
  lang: string;
  breadcrumb: string[];
  lines: ReactNode[];
}

// ─── File builders ──────────────────────────────────────────

function buildWhoami(): IdeFile {
  return {
    icon: 'md', iconColor: '#519aba', lang: 'Markdown',
    breadcrumb: ['icampillo', 'hero', 'whoami.md'],
    lines: [
      <><span style={{ color: kw }}>#</span> <span style={{ color: 'var(--fg)', fontWeight: 700 }}>{BIO.name}</span></>,
      <span style={{ color: comm, fontStyle: 'italic' }}>&gt; {BIO.location} · {BIO.timezone} · available {CONTACT.availability.quarter}</span>,
      '',
      <><span style={{ color: kw }}>##</span> What I do</>,
      '',
      ...BIO.roles.map((r, i) => (
        <span key={i}><span style={{ color: type }}>- </span><span style={{ color: prop }}>**{r.title}**</span> — {r.brief}</span>
      )),
      '',
      <><span style={{ color: kw }}>##</span> How I work</>,
      '',
      <>I take products from <span style={{ background: 'rgba(200,255,0,0.2)', color: 'var(--accent)', padding: '0 6px', borderRadius: 2 }}>0 → 100</span>:</>,
      <><span style={{ color: comm }}>1. </span>discovery + architecture</>,
      <><span style={{ color: comm }}>2. </span>build + ship + measure</>,
      <><span style={{ color: comm }}>3. </span>scale + lead team + iterate</>,
      '',
      <span style={{ color: comm }}>{'```bash'}</span>,
      <><span style={{ color: fn }}>$</span> {'./collab --role='}<span style={{ color: 'var(--accent-2)' }}>fractional-cto</span></>,
      <span style={{ color: 'var(--accent-2)' }}>✓ available {CONTACT.availability.quarter}</span>,
      <span style={{ color: comm }}>{'```'}</span>,
    ],
  };
}

function buildRoles(): IdeFile {
  return {
    icon: 'ts', iconColor: '#3178c6', lang: 'TypeScript',
    breadcrumb: ['icampillo', 'hero', 'roles.ts'],
    lines: [
      <><span style={{ color: comm }}>// engagement types & availability</span></>,
      <><span style={{ color: kw }}>import type</span> {'{'} <span style={{ color: type }}>Bio</span> {'}'} <span style={{ color: kw }}>from</span> <span style={{ color: str }}>'./whoami'</span>;</>,
      '',
      <><span style={{ color: kw }}>export type</span> <span style={{ color: type }}>Engagement</span> = {'{'}</>,
      <>  <span style={{ color: prop }}>role</span>: <span style={{ color: type }}>string</span>;</>,
      <>  <span style={{ color: prop }}>type</span>: <span style={{ color: str }}>'fractional'</span> | <span style={{ color: str }}>'advisory'</span> | <span style={{ color: str }}>'hands-on'</span>;</>,
      <>  <span style={{ color: prop }}>commitment</span>: <span style={{ color: type }}>string</span>;</>,
      '};',
      '',
      <><span style={{ color: kw }}>export const</span> <span style={{ color: prop }}>engagements</span>: <span style={{ color: type }}>Engagement</span>[] = [</>,
      ...ENGAGEMENTS.flatMap(eng => [
        <>  {'{'} <span style={{ color: prop }}>role</span>: <span style={{ color: str }}>'{eng.role}'</span>,</>,
        <>    <span style={{ color: prop }}>type</span>: <span style={{ color: str }}>'{eng.type}'</span>, <span style={{ color: prop }}>commitment</span>: <span style={{ color: str }}>'{eng.commitment}'</span> {'}'},</>,
      ]),
      '];',
      '',
      <><span style={{ color: kw }}>export const</span> <span style={{ color: prop }}>status</span> = <span style={{ color: str }}>'available'</span> <span style={{ color: kw }}>as const</span>;</>,
      <><span style={{ color: kw }}>export const</span> <span style={{ color: prop }}>quarter</span> = <span style={{ color: str }}>'{CONTACT.availability.quarter}'</span>;</>,
    ],
  };
}

function buildServicesList(): IdeFile {
  return {
    icon: 'ts', iconColor: '#3178c6', lang: 'TypeScript',
    breadcrumb: ['icampillo', 'services', 'services.ts'],
    lines: [
      <><span style={{ color: comm }}>// services I offer, typed</span></>,
      <><span style={{ color: kw }}>import</span> {'{'} <span style={{ color: 'var(--fg)' }}>Ivan</span> {'}'} <span style={{ color: kw }}>from</span> <span style={{ color: str }}>'./whoami'</span>;</>,
      '',
      <><span style={{ color: kw }}>export type</span> <span style={{ color: type }}>Service</span> = {'{'}</>,
      <>  <span style={{ color: prop }}>id</span>: <span style={{ color: type }}>string</span>;</>,
      <>  <span style={{ color: prop }}>title</span>: <span style={{ color: type }}>string</span>;</>,
      <>  <span style={{ color: prop }}>stack</span>: <span style={{ color: type }}>string</span>[];</>,
      <>  <span style={{ color: prop }}>depth</span>: <span style={{ color: str }}>'strategy'</span> | <span style={{ color: str }}>'hands-on'</span> | <span style={{ color: str }}>'both'</span>;</>,
      '};',
      '',
      <><span style={{ color: kw }}>export const</span> <span style={{ color: prop }}>services</span>: <span style={{ color: type }}>Service</span>[] = [</>,
      ...SERVICES.flatMap(svc => [
        <>  {'{'} <span style={{ color: prop }}>id</span>: <span style={{ color: str }}>'{svc.id}'</span>, <span style={{ color: prop }}>title</span>: <span style={{ color: str }}>'{svc.title}'</span>,</>,
        <>    <span style={{ color: prop }}>stack</span>: [{svc.tags.map((t, i) => <span key={i}><span style={{ color: str }}>'{t}'</span>{i < svc.tags.length - 1 ? ', ' : ''}</span>)}],</>,
        <>    <span style={{ color: prop }}>depth</span>: <span style={{ color: str }}>'{svc.depth}'</span> {'}'},</>,
      ]),
      '];',
      '',
      <><span style={{ color: comm }}>// ↓ scroll for full descriptions</span></>,
    ],
  };
}

function buildServiceDetail(svc: Service): IdeFile {
  const lines: ReactNode[] = [
    <><span style={{ color: comm }}>// {svc.title.toLowerCase()} — capabilities</span></>,
    <><span style={{ color: kw }}>import type</span> {'{'} <span style={{ color: type }}>Service</span> {'}'} <span style={{ color: kw }}>from</span> <span style={{ color: str }}>'./services'</span>;</>,
    '',
    <><span style={{ color: kw }}>export const</span> <span style={{ color: prop }}>{svc.id}</span> = {'{'}</>,
  ];

  if (svc.details) {
    for (const [key, values] of Object.entries(svc.details)) {
      lines.push(<>  <span style={{ color: prop }}>{key}</span>: [</>);
      for (let j = 0; j < values.length; j += 2) {
        const pair = values.slice(j, j + 2);
        lines.push(
          <>    {pair.map((v, k) => <span key={k}><span style={{ color: str }}>'{v}'</span>{k < pair.length - 1 || j + 2 < values.length ? ', ' : ''}</span>)}</>
        );
      }
      lines.push('  ],');
    }
  }

  lines.push('} as const;');
  lines.push('');

  if (svc.highlights) {
    for (const h of svc.highlights) {
      lines.push(<><span style={{ color: comm }}>// {h}</span></>);
    }
  }

  return {
    icon: 'ts', iconColor: '#3178c6', lang: 'TypeScript',
    breadcrumb: ['icampillo', 'services', `${svc.id}.ts`],
    lines,
  };
}

function buildProjects(): IdeFile {
  const featured = PROJECTS.filter(p => p.status !== 'archived').slice(0, 4);

  const lines: ReactNode[] = ['{'];

  lines.push(<>  <span style={{ color: str }}>"featured"</span>: [</>);

  for (const [i, p] of featured.entries()) {
    lines.push(<>    {'{'}</>);
    lines.push(<>      <span style={{ color: str }}>"id"</span>: <span style={{ color: str }}>"{p.id}"</span>,</>);
    lines.push(<>      <span style={{ color: str }}>"name"</span>: <span style={{ color: str }}>"{p.name}"</span>,</>);
    lines.push(<>      <span style={{ color: str }}>"role"</span>: <span style={{ color: str }}>"{p.role}"</span>,</>);
    lines.push(<>      <span style={{ color: str }}>"status"</span>: <span style={{ color: p.status === 'live' ? 'var(--accent-2)' : p.status === 'oss' ? 'var(--cyan)' : str }}>"{p.status}"</span>,</>);
    lines.push(<>      <span style={{ color: str }}>"tag"</span>: <span style={{ color: str }}>"{p.tag}"</span>,</>);
    lines.push(<>      <span style={{ color: str }}>"stack"</span>: [{p.stack.slice(0, 3).map((s, k) => <span key={k}><span style={{ color: str }}>"{s}"</span>{k < Math.min(p.stack.length, 3) - 1 ? ', ' : ''}</span>)}]</>);
    lines.push(<>    {'}'}{i < featured.length - 1 ? ',' : ''}</>);
  }

  lines.push(<>  ],</>);
  lines.push(<>  <span style={{ color: str }}>"total"</span>: <span style={{ color: num }}>{PROJECTS.length}</span>,</>);
  lines.push(<>  <span style={{ color: str }}>"years_shipping"</span>: <span style={{ color: num }}>{BIO.metrics[0].target}</span>,</>);
  lines.push(<>  <span style={{ color: str }}>"open_to_projects"</span>: <span style={{ color: num }}>true</span></>);
  lines.push('}');

  return {
    icon: '{}', iconColor: '#cbcb41', lang: 'JSON',
    breadcrumb: ['icampillo', 'work', 'projects.json'],
    lines,
  };
}

function buildContact(): IdeFile {
  return {
    icon: '$', iconColor: '#7ee787', lang: 'YAML',
    breadcrumb: ['icampillo', 'root', 'contact.yml'],
    lines: [
      <><span style={{ color: comm }}># the fastest path to working together</span></>,
      '',
      <><span style={{ color: prop }}>name</span>: {BIO.name}</>,
      <><span style={{ color: prop }}>email</span>: <a href={`mailto:${BIO.email}`} style={{ color: 'var(--accent-2)', textDecoration: 'underline' }}>{BIO.email}</a></>,
      <><span style={{ color: prop }}>location</span>: {BIO.location} <span style={{ color: comm }}>({BIO.timezone})</span></>,
      <><span style={{ color: prop }}>response_time</span>: <span style={{ color: num }}>{CONTACT.responseTime}</span></>,
      '',
      <><span style={{ color: prop }}>availability</span>:</>,
      <>  <span style={{ color: prop }}>status</span>: <span style={{ color: 'var(--accent-2)' }}>{CONTACT.availability.status}</span></>,
      <>  <span style={{ color: prop }}>quarter</span>: {CONTACT.availability.quarter}</>,
      <>  <span style={{ color: prop }}>commitment</span>: <span style={{ color: str }}>"{CONTACT.availability.commitment}"</span></>,
      '',
      <><span style={{ color: prop }}>engagements</span>:</>,
      ...ENGAGEMENTS.map((eng, i) => (
        <span key={i}>  - <span style={{ color: str }}>{eng.role.toLowerCase().replace(/\s+/g, '-')}</span></span>
      )),
      '',
      <><span style={{ color: prop }}>elsewhere</span>:</>,
      ...Object.entries(CONTACT.social).map(([key, value], i) => (
        <span key={i}>  <span style={{ color: prop }}>{key}</span>: <span style={{ color: 'var(--accent-2)' }}>{value}</span></span>
      )),
      '',
      <><span style={{ color: comm }}># shipped with ❤ from Madrid</span></>,
    ],
  };
}

function buildReadme(): IdeFile {
  return {
    icon: 'md', iconColor: '#519aba', lang: 'Markdown',
    breadcrumb: ['icampillo', 'root', 'README.md'],
    lines: [
      <><span style={{ color: kw }}>#</span> <span style={{ color: 'var(--fg)', fontWeight: 700 }}>icampillo.com</span></>,
      '',
      <span style={{ color: comm }}>&gt; Personal portfolio — v{SITE.version}</span>,
      '',
      <><span style={{ color: kw }}>##</span> Stack</>,
      ...SITE.siteStack.map((item, i) => (
        <span key={i}><span style={{ color: type }}>- </span>{item}</span>
      )),
      '',
      <><span style={{ color: kw }}>##</span> Sections</>,
      <><span style={{ color: type }}>- </span>{SITE.sections.slice(0, 4).join(' · ')}</>,
      <><span style={{ color: type }}>- </span>{SITE.sections.slice(4).join(' · ')}</>,
      '',
      <><span style={{ color: kw }}>##</span> Run locally</>,
      <span style={{ color: comm }}>{'```bash'}</span>,
      <><span style={{ color: fn }}>$</span> npm install</>,
      <><span style={{ color: fn }}>$</span> npm run dev</>,
      <span style={{ color: comm }}>{'```'}</span>,
      '',
      <><span style={{ color: kw }}>##</span> License</>,
      <>MIT © 2026 {BIO.name}</>,
    ],
  };
}

// ─── Build all IDE files ────────────────────────────────────

const serviceDetailFiles: Record<string, IdeFile> = {};
for (const svc of SERVICES) {
  if (svc.details) {
    serviceDetailFiles[`${svc.id}.ts`] = buildServiceDetail(svc);
  }
}

export const IDE_FILES: Record<string, IdeFile> = {
  'whoami.md': buildWhoami(),
  'roles.ts': buildRoles(),
  'services.ts': buildServicesList(),
  ...serviceDetailFiles,
  'projects.json': buildProjects(),
  'contact.yml': buildContact(),
  'README.md': buildReadme(),
};

export const QUICK_OPEN_ITEMS = Object.entries(IDE_FILES).map(([name, file]) => ({
  name,
  path: file.breadcrumb.slice(1).join('/'),
  icon: file.icon,
  iconColor: file.iconColor,
}));

export const DEFAULT_OPEN_TABS = ['whoami.md', 'services.ts', 'projects.json', 'contact.yml'];
