<template>
	<template v-if="$isTauri">
		<a
			v-bind="(props as any)"
			:href="(props.href as string)"
			@click.prevent="openUrl(props.href as string)"
			:class="props.class ?? ''"
		>
			<slot />
		</a>
	</template>
	<template v-else>
		<nuxt-link v-bind="props" :class="props.class ?? ''">
			<slot />
		</nuxt-link>
	</template>
</template>

<script lang="ts" setup>
/* TODO:WARN:[NuxtLink] `prefetch` and `noPrefetch` cannot be used together. `noPrefetch` will be ignored. */
import { openUrl } from '@tauri-apps/plugin-opener'
import type { RouteLocationRaw } from 'vue-router'

interface Props<CustomProp extends boolean = false> {
	custom?: CustomProp
	to?: RouteLocationRaw
	href?: string
	external?: boolean
	target?: '_blank' | '_parent' | '_self' | '_top'
	rel?: 'noopener' | 'noreferrer' | 'nofollow' | 'sponsored' | 'ugc'
	noRel?: boolean
	prefetchedClass?: string
	prefetch?: boolean
	prefetchOn?:
		| 'visibility'
		| 'interaction'
		| Partial<{
				visibility: boolean
				interaction: boolean
		  }>
	noPrefetch?: boolean
}

const props = defineProps<Props & { class?: string }>()
</script>
