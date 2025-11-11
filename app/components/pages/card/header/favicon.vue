<template>
	<div>
		<picture v-if="url">
			<div class="avatar">
				<div class="mask mask-squircle w-6 bg-base-content">
					<img :src="url" :alt="url" style="height: auto; width: 1.5rem" />
				</div>
			</div>
		</picture>
	</div>
</template>

<script lang="ts" setup>
const url = computed(() => {
	/* TODO: add dropdown for select favicon
     : add  @svagcrew/binking
	*/
	return `/cards/bank/_unknown.svg`
})
</script>
