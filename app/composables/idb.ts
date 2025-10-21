import { watchPausable, type ConfigurableFlush, type RemovableRef } from '@vueuse/core'
import { createStore, del, get, set, update } from 'idb-keyval'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'
import { shallowRef, toRaw, toValue } from 'vue'

interface Serializer<T> {
	read: (raw: unknown) => T
	write: (value: T) => unknown
}

export interface IDBOptions<T> extends ConfigurableFlush {
	/**
	 * Watch for deep changes
	 *
	 * @default true
	 */
	deep?: boolean

	/**
	 * On error callback
	 *
	 * Default log error to `console.error`
	 */
	onError?: (error: unknown) => void

	/**
	 * Write the default value to the storage when it does not exist
	 *
	 * @default true
	 */
	writeDefaults?: boolean

	/**
	 * Custom data serialization
	 */
	serializer?: Serializer<T>
}

export interface IDBReturn<T> {
	data: RemovableRef<T>
	isFinished: ShallowRef<boolean>
	set: (value: T) => Promise<void>
}

export const createIdb = <T>(
	key: IDBValidKey,
	initialValue: MaybeRefOrGetter<T>,
	options: IDBOptions<T> = {},
): IDBReturn<T> => {
	const {
		flush = 'pre',
		deep = true,
		onError = (e) => {
			console.error(e)
		},
		writeDefaults = true,
		serializer = {
			read: (raw: unknown) => raw as T,
			write: (value: T) => value,
		},
	} = options

	const store = createStore('unPass', 'index')
	const isFinished = shallowRef(false)
	const data = useState<T>(`idb:${key}`, () => toValue(initialValue))

	const rawInit: T = toValue(initialValue)

	const read = async () => {
		try {
			const rawValue = await get<string>(key, store)
			if (rawValue === undefined) {
				if (rawInit !== undefined && rawInit !== null && writeDefaults) {
					const initValue = serializer.write(rawInit)
					await set(key, initValue, store)
				}
			} else {
				data.value = serializer.read(rawValue)
			}
		} catch (error) {
			onError(error)
		}
		isFinished.value = true
	}

	read()

	const write = async () => {
		try {
			if (data.value == null) {
				await del(key)
			} else {
				const rawValue = toRaw(data.value)
				const serializedValue = serializer.write(rawValue)
				await update(key, () => serializedValue, store)
			}
		} catch (error) {
			onError(error)
		}
	}

	const { pause: pauseWatch, resume: resumeWatch } = watchPausable(data, () => write(), { flush, deep })

	const setData = async (value: T): Promise<void> => {
		pauseWatch()
		data.value = value
		await write()
		resumeWatch()
	}

	return {
		set: setData,
		data: data as RemovableRef<T>,
		isFinished,
	}
}
