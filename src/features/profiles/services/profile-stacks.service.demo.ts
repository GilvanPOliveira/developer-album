import { demoStacks } from '../../../features/demo/demo-data'
import type {
  ProfileStackItem,
  ProfileStacksService,
  SaveProfileStacksInput,
} from './profile-stacks.service'

type DemoProfileStackRow = {
  profileId: string
  stackId: string
  isPrimary: boolean
  orderIndex: number
}

const demoProfileStacksStore: DemoProfileStackRow[] = [
  { profileId: 'demo-user-1', stackId: 'stack-vue', isPrimary: true, orderIndex: 0 },
  { profileId: 'demo-user-1', stackId: 'stack-typescript', isPrimary: true, orderIndex: 1 },
  { profileId: 'demo-user-1', stackId: 'stack-supabase', isPrimary: true, orderIndex: 2 },
  { profileId: 'demo-user-2', stackId: 'stack-vue', isPrimary: true, orderIndex: 0 },
  { profileId: 'demo-user-2', stackId: 'stack-typescript', isPrimary: true, orderIndex: 1 },
  { profileId: 'demo-user-2', stackId: 'stack-tailwind', isPrimary: true, orderIndex: 2 },
  { profileId: 'demo-user-3', stackId: 'stack-python', isPrimary: true, orderIndex: 0 },
  { profileId: 'demo-user-3', stackId: 'stack-fastapi', isPrimary: true, orderIndex: 1 },
  { profileId: 'demo-user-3', stackId: 'stack-postgres', isPrimary: true, orderIndex: 2 },
]

function mapProfileStack(row: DemoProfileStackRow): ProfileStackItem {
  const stack = demoStacks.find((item) => item.id === row.stackId)

  if (!stack) {
    throw new Error(`Stack demo não encontrada: ${row.stackId}`)
  }

  return {
    id: `${row.profileId}-${row.stackId}`,
    profileId: row.profileId,
    stackId: row.stackId,
    name: stack.name,
    slug: stack.slug,
    category: stack.category,
    isPrimary: row.isPrimary,
    orderIndex: row.orderIndex,
  }
}

export const demoProfileStacksService: ProfileStacksService = {
  async listProfileStacks(profileId: string): Promise<ProfileStackItem[]> {
    return demoProfileStacksStore
      .filter((item) => item.profileId === profileId)
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map(mapProfileStack)
  },

  async saveProfileStacks(profileId: string, items: SaveProfileStacksInput): Promise<ProfileStackItem[]> {
    for (let index = demoProfileStacksStore.length - 1; index >= 0; index -= 1) {
      if (demoProfileStacksStore[index].profileId === profileId) {
        demoProfileStacksStore.splice(index, 1)
      }
    }

    items.forEach((item) => {
      demoProfileStacksStore.push({
        profileId,
        stackId: item.stackId,
        isPrimary: item.isPrimary,
        orderIndex: item.orderIndex,
      })
    })

    return demoProfileStacksStore
      .filter((item) => item.profileId === profileId)
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map(mapProfileStack)
  },
}
