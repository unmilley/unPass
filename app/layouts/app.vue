<template>
	<div>
		<main :class="{ 'mt-[2.25rem]': $isTauri }">
			<slot />
		</main>
	</div>
</template>

<script lang="ts" setup></script>
