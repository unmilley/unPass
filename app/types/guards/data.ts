import { isObject } from '@vueuse/core'
import type { Data } from '../data'

export const isData = (data: unknown): data is Data => {
	return isObject(data) && 'accounts' in data && 'cards' in data && Object.values(data).every((v) => Array.isArray(v))
}
