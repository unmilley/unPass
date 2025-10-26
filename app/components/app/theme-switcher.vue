<template>
	<label class="btn btn-square swap swap-rotate">
		<input type="checkbox" v-model="isDark" />

		<Icon name="pass:sun" class="swap-on" />
		<Icon name="pass:moon" class="swap-off" />
	</label>
</template>

<script lang="ts" setup>
const isDark = useDark()
</script>
