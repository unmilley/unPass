<template>
	<div>
		<picture v-if="url">
			<source v-for="favicon in favicons.base" :key="favicon" :srcset="favicon" />
			<img :src="favicons.last" :alt="url" style="height: auto; width: 1.5rem" />
		</picture>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps<{ url: string }>()

const url = computed(() => {
	if (!props.url) return ''
	try {
		const { hostname } = new URL(props.url)
		return hostname
	} catch {
		return ''
	}
})

const imageUrls = [
	'https://favicon.yandex.net/favicon/%hostname%',
	'https://www.google.com/s2/favicons?domain=%hostname%',
	'https://icons.duckduckgo.com/ip2/%hostname%.ico',
	'https://f1.allesedv.com/16/%hostname%',
]

const favicons = computed(() => {
	const domains = imageUrls.map((d) => d.replace('%hostname%', url.value))
	return { base: domains.slice(0, domains.length - 1), last: domains.at(-1) }
})
</script>
