export type AvailabilityStatus = 'open_to_work' | 'freelance' | 'unavailable' | null

export type ProjectVisibility = 'public' | 'private'

export type ProjectSource = 'manual' | 'github'

export type CardRarityTier = 'common' | 'rare' | 'epic' | 'legendary'

export type GithubSyncStatus = 'idle' | 'success' | 'error'

export type AlbumItemSource = 'platform' | 'github'

export type Profile = {
  id: string
  username: string | null
  fullName: string | null
  headline: string | null
  bio: string | null
  avatarUrl: string | null
  location: string | null
  websiteUrl: string | null
  githubUrl: string | null
  githubId: number | null
  githubLogin: string | null
  githubPublicRepos: number
  githubFollowers: number
  githubFollowing: number
  githubTotalStars: number
  githubSyncedAt: string | null
  linkedinUrl: string | null
  portfolioUrl: string | null
  isPublic: boolean
  availabilityStatus: AvailabilityStatus
  createdAt: string
  updatedAt: string
}

export type Stack = {
  id: string
  name: string
  slug: string
  category: string | null
  iconName: string | null
  colorToken: string | null
  createdAt: string
}

export type ProfileStack = {
  id: string
  profileId: string
  stackId: string
  isPrimary: boolean
  orderIndex: number
}

export type Project = {
  id: string
  profileId: string
  title: string
  slug: string
  description: string | null
  coverImageUrl: string | null
  projectUrl: string | null
  repoUrl: string | null
  isFeatured: boolean
  visibility: ProjectVisibility
  source: ProjectSource
  githubRepoId: number | null
  githubOwnerLogin: string | null
  githubRepoFullName: string | null
  githubRepoHtmlUrl: string | null
  githubLanguage: string | null
  githubDefaultBranch: string | null
  githubStarsCount: number
  githubForksCount: number
  githubPushedAt: string | null
  lastSyncedAt: string | null
  createdAt: string
  updatedAt: string
}

export type ProjectStack = {
  id: string
  projectId: string
  stackId: string
}

export type DeveloperCard = {
  id: string
  profileId: string
  template: string
  accentColor: string
  rarityTier: CardRarityTier
  tagline: string | null
  coverStyle: string | null
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export type Album = {
  id: string
  ownerProfileId: string
  name: string
  description: string | null
  isDefault: boolean
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export type AlbumItem = {
  id: string
  albumId: string
  collectedProfileId: string | null
  source: AlbumItemSource
  githubUserId: number | null
  githubLogin: string | null
  githubName: string | null
  githubAvatarUrl: string | null
  githubHtmlUrl: string | null
  githubBio: string | null
  githubLocation: string | null
  githubCompany: string | null
  githubBlog: string | null
  githubPublicRepos: number
  githubFollowers: number
  githubFollowing: number
  githubTotalStars: number
  githubTwitterUsername: string | null
  addedAt: string
  lastSyncedAt: string | null
  syncStatus: GithubSyncStatus
  syncError: string | null
  position: number
}

export type Favorite = {
  id: string
  ownerProfileId: string
  targetProfileId: string
  createdAt: string
}

export type PublicDeveloperProfile = {
  id: string
  username: string
  fullName: string | null
  headline: string | null
  bio: string | null
  avatarUrl: string | null
  location: string | null
  websiteUrl: string | null
  githubUrl: string | null
  linkedinUrl: string | null
  portfolioUrl: string | null
  availabilityStatus: AvailabilityStatus
  developerCard: DeveloperCard | null
  stacks: Stack[]
}

export type PublicProject = {
  id: string
  profileId: string
  title: string
  slug: string
  description: string | null
  coverImageUrl: string | null
  projectUrl: string | null
  repoUrl: string | null
  isFeatured: boolean
  visibility: ProjectVisibility
  source: ProjectSource
  githubRepoId: number | null
  githubOwnerLogin: string | null
  githubRepoFullName: string | null
  githubRepoHtmlUrl: string | null
  githubLanguage: string | null
  githubDefaultBranch: string | null
  githubStarsCount: number
  githubForksCount: number
  githubPushedAt: string | null
  lastSyncedAt: string | null
  createdAt: string
  updatedAt: string
  stacks: Stack[]
}

export type PublicDeveloperProfileDetails = {
  profile: PublicDeveloperProfile
  projects: PublicProject[]
}

export type FavoriteProfile = PublicDeveloperProfile & {
  favoriteId: string
  favoritedAt: string
}

export type AlbumPlatformProfile = PublicDeveloperProfile & {
  albumItemId: string
  addedAt: string
  source: 'platform'
}

export type GithubUser = {
  id: number
  login: string
  name: string | null
  avatarUrl: string
  profileUrl: string
  htmlUrl: string
  bio: string | null
  location: string | null
  company: string | null
  blog: string | null
  twitterUsername: string | null
  publicRepos: number
  followers: number
  following: number
  totalStars: number
}

export type GithubRepository = {
  id: number
  name: string
  fullName: string
  description: string | null
  htmlUrl: string
  homepage: string | null
  language: string | null
  stargazersCount: number
  forksCount: number
  updatedAt: string
  defaultBranch?: string | null
}

export type AlbumGithubProfile = GithubUser & {
  albumItemId: string
  addedAt: string
  source: 'github'
  lastSyncedAt: string | null
  syncStatus: GithubSyncStatus
  syncError: string | null
}

export type AlbumProfile = AlbumPlatformProfile | AlbumGithubProfile

export type HomePublicStats = {
  publicProfiles: number
  publicProjects: number
  uniqueStacks: number
}

export type HomePublicPayload = {
  stats: HomePublicStats
  featuredProfiles: PublicDeveloperProfile[]
}

export type GithubUserSearchPayload = {
  totalCount: number
  incompleteResults: boolean
  items: GithubUser[]
  currentPage: number 
  perPage: number
  totalPages: number
}
