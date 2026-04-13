import { demoUsers } from '../../../features/demo/demo-data'
import type { Profile, ProfilesService } from './profiles.service'

function mapDemoUserToProfile(user: (typeof demoUsers)[number]): Profile {
  const now = new Date().toISOString()

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
    isPublic: user.isPublic,
    availabilityStatus: 'available',
    createdAt: now,
    updatedAt: now,
  }
}

function findDemoUserIndexById(userId: string): number {
  return demoUsers.findIndex((user) => user.id === userId)
}

export const demoProfilesService: ProfilesService = {
  async getMyProfile(userId) {
    const user = demoUsers.find((item) => item.id === userId)

    if (!user) {
      return null
    }

    return mapDemoUserToProfile(user)
  },

  async getProfileById(profileId) {
    const user = demoUsers.find((item) => item.id === profileId)

    if (!user) {
      return null
    }

    return mapDemoUserToProfile(user)
  },

  async createProfile(userId, input) {
    const userIndex = findDemoUserIndexById(userId)

    if (userIndex === -1) {
      throw new Error('Usuário demo não encontrado para criação do perfil.')
    }

    const existingUsername = demoUsers.find(
      (user, index) =>
        index !== userIndex && user.username.trim().toLowerCase() === input.username.trim().toLowerCase(),
    )

    if (existingUsername) {
      throw new Error('Este username já está em uso no modo demo.')
    }

    const currentUser = demoUsers[userIndex]

    demoUsers[userIndex] = {
      ...currentUser,
      fullName: input.fullName,
      username: input.username,
      headline: input.headline,
      bio: input.bio,
      avatarUrl: input.avatarUrl,
      location: input.location ?? '',
      websiteUrl: input.websiteUrl ?? '',
      githubUrl: input.githubUrl ?? '',
      linkedinUrl: input.linkedinUrl ?? '',
      isPublic: input.isPublic,
    }

    return mapDemoUserToProfile(demoUsers[userIndex])
  },

  async updateMyProfile(userId, input) {
    const userIndex = findDemoUserIndexById(userId)

    if (userIndex === -1) {
      throw new Error('Usuário demo não encontrado para atualização do perfil.')
    }

    const existingUsername = demoUsers.find(
      (user, index) =>
        index !== userIndex && user.username.trim().toLowerCase() === input.username.trim().toLowerCase(),
    )

    if (existingUsername) {
      throw new Error('Este username já está em uso no modo demo.')
    }

    const currentUser = demoUsers[userIndex]

    demoUsers[userIndex] = {
      ...currentUser,
      fullName: input.fullName,
      username: input.username,
      headline: input.headline,
      bio: input.bio,
      avatarUrl: input.avatarUrl,
      location: input.location ?? '',
      websiteUrl: input.websiteUrl ?? '',
      githubUrl: input.githubUrl ?? '',
      linkedinUrl: input.linkedinUrl ?? '',
      isPublic: input.isPublic,
    }

    return mapDemoUserToProfile(demoUsers[userIndex])
  },
}
