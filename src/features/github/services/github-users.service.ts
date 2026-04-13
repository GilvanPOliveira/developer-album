import type { GithubRepository, GithubUser, GithubUserSearchPayload } from '../../../types/domain'

type GithubSearchResponse = {
  total_count: number
  incomplete_results: boolean
  items: Array<{
    id: number
    login: string
    avatar_url: string
    html_url: string
    url: string
  }>
}

type GithubUserResponse = {
  id: number
  login: string
  name: string | null
  avatar_url: string
  url: string
  html_url: string
  bio: string | null
  location: string | null
  company: string | null
  blog: string | null
  twitter_username: string | null
  public_repos: number
  followers: number
  following: number
}

type GithubRepositoryResponse = {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  fork: boolean
}

type GithubSocialAccountResponse = {
  provider: string
  url: string
}

const GITHUB_API_BASE_URL = 'https://api.github.com'
const GITHUB_API_VERSION = '2022-11-28'
const SEARCH_PER_PAGE = 3
const MAX_REPOSITORIES_FOR_TOTALS = 100

function getHeaders() {
  const token = import.meta.env.VITE_GITHUB_TOKEN as string | undefined

  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': GITHUB_API_VERSION,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 403) {
      const remaining = response.headers.get('x-ratelimit-remaining')
      const reset = response.headers.get('x-ratelimit-reset')

      if (remaining === '0' && reset) {
        const resetDate = new Date(Number(reset) * 1000)
        throw new Error(
          `Limite da API do GitHub atingido. Tente novamente apÃ³s ${resetDate.toLocaleString('pt-BR')}.`,
        )
      }

      throw new Error('Acesso Ã  API do GitHub negado no momento.')
    }

    if (response.status === 404) {
      throw new Error('UsuÃ¡rio do GitHub nÃ£o encontrado.')
    }

    if (response.status === 422) {
      throw new Error('Busca invÃ¡lida no GitHub. Ajuste o termo informado.')
    }

    throw new Error('NÃ£o foi possÃ­vel consultar o GitHub.')
  }

  return response.json() as Promise<T>
}

function normalizeOptionalUrl(value: string | null | undefined): string | null {
  if (!value) {
    return null
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }

  return `https://${trimmed}`
}

function normalizeCompany(value: string | null): string | null {
  if (!value) {
    return null
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  return trimmed.replace(/^@/, '')
}

function normalizeBio(value: string | null): string | null {
  if (!value) {
    return null
  }

  const trimmed = value.trim()

  return trimmed || null
}

function mapGithubSearchUser(user: GithubSearchResponse['items'][number]): GithubUser {
  return {
    id: user.id,
    login: user.login,
    name: null,
    avatarUrl: user.avatar_url,
    profileUrl: user.url,
    htmlUrl: user.html_url,
    bio: null,
    location: null,
    company: null,
    blog: null,
    twitterUsername: null,
    publicRepos: 0,
    followers: 0,
    following: 0,
    totalStars: 0,
  }
}

function mapGithubRepository(repo: GithubRepositoryResponse): GithubRepository {
  return {
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    htmlUrl: repo.html_url,
    homepage: normalizeOptionalUrl(repo.homepage),
    language: repo.language,
    stargazersCount: repo.stargazers_count,
    forksCount: repo.forks_count,
    updatedAt: repo.updated_at,
  }
}

async function fetchRepositories(login: string): Promise<GithubRepository[]> {
  const reposUrl = new URL(`${GITHUB_API_BASE_URL}/users/${login}/repos`)
  reposUrl.searchParams.set('per_page', String(MAX_REPOSITORIES_FOR_TOTALS))
  reposUrl.searchParams.set('sort', 'updated')
  reposUrl.searchParams.set('type', 'owner')

  const response = await fetch(reposUrl.toString(), {
    method: 'GET',
    headers: getHeaders(),
  })

  const repos = await parseResponse<GithubRepositoryResponse[]>(response)

  return repos
    .filter((repo) => !repo.fork)
    .map(mapGithubRepository)
    .sort((a, b) => {
      if (b.stargazersCount !== a.stargazersCount) {
        return b.stargazersCount - a.stargazersCount
      }

      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
}

async function fetchSocialAccounts(login: string): Promise<GithubSocialAccountResponse[]> {
  const url = new URL(`${GITHUB_API_BASE_URL}/users/${login}/social_accounts`)
  url.searchParams.set('per_page', '100')

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: getHeaders(),
  })

  if (!response.ok) {
    if (response.status === 404) {
      return []
    }

    if (response.status === 403) {
      return []
    }

    return []
  }

  return response.json() as Promise<GithubSocialAccountResponse[]>
}

function pickTwitterUsername(
  user: GithubUserResponse,
  socialAccounts: GithubSocialAccountResponse[],
): string | null {
  if (user.twitter_username?.trim()) {
    return user.twitter_username.trim()
  }

  const twitterAccount = socialAccounts.find((account) => account.provider.toLowerCase() === 'twitter')

  if (!twitterAccount?.url) {
    return null
  }

  try {
    const parsed = new URL(twitterAccount.url)
    const handle = parsed.pathname.replace(/\//g, '').trim()
    return handle || null
  } catch {
    return null
  }
}

function pickBlogUrl(
  user: GithubUserResponse,
  repositories: GithubRepository[],
  socialAccounts: GithubSocialAccountResponse[],
): string | null {
  const normalizedUserBlog = normalizeOptionalUrl(user.blog)

  if (normalizedUserBlog) {
    return normalizedUserBlog
  }

  const socialWebsite = socialAccounts.find((account) => {
    const provider = account.provider.toLowerCase()
    return provider === 'website' || provider === 'blog'
  })

  const normalizedSocialWebsite = normalizeOptionalUrl(socialWebsite?.url)

  if (normalizedSocialWebsite) {
    return normalizedSocialWebsite
  }

  const repoHomepage = repositories.find((repo) => normalizeOptionalUrl(repo.homepage))?.homepage ?? null

  return repoHomepage
}

async function mapGithubUser(user: GithubUserResponse): Promise<GithubUser> {
  const [repositories, socialAccounts] = await Promise.all([
    fetchRepositories(user.login),
    fetchSocialAccounts(user.login),
  ])

  const totalStars = repositories.reduce((total, repo) => total + repo.stargazersCount, 0)

  return {
    id: user.id,
    login: user.login,
    name: user.name?.trim() || null,
    avatarUrl: user.avatar_url,
    profileUrl: user.url,
    htmlUrl: user.html_url,
    bio: normalizeBio(user.bio),
    location: user.location?.trim() || null,
    company: normalizeCompany(user.company),
    blog: pickBlogUrl(user, repositories, socialAccounts),
    twitterUsername: pickTwitterUsername(user, socialAccounts),
    publicRepos: user.public_repos,
    followers: user.followers,
    following: user.following,
    totalStars,
  }
}

async function fetchUserWithDetails(login: string): Promise<GithubUser> {
  const normalizedLogin = login.trim()

  if (!normalizedLogin) {
    throw new Error('Login do GitHub invÃ¡lido.')
  }

  const response = await fetch(`${GITHUB_API_BASE_URL}/users/${normalizedLogin}`, {
    method: 'GET',
    headers: getHeaders(),
  })

  const user = await parseResponse<GithubUserResponse>(response)
  return mapGithubUser(user)
}

export const githubUsersService = {
  async getUserByLogin(login: string): Promise<GithubUser> {
    return fetchUserWithDetails(login)
  },

  async searchUsers(query: string, page = 1): Promise<GithubUserSearchPayload> {
    const normalizedQuery = query.trim()

    if (!normalizedQuery) {
      return {
        totalCount: 0,
        incompleteResults: false,
        items: [],
        currentPage: 1,
        perPage: SEARCH_PER_PAGE,
        totalPages: 0,
      }
    }

    const safePage = page > 0 ? page : 1

    const searchUrl = new URL(`${GITHUB_API_BASE_URL}/search/users`)
    searchUrl.searchParams.set('q', normalizedQuery)
    searchUrl.searchParams.set('per_page', String(SEARCH_PER_PAGE))
    searchUrl.searchParams.set('page', String(safePage))

    const searchResponse = await fetch(searchUrl.toString(), {
      method: 'GET',
      headers: getHeaders(),
    })

    const searchData = await parseResponse<GithubSearchResponse>(searchResponse)

    const items = await Promise.all(
      searchData.items.map(async (item) => {
        try {
          return await fetchUserWithDetails(item.login)
        } catch {
          return mapGithubSearchUser(item)
        }
      }),
    )

    const totalPages = Math.ceil(searchData.total_count / SEARCH_PER_PAGE)

    return {
      totalCount: searchData.total_count,
      incompleteResults: searchData.incomplete_results,
      items,
      currentPage: safePage,
      perPage: SEARCH_PER_PAGE,
      totalPages,
    }
  },

  async getUserRepositories(login: string): Promise<GithubRepository[]> {
    const normalizedLogin = login.trim()

    if (!normalizedLogin) {
      throw new Error('Login do GitHub invÃ¡lido.')
    }

    return fetchRepositories(normalizedLogin)
  },
}

