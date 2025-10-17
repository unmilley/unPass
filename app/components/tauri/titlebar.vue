<template>
	<Teleport to="body">
		<div
			id="titlebar"
			ref="titlebar"
			class="navbar bg-base-100 px-0 fixed z-[999] inset-x-0 top-0 min-h-0 h-[2.25rem] *:select-none"
		>
			<div v-if="iconUrl" class="navbar-start">
				<img :src="iconUrl" alt="unPass" class="m-4 size-6 pointer-events-none" />
			</div>
			<div class="navbar-end h-[2.25rem]">
				<AppThemeSwitcher class="h-[2.25rem] btn-ghost rounded-none" />
				<button class="btn h-[2.25rem] btn-ghost btn-square rounded-none" @click.prevent.stop="appWindow.minimize()">
					<Icon name="bx:minus" size="1rem" />
				</button>
				<button class="btn h-[2.25rem] btn-ghost btn-square rounded-none" @click.stop="appWindow.toggleMaximize()">
					<Icon :name="iconMaximized.name" :size="iconMaximized.size" />
				</button>
				<button
					class="btn h-[2.25rem] btn-ghost btn-square btn-error rounded-none"
					@click.prevent.stop="appWindow.close()"
				>
					<Icon name="bx:x" size="1.25rem" />
				</button>
			</div>
		</div>
	</Teleport>
</template>

<script lang="ts" setup>
import { getCurrentWindow, type Window } from '@tauri-apps/api/window'

const { iconUrl } = useTauriIcon()

const appWindow = ref<Window>(getCurrentWindow())

const titlebar = useTemplateRef('titlebar')
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
