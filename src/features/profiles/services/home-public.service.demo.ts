import { demoUsers } from '../../../features/demo/demo-data'
import type { HomePublicData, HomePublicService } from './home-public.service'

function getStacksForUser(userId: string): string[] {
  if (userId === 'demo-user-1') return ['Vue', 'TypeScript', 'Supabase']
  if (userId === 'demo-user-2') return ['Vue', 'TypeScript', 'Tailwind CSS']
  if (userId === 'demo-user-3') return ['Python', 'FastAPI', 'PostgreSQL']
  return []
}

export const demoHomePublicService: HomePublicService = {
  async getHomePublicData(): Promise<HomePublicData> {
    const publicUsers = demoUsers.filter((user) => user.isPublic)

    const cards = publicUsers.map((user) => ({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      headline: user.headline,
      avatarUrl: user.avatarUrl,
      location: user.location || null,
      primaryStacks: getStacksForUser(user.id),
      isPublic: user.isPublic,
    }))

    return {
      featuredProfiles: cards.slice(0, 6),
      recentProfiles: cards.slice(0, 12),
      stacks: ['Vue', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Python', 'FastAPI', 'PostgreSQL'],
    }
  },
}
