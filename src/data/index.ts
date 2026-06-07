// ─── Shared types ───────────────────────────────────────────

export interface Role {
  title: string;
  brief: string;
}

export interface Metric {
  label: string;
  value: string;
  target: number;
  suffix: string;
  cmd: string;
  tag: string;
}

export interface ProjectHighlight {
  label: string;
  value: string;
  color: string;
}

export interface BioData {
  name: string;
  firstName: string;
  lastName: string;
  handle: string;
  email: string;
  location: string;
  timezone: string;
  tagline: string;
  taglineEn: string;
  summary: string;
  summaryEn: string;
  roles: Role[];
  metrics: Metric[];
  shortTags: string[];
  projectHighlights: ProjectHighlight[];
}

export interface Engagement {
  role: string;
  type: 'fractional' | 'advisory' | 'hands-on';
  commitment: string;
}

export interface Channel {
  icon: string;
  label: string;
  value: string;
  url: string;
}

export interface ContactInfo {
  responseTime: string;
  availability: {
    status: string;
    quarter: string;
    commitment: string;
  };
  channels: Channel[];
  social: Record<string, string>;
}

export interface SiteInfo {
  version: string;
  siteStack: string[];
  sections: string[];
}

export interface Service {
  id: string;
  cmd: string;
  title: string;
  desc: string;
  descEn: string;
  tags: string[];
  icon: string;
  depth: 'strategy' | 'hands-on' | 'both';
  depthScore: number;
  details?: Record<string, string[]>;
  highlights?: string[];
}

export interface Project {
  id: string;
  name: string;
  tag: string;
  year: string;
  desc: string;
  descEn: string;
  stack: string[];
  role: string;
  status: 'live' | 'beta' | 'oss' | 'archived';
  url?: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  years: string;
  type: 'founder' | 'lead' | 'ic' | 'teaching';
  desc: string;
  descEn: string;
  tags: string[];
}

export interface OssRepo {
  name: string;
  desc: string;
  stars: number;
  lang: string;
  langColor: string;
}

// ─── Bio ────────────────────────────────────────────────────

export const BIO: BioData = {
  name: 'Iván Campillo',
  firstName: 'Iván',
  lastName: 'Campillo',
  handle: '@icampillo',
  email: 'hola@icampillo.com',
  location: 'Madrid, ES',
  timezone: 'CET',
  tagline: 'Cloud Architect & Head of Technology con +20 años impulsando innovación',
  taglineEn: 'Cloud Architect & Head of Technology with 20+ years driving innovation',
  summary:
    'No solo desarrollo — diseño la arquitectura, lidero el equipo y ejecuto la visión. De la idea al producto en producción.',
  summaryEn:
    'I don\'t just develop — I design the architecture, lead the team, and execute the vision. From idea to production.',
  roles: [
    { title: 'Software Engineer', brief: 'end-to-end product builder.' },
    { title: 'Cloud Architect', brief: 'AWS, GCP, K8s, Terraform.' },
    { title: 'AI Engineer', brief: 'agents, RAG, fine-tuning.' },
    { title: 'Blockchain Engineer', brief: 'Solidity, DeFi, L2.' },
    { title: 'Technical Leader', brief: 'fractional CTO & Head of Tech.' },
  ],
  metrics: [
    { label: 'years shipping', value: '20+', target: 20, suffix: '+', cmd: 'uptime', tag: 'since 2006' },
    { label: 'products shipped', value: '40+', target: 40, suffix: '+', cmd: 'git log --count', tag: '0 → production' },
    { label: 'teams led', value: '8', target: 8, suffix: '', cmd: 'who --tech-lead', tag: 'engineering + product' },
    { label: 'tech stacks', value: '20+', target: 20, suffix: '+', cmd: 'ls ~/.toolbox', tag: 'fullstack · cloud · web3' },
  ],
  shortTags: ['ts', 'py', 'sol', 'rs', 'aws'],
  projectHighlights: [
    { label: 'TVL deployed', value: '$4.2M', color: 'var(--accent)' },
    { label: 'Tasks/day', value: '80k', color: 'var(--accent-2)' },
    { label: 'GitHub stars', value: '1.8k', color: '#79c0ff' },
    { label: 'Peak TPS', value: '2.4k', color: '#ffa657' },
    { label: 'Uptime', value: '99.99%', color: 'var(--purple)' },
  ],
};

// ─── Engagements ────────────────────────────────────────────

export const ENGAGEMENTS: Engagement[] = [
  { role: 'Fractional CTO', type: 'fractional', commitment: '2-3 days/week' },
  { role: 'Head of Tech', type: 'fractional', commitment: '2-3 days/week' },
  { role: 'Lead Architect', type: 'hands-on', commitment: 'project-based' },
  { role: 'Technical Advisor', type: 'advisory', commitment: '4h/month' },
];

// ─── Contact ────────────────────────────────────────────────

export const CONTACT: ContactInfo = {
  responseTime: '24h',
  availability: {
    status: 'selectively_available',
    quarter: 'Q2 2026',
    commitment: '1-3 days/week · 3-6 month projects',
  },
  channels: [
    { icon: '✉', label: 'email', value: BIO.email, url: `mailto:${BIO.email}` },
    { icon: '⎇', label: 'github', value: 'github.com/ivncmp', url: 'https://github.com/ivncmp' },
    { icon: '◈', label: 'linkedin', value: '/in/ivan-campillo-sw', url: 'https://www.linkedin.com/in/ivan-campillo-sw/' },
    { icon: '◆', label: 'calendly', value: 'schedule a 30min call', url: '#' },
  ],
  social: {
    github: 'github.com/ivncmp',
    linkedin: 'in/ivan-campillo-sw',
    x: '@icampillo',
  },
};

// ─── Site ───────────────────────────────────────────────────

export const SITE: SiteInfo = {
  version: '4.0.0',
  siteStack: [
    'Astro 6 + TypeScript',
    'React islands for interactive IDE',
    'Self-hosted variable fonts',
    'Deployed on Vercel',
  ],
  sections: ['whoami', 'services', 'work', 'stack', 'career', 'oss', 'contact'],
};

// ─── Services ───────────────────────────────────────────────

export const SERVICES: Service[] = [
  {
    id: 'cloud',
    cmd: 'cloud-architect',
    title: 'Cloud Architecture',
    desc: 'Diseño de infraestructuras escalables en AWS, GCP y Azure. IaC, observabilidad y cost optimization.',
    descEn: 'Scalable infrastructure design on AWS, GCP, and Azure. IaC, observability, and cost optimization.',
    tags: ['AWS', 'Terraform', 'K8s', 'Serverless'],
    icon: '☁',
    depth: 'both',
    depthScore: 95,
    details: {
      providers: ['AWS', 'GCP', 'Azure'],
      patterns: ['Microservices', 'Event-driven (CQRS + ES)', 'Serverless', 'Edge computing'],
      iac: ['Terraform', 'CDK', 'Pulumi'],
      observability: ['Datadog', 'Grafana', 'OpenTelemetry'],
      certifications: ['AWS Solutions Architect Pro', 'GCP Professional Cloud Architect'],
    },
    highlights: ['cost optimization: avg 40% reduction', 'zero-downtime deployments since 2019'],
  },
  {
    id: 'ai',
    cmd: 'ai-engineer',
    title: 'AI Engineering',
    desc: 'Agentes autónomos, RAG, fine-tuning y pipelines MLOps. De prototipo a producción.',
    descEn: 'Autonomous agents, RAG, fine-tuning, and MLOps pipelines. From prototype to production.',
    tags: ['LLMs', 'RAG', 'Agents', 'MLOps'],
    icon: '◈',
    depth: 'hands-on',
    depthScore: 88,
    details: {
      specialties: ['LLM Agents & Orchestration', 'RAG pipelines (multi-tenant)', 'Fine-tuning (LoRA, QLoRA)', 'MLOps & model deployment'],
      frameworks: ['LangGraph', 'LlamaIndex', 'Hugging Face', 'Modal'],
      models: ['GPT-4', 'Claude', 'Llama', 'Mistral'],
      vectorStores: ['pgvector', 'Qdrant', 'Pinecone'],
    },
    highlights: ['cricket-ai: 80k tasks/day, 94% accuracy'],
  },
  {
    id: 'web3',
    cmd: 'blockchain-dev',
    title: 'Blockchain & Web3',
    desc: 'Smart contracts, protocolos DeFi y dApps. Solidity, EVM, Layer 2 y seguridad on-chain.',
    descEn: 'Smart contracts, DeFi protocols, and dApps. Solidity, EVM, Layer 2, and on-chain security.',
    tags: ['Solidity', 'EVM', 'DeFi', 'L2'],
    icon: '◆',
    depth: 'hands-on',
    depthScore: 82,
    details: {
      chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'],
      stack: ['Solidity', 'Foundry', 'Hardhat', 'viem', 'wagmi'],
      defi: ['AMM design', 'Lending protocols', 'Cross-chain bridges', 'Yield optimization'],
      security: ['Formal verification', 'Audit-ready code'],
    },
    highlights: ['stars-protocol: $4.2M TVL on mainnet'],
  },
  {
    id: 'fullstack',
    cmd: 'full-stack',
    title: 'Full Stack Dev',
    desc: 'TypeScript end-to-end. Next.js, Node, Postgres. APIs robustas y UIs que no se rompen.',
    descEn: 'End-to-end TypeScript. Next.js, Node, Postgres. Robust APIs and UIs that don\'t break.',
    tags: ['TS', 'Next.js', 'Node', 'Postgres'],
    icon: '▦',
    depth: 'hands-on',
    depthScore: 96,
  },
  {
    id: 'lead',
    cmd: 'tech-lead',
    title: 'Technical Leadership',
    desc: 'Fractional CTO y Head of Tech. Roadmap, hiring, proceso y cultura de ingeniería.',
    descEn: 'Fractional CTO and Head of Tech. Roadmap, hiring, process, and engineering culture.',
    tags: ['CTO', 'Strategy', 'Hiring', 'Process'],
    icon: '◉',
    depth: 'strategy',
    depthScore: 90,
  },
  {
    id: 'product',
    cmd: 'product-eng',
    title: '0 → 100 Products',
    desc: 'De la idea al MVP, del MVP al escalado. Discovery, build, launch, iterate.',
    descEn: 'From idea to MVP, from MVP to scale. Discovery, build, launch, iterate.',
    tags: ['Discovery', 'MVP', 'Scale', 'Ship'],
    icon: '▶',
    depth: 'both',
    depthScore: 92,
  },
];

// ─── Projects ───────────────────────────────────────────────

export const PROJECTS: Project[] = [
  {
    id: '5TARS',
    name: '5TARS',
    tag: 'Web3 · Gaming',
    year: '2022 — 2023',
    desc: 'Juego Web3 de fantasy sports y predicciones de fútbol con NFTs. Lanzado en MENA con Arsenal Innovation Lab y FlatLabs.',
    descEn: 'Web3 fantasy sports and football prediction game with NFTs. Launched in MENA with Arsenal Innovation Lab and FlatLabs.',
    stack: ['AWS', 'Node.js', 'Angular', 'SQL', 'NoSQL', 'Web3'],
    role: 'Founder · CTO',
    status: 'archived',
  },
  {
    id: 'waveconomy',
    name: 'Waveconomy',
    tag: 'SaaS · Web3',
    year: '2024 — Now',
    desc: 'SaaS B2B de evaluación de empresas con economía de tokens Web3, reviews crowdsourced, leaderboards sectoriales e informes premium.',
    descEn: 'B2B company evaluation SaaS with Web3 token economy, crowdsourced reviews, sector leaderboards, and premium reports.',
    stack: ['React', 'TypeScript', 'Supabase', 'Material-UI', 'Web3'],
    role: 'CTO',
    status: 'live',
    url: 'https://github.com/ivncmp/waveconomy',
  },
  {
    id: 'dbrain',
    name: 'dbrain',
    tag: 'AI · Dev Tools',
    year: '2025',
    desc: 'Servidor de memoria persistente para asistentes AI. Taxonomía PARA, tiers hot/warm/cold, interfaz dual REST + MCP.',
    descEn: 'Persistent memory server for AI assistants. PARA taxonomy, hot/warm/cold tiers, dual REST + MCP interface.',
    stack: ['TypeScript', 'Fastify', 'SQLite', 'MCP', 'REST'],
    role: 'Creator',
    status: 'oss',
    url: 'https://github.com/ivncmp/dbrain',
  },
  {
    id: 'clau-lessons',
    name: 'Clau Lessons',
    tag: 'Edu · Gamification',
    year: '2025',
    desc: 'Plataforma educativa interactiva con lecciones gamificadas, seguimiento de progreso y UI kid-friendly.',
    descEn: 'Interactive educational platform with gamified lessons, progress tracking, and kid-friendly UI.',
    stack: ['React', 'TypeScript', 'Vite'],
    role: 'Creator',
    status: 'oss',
    url: 'https://github.com/ivncmp/clau-lessons',
  },
  {
    id: 'my-bowling',
    name: 'My Bowling',
    tag: 'SaaS · Sports',
    year: '2025',
    desc: 'Plataforma de gestión de boleras multi-federación. Administración de clubes, estadísticas, competiciones y extracción de PDFs con AI.',
    descEn: 'Multi-federation bowling management platform. Club administration, player stats, competitions, and AI-powered PDF data extraction.',
    stack: ['React', 'TypeScript', 'Supabase', 'Deno', 'Edge Functions'],
    role: 'Creator',
    status: 'oss',
    url: 'https://github.com/ivncmp/my-bowling',
  },
  {
    id: 'panorama',
    name: 'Panorama',
    tag: 'HR · SaaS',
    year: '2018 — 2022',
    desc: 'Plataforma inteligente de RRHH para reclutamiento, evaluación y desarrollo de talento en TheKeyTalent.',
    descEn: 'Intelligent HR platform for recruitment, assessment, and talent development at TheKeyTalent.',
    stack: ['Angular', 'Django', 'Python', 'Postgres', 'AWS'],
    role: 'CTO · Head of Technology',
    status: 'archived',
  },
  {
    id: 'aplygo',
    name: 'AplyGo',
    tag: 'HR · SaaS',
    year: '2018 — 2022',
    desc: 'Plataforma ágil de reclutamiento diseñada para empresas data-driven en TheKeyTalent.',
    descEn: 'Agile recruitment platform designed for data-driven companies at TheKeyTalent.',
    stack: ['Angular', 'Django', 'Python', 'Postgres', 'AWS'],
    role: 'CTO · Head of Technology',
    status: 'archived',
  },
  {
    id: 'apiversity',
    name: 'Apiversity',
    tag: 'API · Enterprise',
    year: '2014 — 2017',
    desc: 'La primera plataforma española de gestión de APIs. Nueva generación de API Managers en BBVA Next Technologies.',
    descEn: 'The first Spanish API management platform. Next-generation API Managers at BBVA Next Technologies.',
    stack: ['Java', 'Spring', 'Angular', 'AWS', 'Kafka', 'Cassandra'],
    role: 'Lead Software Architect',
    status: 'archived',
  },
  {
    id: 'claude-nice-wrapper',
    name: 'Claude Nice Wrapper',
    tag: 'AI · Dev Tools',
    year: '2025',
    desc: 'CLI wrapper de Claude con memoria persistente, inyección de conocimiento PARA, identidad de workspace y plantillas YAML.',
    descEn: 'Claude CLI wrapper with persistent memory, PARA knowledge injection, workspace identity, and YAML prompt templates.',
    stack: ['TypeScript', 'Claude API', 'YAML'],
    role: 'Creator',
    status: 'oss',
    url: 'https://github.com/ivncmp/claude-nice-wrapper',
  },
];

// ─── Stack ──────────────────────────────────────────────────

export const STACK: Record<string, string[]> = {
  Languages: ['TypeScript', 'Python', 'Solidity', 'Rust', 'Go'],
  'Cloud & Infra': ['AWS', 'GCP', 'Terraform', 'Kubernetes', 'Docker', 'Pulumi'],
  'AI / ML': ['PyTorch', 'LangGraph', 'LlamaIndex', 'Hugging Face', 'pgvector', 'Modal'],
  Web3: ['Solidity', 'Foundry', 'Hardhat', 'viem', 'wagmi', 'Ethers'],
  Frontend: ['Next.js', 'React', 'Tailwind', 'shadcn', 'Framer Motion'],
  Backend: ['Node.js', 'FastAPI', 'Postgres', 'Redis', 'Kafka', 'tRPC'],
  Observability: ['Datadog', 'Grafana', 'OpenTelemetry', 'Sentry'],
};

// ─── Experience ─────────────────────────────────────────────

export const EXPERIENCE: ExperienceEntry[] = [
  {
    company: 'Nfq Advisory, Solutions, Outsourcing',
    role: 'Experienced Senior Consultant',
    years: '2025 — Now',
    type: 'ic',
    desc: 'Equipo de Technical Design de Inditex en el IOP. Microservicios React y Java BFF, comunicación con APIs de Inditex BC.',
    descEn: 'Part of the Inditex Technical Design team at the IOP. Building React Microservices and Java BFF components, communication with Inditex BC APIs.',
    tags: ['React', 'Sonarqube', 'Java', 'Jira'],
  },
  {
    company: 'Valora Studio',
    role: 'Founder & CTO',
    years: '2017 — 2025',
    type: 'founder',
    desc: 'Fundé y lideré la tecnología de ValoraDigital. Plataforma ValoraFutbol, Gaming Studio, experiencias Web3 inmersivas y SaaS MetaStudio.',
    descEn: 'Founded and led technology at ValoraDigital. ValoraFutbol platform, Gaming Studio, immersive Web3 experiences, and MetaStudio SaaS.',
    tags: ['Web3', 'Cloud', 'SaaS', 'Gaming'],
  },
  {
    company: '5TARS.io',
    role: 'Founder & CTO',
    years: '2022 — 2025',
    type: 'founder',
    desc: 'Fantasy football Web3. Predice partidos, construye tu equipo y compite contra fans de todo el mundo por premios e incentivos.',
    descEn: 'Web3 fantasy football. Predict matches, build your dream team, and compete against fans worldwide for prizes and incentives.',
    tags: ['Web3', 'NFT', 'Football'],
  },
  {
    company: 'KeepCoding®',
    role: 'Blockchain Instructor',
    years: '2023 — 2025',
    type: 'teaching',
    desc: 'Instructor en bootcamp de blockchain. Desarrollo de smart contracts con web3.js y su operación en producción.',
    descEn: 'Blockchain bootcamp instructor. Smart contract development with web3.js and production operations.',
    tags: ['Blockchain', 'web3.js', 'Teaching'],
  },
  {
    company: 'The Key Talent',
    role: 'CTO — Head of Technology',
    years: '2018 — 2022',
    type: 'lead',
    desc: 'Head of Technology de la Software Factory. Arquitectura cloud AWS, Python/Django, Angular 9+, DynamoDB. Full Dockerized environment.',
    descEn: 'Head of Technology at the Software Factory. AWS cloud architecture, Python/Django, Angular 9+, DynamoDB. Fully Dockerized environment.',
    tags: ['Python', 'Django', 'AWS', 'Angular'],
  },
  {
    company: 'BBVA Next Technologies',
    role: 'Lead Software Architect',
    years: '2014 — 2017',
    type: 'lead',
    desc: 'Arquitecto principal de APIVERSITY, nueva generación de API Managers. Diseño front/back, Scrum Master, pre-venta técnica y speaker.',
    descEn: 'Lead architect of APIVERSITY, next-gen API Managers. Front/back design, Scrum Master, technical pre-sales, and speaker.',
    tags: ['API', 'SWAGGER', 'RAML', 'Keycloak'],
  },
  {
    company: 'Cerner Corporation',
    role: 'Software Engineering Team Lead',
    years: '2012 — 2014',
    type: 'lead',
    desc: 'Tech Lead en Cerner UK para el sector salud (NHS). Eclipse RCP, Java, servicios REST y Agile. MVP del equipo global 2013.',
    descEn: 'Tech Lead at Cerner UK for the health sector (NHS). Eclipse RCP, Java, REST services, and Agile. Global team MVP 2013.',
    tags: ['Java', 'Eclipse RCP', 'REST', 'NHS'],
  },
  {
    company: 'Dyaingenieria',
    role: '.NET Software Architect',
    years: '2010 — 2012',
    type: 'ic',
    desc: 'Gestión y desarrollo de aplicación web global de RRHH. .NET 4.0, SQL Server 2008. Desde candidatos hasta facturación.',
    descEn: 'Management and development of a global HR web application. .NET 4.0, SQL Server 2008. From candidates to invoicing.',
    tags: ['.NET', 'SQL Server', 'Web Dev'],
  },
  {
    company: 'GMV',
    role: 'C++ Ground Systems Engineer',
    years: '2011 — 2012',
    type: 'ic',
    desc: 'Sistemas de tierra para satélites de la ESA. C++ en Linux SUSE, interfaces CORBA, multithreading y MySQL.',
    descEn: 'Ground systems for ESA satellites. C++ on Linux SUSE, CORBA interfaces, multithreading, and MySQL.',
    tags: ['C++', 'Linux', 'CORBA', 'ESA'],
  },
  {
    company: 'Goal Systems',
    role: 'Software Engineer',
    years: '2008 — 2010',
    type: 'ic',
    desc: 'Software de optimización y planificación de horarios y tripulaciones para empresas de transporte: trenes, buses y metro.',
    descEn: 'Schedule and crew optimization software for transport companies: trains, buses, and metro.',
    tags: ['C', 'C++', 'C#', 'Transport'],
  },
  {
    company: 'Cashware',
    role: 'Software Engineer',
    years: '2006 — 2008',
    type: 'ic',
    desc: 'Programación de drivers y aplicaciones para proveedores financieros, banca y software de cajeros automáticos.',
    descEn: 'Driver programming and applications for financial providers, banking, and ATM software.',
    tags: ['C', 'C++', 'Java', 'Fintech'],
  },
];

// ─── OSS Repos ──────────────────────────────────────────────

export const OSS_REPOS: OssRepo[] = [
  { name: 'ivncmp/dbrain', desc: 'Persistent memory server for AI assistants — PARA taxonomy, MCP interface', stars: 0, lang: 'MCP + Fastify', langColor: '#d4a574' },
  { name: 'ivncmp/crayfish-js', desc: 'Lightweight TypeScript framework for AWS Lambda serverless — MVC + decorators', stars: 0, lang: 'AWS Lambda', langColor: '#FF9900' },
  { name: 'ivncmp/claude-nice-wrapper', desc: 'CLI wrapper for Claude with persistent memory and PARA knowledge injection', stars: 0, lang: 'Claude API', langColor: '#d97706' },
  { name: 'ivncmp/fake-os', desc: 'Browser-based fake OS simulation — windows, apps and file system', stars: 0, lang: 'React + TS', langColor: '#61dafb' },
  { name: 'ivncmp/awesome-web-scaffolding', desc: 'React 19 + TypeScript + Vite + Supabase — 100% Dockerized scaffolding', stars: 0, lang: 'React + Supabase', langColor: '#3ecf8e' },
];
