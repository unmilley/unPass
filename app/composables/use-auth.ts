import { key } from '@/src/constants/key'
import { type User } from '@/types'
import { isObject } from '@vueuse/core'

export const useAuth = createGlobalState(() => {
	const {
		data: USERS,
		set,
		isFinished,
	} = createIdb<User[] | undefined>('auth', [], {
		dbName: 'auth',
		storeName: 'index',
		throttle: 1000,
	})

	const userId = ref<number | null>(null)
	const user = computed<User | null>(() => {
		if (!USERS.value || typeof userId.value !== 'number' || userId.value === -1) return null
		return USERS.value[userId.value]!
	})

	const isAuth = computed<boolean>(() => {
		return user.value !== null && isObject(user.value) && 'username' in user.value && 'masterKey' in user.value
	})

	const register = (username: string, masterKey: string): {} | { error: string } => {
		try {
			if (!USERS.value) throw new Error('The database has not been prepared yet')

			username = slugGenerator(username)
			if (USERS.value.map(({ username: un }) => un).includes(username)) {
				throw new Error('Username is exist')
			}
			const data: User = {
				username,
				masterKey: encrypt(masterKey, key.get()),
				lastSeen: +new Date(),
			}

			set([...USERS.value, data])
			return {}
		} catch (error) {
			console.error(`useAuth(register): ${error}`)
			if (error instanceof Error) {
				return { error: error.message }
			}
			return { error: 'Something wrong' }
		}
	}

	const login = (username: string, masterKey: string): {} | { error: string } => {
		try {
			if (!USERS.value) throw new Error('The database has not been prepared yet')

			username = slugGenerator(username)

			const foundUserId = USERS.value.map(({ username: un }) => un).findIndex((val) => val === username)
			if (foundUserId === -1) throw new Error('The user does not exist')

			const foundUser = USERS.value[foundUserId]!
			const decryptedMasterKey = decrypt(foundUser.masterKey, key.get())

			if (decryptedMasterKey !== masterKey) throw new Error('The master key is incorrect')

			USERS.value[foundUserId]!.lastSeen = +new Date()
			userId.value = foundUserId
			return {}
		} catch (error: any) {
			console.error(`useAuth(login): ${error}`)
			if (error instanceof Error) {
				return { error: error.message }
			}
			return { error: 'Something wrong' }
		}
	}

	const logout = () => {
		userId.value = null
	}

	return { usersDB: USERS, user, isAuth, register, login, logout, isFinished }
})
