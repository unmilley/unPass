import { key as Key } from '@/src/constants/key'
import { type User } from '@/types'
import { nanoid } from 'nanoid'
import { isUser, isUsers } from '~/types/guards'

export const useAuth = createGlobalState(() => {
	const { data: encryptedUsers, isFinished } = createIdb<string | null>('_auth', encrypt('[]', Key.get()))
	const users = computed({
		get: (): User[] | null => {
			if (!isFinished.value) return null
			const dec = decrypt(encryptedUsers.value ?? '', Key.get())
			const parsedMaybeUsers = JSON.parse(dec)
			return isUsers(parsedMaybeUsers) ? parsedMaybeUsers : null
		},
		set: (value) => {
			if (!isFinished.value) return
			encryptedUsers.value = value === null ? null : encrypt(JSON.stringify(value), Key.get())
		},
	})

	const userId = shallowRef<string | null>(null)
	const user = computed({
		get: (): User | null => users.value?.filter(({ id }) => id === userId.value)[0] || null,
		set: (val) => {
			const id = users.value?.findIndex(({ id }) => id === userId.value) || -1
			if (id === -1 || !users.value) return
			if (val === null) users.value = users.value?.toSpliced(id, 1)
			else users.value[id] = val
		},
	})

	const userUsernames = computed(() => users.value?.map(({ username }) => username) || [])

	const isAuth = computed<boolean>(() => isUser(user.value))

	const register = (
		username: string,
		masterKey: string,
	): { error: string; data?: undefined } | { error: null; data: User } => {
		try {
			if (!isFinished.value || !users.value) throw new Error('The database has not been prepared yet')

			if (users.value.map(({ username: un }) => un).includes(username)) throw new Error('Username is exist')

			const newUser: User = {
				id: nanoid(5),
				username,
				key: encrypt(masterKey, Key.get()),
				lastSeen: +new Date(),
			}

			users.value = [...users.value, newUser]
			userId.value = newUser.id

			return { error: null, data: newUser }
		} catch (error: any) {
			console.error(`useAuth(register): ${error}`)
			if (error instanceof Error) {
				return { error: error.message }
			}
			return { error: 'Something wrong' }
		}
	}
	const login = (username: string, masterKey: string): { error: string | null } => {
		try {
			if (!isFinished.value || !users.value) throw new Error('The database has not been prepared yet')

			const foundedUser = users.value?.filter(({ username: name }) => name === username)[0] || null
			if (!foundedUser) throw new Error('The user does not exist')

			const decryptedMasterKey = decrypt(foundedUser.key, Key.get())
			if (decryptedMasterKey !== masterKey) throw new Error('The master key is incorrect')

			userId.value = foundedUser.id
			user.value && (user.value.lastSeen = +new Date())

			return { error: null }
		} catch (error: any) {
			console.error(`useAuth(login): ${error}`)
			if (error instanceof Error) {
				return { error: error.message }
			}
			return { error: 'Something wrong' }
		}
	}

	const logout = () => {
		location.reload()
	}

	const verifyKey = (password: string, key: string): boolean => {
		return encrypt(password, Key.get()) !== key
	}

	const isExistUser = (username: string): boolean => userUsernames.value.includes(username)

	return {
		usersDB: readonly(users),
		isFinished: readonly(isFinished),
		isAuth: readonly(isAuth),
		user,
		userId,
		userUsernames,
		register,
		login,
		logout,
		verifyKey,
		isExistUser,
	}
})
