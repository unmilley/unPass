import { isObject } from '@vueuse/core'
import type { User } from './auth'

export const isUser = (user: unknown): user is User => {
	return isObject(user) && 'id' in user && 'key' in user && 'username' in user && 'lastSeen' in user
}
export const isUsers = (users: unknown): users is User[] => {
	return Array.isArray(users) && typeof users.length === 'number' && (isUser(users[0]) || users.length === 0)
}
