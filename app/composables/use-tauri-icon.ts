import { defaultWindowIcon } from '@tauri-apps/api/app'
import { onMounted, onUnmounted, ref } from 'vue'

export const useTauriIcon = () => {
	const iconUrl = ref<string | null>(null)
	const isLoading = ref(true)
	const error = ref(null)

	const loadIcon = async () => {
		try {
			isLoading.value = true
			error.value = null

			const icon = await defaultWindowIcon()
			if (!icon) {
				iconUrl.value = null
				return
			}

			const [rgbaData, size] = await Promise.all([icon.rgba(), icon.size()])

			// Создаем ImageData и конвертируем в data URL
			const canvas = document.createElement('canvas')
			canvas.width = size.width
			canvas.height = size.height

			const ctx = canvas.getContext('2d')
			if (!ctx) throw new Error('ctx not found')
			const imageData = new ImageData(new Uint8ClampedArray(rgbaData), size.width, size.height)

			ctx.putImageData(imageData, 0, 0)
			iconUrl.value = canvas.toDataURL('image/png')
		} catch (err: any) {
			error.value = err
			console.error('Ошибка загрузки иконки:', err)
		} finally {
			isLoading.value = false
		}
	}

	onMounted(loadIcon)

	// Очистка
	onUnmounted(() => {
		if (iconUrl.value && iconUrl.value.startsWith('blob:')) {
			URL.revokeObjectURL(iconUrl.value)
		}
	})

	return {
		iconUrl,
		isLoading,
		error,
		reload: loadIcon,
	}
}
