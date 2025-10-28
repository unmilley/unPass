import { DEFAULT_DATA } from '~/src/constants/data'
import { key as Key } from '~/src/constants/key'
import type { Data } from '~/types'
import { isData } from '~/types/guards'

type KeysDefaultData = keyof typeof DEFAULT_DATA

type DataArrayTypes = {
	[K in KeysDefaultData]: Data[K] extends (infer U)[] ? U : never
}

export const useData = () => {
	const { userId } = useAuth()

	const { data: encryptedData, isFinished } = createIdb<string | null>(
		userId.value ?? 'unknown',
		encrypt(JSON.stringify(DEFAULT_DATA), Key.get()),
	)
	const data = computed({
		get: (): Data | null => {
			if (!isFinished.value) return null
			const dec = decrypt(encryptedData.value ?? '', Key.get())
			const parsedMaybeData = JSON.parse(dec)
			return isData(parsedMaybeData) ? parsedMaybeData : null
		},
		set: (value) => {
			if (!isFinished.value) return
			encryptedData.value = value === null ? null : encrypt(JSON.stringify(value), Key.get())
		},
	})

	const set = <T extends KeysDefaultData>(type: T, value: Data[T]): { error: null | string } => {
		try {
			if (!data.value) throw new Error('Data not found')

			data.value = { ...data.value, [type]: value }
			return { error: null }
		} catch (error) {
			console.error(`useData(set): ${error}`)
			if (error instanceof Error) {
				return { error: error.message }
			}
			return { error: 'Something wrong' }
		}
	}

	const push = <T extends KeysDefaultData>(type: T, value: DataArrayTypes[T]): { error: null | string } => {
		try {
			if (!data.value) throw new Error('Data not found')

			const currentData = data.value[type]
			currentData.push(value)
			data.value = { ...data.value, [type]: currentData }

			return { error: null }
		} catch (error) {
			console.error(`useData(push): ${error}`)
			if (error instanceof Error) {
				return { error: error.message }
			}
			return { error: 'Something wrong' }
		}
	}

	return {
		isFinished: readonly(isFinished),
		encryptedData: readonly(encryptedData),
		data,
		set,
		push,
	}
}
