<template>
	<component
		:is="as"
		class="tooltip"
		:class="[
			'tooltip',
			position,
			open && 'tooltip-open',
			!center && 'before:left-0! before:transform-none! before:translate-y-(--tt-pos)!',
		]"
		:data-tip="tip"
	>
		<div v-if="$slots.content && !tip" class="tooltip-content content-bg">
			<slot name="content"> </slot>
		</div>
		<slot />
	</component>
</template>

<script lang="ts" setup>
type Props = {
	as?: keyof HTMLElementTagNameMap
	tip?: string | number
	open?: boolean
	pos?: 'top' | 'bottom' | 'left' | 'right'
	center?: boolean
	contentBg?: string
}

const props = withDefaults(defineProps<Props>(), {
	as: 'div',
	pos: 'top',
	open: false,
	center: true,
})

const positionClass = {
	top: 'tooltip-top',
	bottom: 'tooltip-bottom',
	left: 'tooltip-left',
	right: 'tooltip-right',
}

const position = computed(() => positionClass[props.pos])
</script>

<style scoped>
.content-bg {
	background: v-bind($props.contentBg);
}
</style>
