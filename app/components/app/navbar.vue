<template>
	<Teleport to="body">
		<div
			id="titlebar"
			ref="titlebar"
			class="navbar bg-base-100 px-0 fixed z-999 inset-x-0 top-0 min-h-0 h-9 *:select-none"
		>
			<div class="navbar-start">
				<div class="grid place-items-center w-14 mr-2 h-9 pointer-events-none">
					<img src="/pwa/favicon.svg" alt="unPass" class="ml-1 size-4.5" />
				</div>
				<span v-if="user" class="pointer-events-none font-mono text-sm">{{ user.username }}</span>
				<span v-else @click="navigateTo('/app/sign-in')" class="font-mono text-sm flex gap-2 link link-hover">
					Login
					<Icon name="bx:chevron-left" />
				</span>
			</div>
			<div class="navbar-end h-9 pr-3 has-[button]:pr-0">
				<AppThemeSwitcher class="h-9 btn-ghost rounded-none" />
				<TauriTitlebarControl v-if="$isTauri" />
			</div>
		</div>
	</Teleport>
</template>

<script lang="ts" setup>
const { $isTauri } = useNuxtApp()
const { user } = useAuth()

if ($isTauri) {
	const titlebar = useTemplateRef('titlebar')
	provide('titlebar-ref', titlebar)
}
</script>
