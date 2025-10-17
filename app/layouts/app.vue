<template>
	<div>
		<tauri-titlebar v-if="$isTauri" />
		<main :class="{ 'mt-[2.25rem]': $isTauri }">
			<slot />
		</main>
	</div>
</template>

<script lang="ts" setup></script>
