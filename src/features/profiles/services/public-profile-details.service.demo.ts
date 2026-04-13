import { demoProjects, demoUsers } from '../../../features/demo/demo-data'
import type {
  PublicProfileDetails,
  PublicProfileDetailsService,
  PublicProfileProjectPreview,
} from './public-profile-details.service'

function getStacksForUser(userId: string): string[] {
  if (userId === 'demo-user-1') return ['Vue', 'TypeScript', 'Supabase']
  if (userId === 'demo-user-2') return ['Vue', 'TypeScript', 'Tailwind CSS']
  if (userId === 'demo-user-3') return ['Python', 'FastAPI', 'PostgreSQL']
  return []
}

function mapProjects(profileId: string): PublicProfileProjectPreview[] {
  return demoProjects
    .filter((project) => project.profileId === profileId && project.visibility === 'public')
    .map((project) => ({
      id: project.id,
      title: project.title,
      slug: project.slug,
      description: project.description,
      projectUrl: project.projectUrl || null,
      repoUrl: project.repoUrl || null,
      isFeatured: project.isFeatured,
      stackNames: project.stackSlugs,
    }))
}

export const demoPublicProfileDetailsService: PublicProfileDetailsService = {
  async getByUsername(username: string): Promise<PublicProfileDetails | null> {
    const normalized = username.trim().toLowerCase()

    const user = demoUsers.find((item) => item.isPublic && item.username.trim().toLowerCase() === normalized)

    if (!user) {
      return null
    }

    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      headline: user.headline,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      location: user.location || null,
      websiteUrl: user.websiteUrl || null,
      githubUrl: user.githubUrl || null,
      linkedinUrl: user.linkedinUrl || null,
      portfolioUrl: user.websiteUrl || null,
      primaryStacks: getStacksForUser(user.id),
      projects: mapProjects(user.id),
    }
  },
}
