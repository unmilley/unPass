<template>
	<div class="drawer drawer-open" :class="{ 'pt-[2.25rem] ': $isTauri }">
		<input id="main-drawer" type="checkbox" class="drawer-toggle" />
		<div class="drawer-content mr-2">
			<tauri-titlebar v-if="$isTauri" />
			<main
				class="size-full bg-base-200 p-2 border-2 border-base-content/25 rounded-box relative overflow-hidden"
				:class="{ 'h-[calc(100dvh-2.75rem)]': $isTauri }"
			>
				<slot />
			</main>
		</div>

		<div class="drawer-side is-drawer-close:overflow-visible">
			<label for="main-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
			<div class="is-drawer-close:w-14 is-drawer-open:w-64 bg-base-100 flex flex-col items-start min-h-full">
				<div class="m-2 is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Open">
					<label for="main-drawer" class="btn btn-ghost btn-circle drawer-button">
						<Icon name="bx:sidebar" class="inline-block size-5 ml-1" />
					</label>
				</div>

				<ul class="menu w-full grow">
					<li v-for="value in sidebarItems">
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
					<li>
						<div class="divider !my-0 gap-0"></div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
const route = useRoute()

const sidebarItems = [
	{ title: 'Homepage', icon: 'bx:home-heart', path: '/app', isSecure: true },
	{ title: 'Accounts', icon: 'bx:user-circle', path: '/app/accounts', isSecure: true },
	{ title: 'Cards', icon: 'bx:credit-card', path: '/app/card', isSecure: true },
	{ title: 'Settings', icon: 'bx:cog', path: '/app/settings', isSecure: true },
]
</script>
