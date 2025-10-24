<template>
	<div class="drawer drawer-open pt-9">
		<input id="main-drawer" type="checkbox" class="drawer-toggle" />
		<div class="drawer-content mr-2">
			<app-navbar />
			<main
				class="w-full h-[calc(100dvh-2.75rem)] bg-base-200 p-2 border-2 border-base-content/25 rounded-box relative overflow-hidden"
			>
				<slot />
			</main>
		</div>

		<div class="drawer-side is-drawer-close:overflow-visible h-[calc(100dvh-2.75rem)]">
			<label for="main-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
			<div class="is-drawer-close:w-14 is-drawer-open:w-52 bg-base-100 flex flex-col items-start min-h-full">
				<div class="m-2 is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Open">
					<label for="main-drawer" class="btn btn-ghost btn-circle drawer-button">
						<Icon name="bx:sidebar" class="inline-block size-5 ml-1" />
					</label>
				</div>

				<ul class="menu w-full">
					<template v-for="(items, idx) in routeSidebarItems" :key="idx">
						<li v-for="value in items" :key="value.title" :class="{ 'menu-disabled': value.isSecure && !isAuth }">
							<button
								class="is-drawer-close:tooltip is-drawer-close:tooltip-right"
								:data-tip="value.title"
								@click="navigateTo(value.path)"
							>
								<div
									v-show="route.path === value.path"
									class="absolute left-0.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-base-content"
								></div>
								<Icon :name="value.icon" class="inline-block size-5 my-1.5" />
								<span class="is-drawer-close:hidden">{{ value.title }}</span>
							</button>
						</li>
						<div v-show="!items.length" class="divider my-0! gap-0 px-3"></div>
					</template>
				</ul>
				<ul class="menu w-full grow justify-end">
					<li v-if="isAuth">
						<button
							class="is-drawer-close:tooltip is-drawer-close:tooltip-right"
							data-tip="Logout"
							@click="handleLogout"
						>
							<Icon name="bx:log-out" class="inline-block size-5 my-1.5" />
							<span class="is-drawer-close:hidden">Logout</span>
						</button>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { routeSidebarItems } from '~/src/routing'

const route = useRoute()

const { isAuth, logout } = useAuth()

const handleLogout = () => {
	logout()
	navigateTo('/app/sign-in')
}
</script>
