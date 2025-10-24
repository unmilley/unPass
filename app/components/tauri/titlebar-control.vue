<template>
	<div>
		<button class="btn h-9 btn-ghost btn-square rounded-none" @click.prevent.stop="appWindow.minimize()">
			<Icon name="bx:minus" size="1rem" />
		</button>
		<button class="btn h-9 btn-ghost btn-square rounded-none" @click.stop="appWindow.toggleMaximize()">
			<Icon :name="iconMaximized.name" :size="iconMaximized.size" />
		</button>
		<button class="btn h-9 btn-ghost btn-square btn-error rounded-none" @click.prevent.stop="appWindow.close()">
			<Icon name="bx:x" size="1.25rem" />
		</button>
	</div>
</template>

<script lang="ts" setup>
import { getCurrentWindow, type Window } from '@tauri-apps/api/window'
import type { ShallowRef } from 'vue'

const titlebar = inject<Readonly<ShallowRef<HTMLDivElement | null>>>('titlebar-ref')

const appWindow = ref<Window>(getCurrentWindow())

useEventListener(titlebar, 'mousedown', (e) => {
	if (e.buttons !== 1) return
	if ((e.target as HTMLElement).parentElement?.id !== 'titlebar') return
	e.preventDefault()
	e.detail === 2 ? appWindow.value.toggleMaximize() : appWindow.value.startDragging()
})

const [isMaximized, toggleLocalMaximized] = useToggle(false)
const iconMaximized = computed(() => {
	return isMaximized.value ? { name: 'bx:windows', size: '0.85rem' } : { name: 'bx:window', size: '0.75rem' }
})

const checkMaximized = useThrottleFn(async () => {
	toggleLocalMaximized(await appWindow.value?.isMaximized())
}, 1000)

appWindow.value.listen('tauri://resize', checkMaximized)
</script>
