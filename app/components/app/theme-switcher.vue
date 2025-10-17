<template>
	<label class="btn btn-square swap swap-rotate">
		<input type="checkbox" v-model="isDark" />

		<Icon name="bx:sun" class="swap-on" />
		<Icon name="bx:moon" class="swap-off" />
	</label>
</template>

<script lang="ts" setup>
const isDark = useDark()
</script>
