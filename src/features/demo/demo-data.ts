export type DemoAuthUserRecord = {
  id: string
  email: string
  password: string
  fullName: string
  username: string
  avatarUrl: string
  headline: string
  bio: string
  location: string
  githubUrl: string
  linkedinUrl: string
  websiteUrl: string
  isPublic: boolean
}

export type DemoStackRecord = {
  id: string
  name: string
  slug: string
  category: 'frontend' | 'backend' | 'mobile' | 'database' | 'devops' | 'design' | 'tooling'
}

export type DemoProjectRecord = {
  id: string
  profileId: string
  title: string
  slug: string
  description: string
  projectUrl: string
  repoUrl: string
  isFeatured: boolean
  visibility: 'public' | 'private'
  stackSlugs: string[]
}

export const demoStacks: DemoStackRecord[] = [
  { id: 'stack-vue', name: 'Vue', slug: 'vue', category: 'frontend' },
  { id: 'stack-typescript', name: 'TypeScript', slug: 'typescript', category: 'frontend' },
  { id: 'stack-tailwind', name: 'Tailwind CSS', slug: 'tailwind-css', category: 'frontend' },
  { id: 'stack-supabase', name: 'Supabase', slug: 'supabase', category: 'backend' },
  { id: 'stack-postgres', name: 'PostgreSQL', slug: 'postgresql', category: 'database' },
  { id: 'stack-python', name: 'Python', slug: 'python', category: 'backend' },
  { id: 'stack-fastapi', name: 'FastAPI', slug: 'fastapi', category: 'backend' },
  { id: 'stack-react', name: 'React', slug: 'react', category: 'frontend' },
]

export const demoUsers: DemoAuthUserRecord[] = [
  {
    id: 'demo-user-1',
    email: 'demo@gilvan.dev',
    password: '123456',
    fullName: 'Gilvan Oliveira',
    username: 'gilvanpoliveira',
    avatarUrl: 'https://avatars.githubusercontent.com/u/583231?v=4',
    headline: 'Desenvolvedor Full Stack | Vue, TypeScript, APIs REST',
    bio: 'Perfil demo principal para navegação local do Developer Album.',
    location: 'Pernambuco, Brasil',
    githubUrl: 'https://github.com/GilvanPOliveira',
    linkedinUrl: 'https://www.linkedin.com/',
    websiteUrl: 'https://gilvanpoliveira.github.io/',
    isPublic: true,
  },
  {
    id: 'demo-user-2',
    email: 'maria@example.com',
    password: '123456',
    fullName: 'Maria Souza',
    username: 'mariacodes',
    avatarUrl: 'https://i.pravatar.cc/300?img=5',
    headline: 'Frontend Engineer | Vue, Design Systems e UX',
    bio: 'Especialista em interfaces escaláveis, acessibilidade e experiência de usuário.',
    location: 'São Paulo, Brasil',
    githubUrl: 'https://github.com/octocat',
    linkedinUrl: 'https://www.linkedin.com/',
    websiteUrl: 'https://example.com/maria',
    isPublic: true,
  },
  {
    id: 'demo-user-3',
    email: 'joao@example.com',
    password: '123456',
    fullName: 'João Lima',
    username: 'joaolima',
    avatarUrl: 'https://i.pravatar.cc/300?img=12',
    headline: 'Backend Developer | Python, FastAPI e PostgreSQL',
    bio: 'Foco em APIs robustas, modelagem relacional e integrações de sistemas.',
    location: 'Recife, Brasil',
    githubUrl: 'https://github.com/torvalds',
    linkedinUrl: 'https://www.linkedin.com/',
    websiteUrl: 'https://example.com/joao',
    isPublic: true,
  },
]

export const demoProjects: DemoProjectRecord[] = [
  {
    id: 'demo-project-1',
    profileId: 'demo-user-1',
    title: 'Developer Album',
    slug: 'developer-album',
    description: 'Produto final com perfis em cards, álbum, favoritos e descoberta de devs.',
    projectUrl: 'https://example.com/developer-album',
    repoUrl: 'https://github.com/GilvanPOliveira',
    isFeatured: true,
    visibility: 'public',
    stackSlugs: ['vue', 'typescript', 'tailwind-css', 'supabase'],
  },
  {
    id: 'demo-project-2',
    profileId: 'demo-user-2',
    title: 'Design System Lab',
    slug: 'design-system-lab',
    description: 'Biblioteca de componentes acessíveis para produtos internos.',
    projectUrl: 'https://example.com/design-system',
    repoUrl: 'https://github.com/octocat',
    isFeatured: true,
    visibility: 'public',
    stackSlugs: ['vue', 'typescript', 'tailwind-css'],
  },
  {
    id: 'demo-project-3',
    profileId: 'demo-user-3',
    title: 'API Sync Dashboard',
    slug: 'api-sync-dashboard',
    description: 'Sincronização de snapshots de dados externos com persistência local.',
    projectUrl: 'https://example.com/api-sync-dashboard',
    repoUrl: 'https://github.com/torvalds',
    isFeatured: true,
    visibility: 'public',
    stackSlugs: ['python', 'fastapi', 'postgresql'],
  },
]

export function findDemoUserByEmail(email: string): DemoAuthUserRecord | null {
  const normalized = email.trim().toLowerCase()
  return demoUsers.find((user) => user.email.toLowerCase() === normalized) ?? null
}

export function findDemoUserById(id: string): DemoAuthUserRecord | null {
  return demoUsers.find((user) => user.id === id) ?? null
}
