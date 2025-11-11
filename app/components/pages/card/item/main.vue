<template>
	<tooltip :tip="title">
		<div ref="main" class="relative join-item">
			<input
				ref="input-ref"
				class="input focus:outline-0 placeholder-shown:text-base-content/50"
				v-model="data"
				:type="isShow ? 'text' : 'password'"
				:readonly="!isEdit"
				:placeholder
			/>
			<div class="absolute bottom-2 right-2 flex gap-1 z-1">
				<motion.button
					v-if="isSecure && data"
					:initial="false"
					:animate="{ opacity: isHover ? 1 : 0, scale: isHover ? 1 : 0 }"
					class="btn btn-soft btn-xs btn-square"
					:class="{ 'btn-active': isShow }"
					@click="visibility()"
				>
					<Icon :name="isShow ? 'bx:hide' : 'bx:show'" size="1rem" />
				</motion.button>
				<motion.button
					v-if="isSupported && !isEdit && data"
					:initial="false"
					:animate="{ opacity: isHover ? 1 : 0, scale: isHover ? 1 : 0 }"
					class="btn btn-soft btn-xs btn-square"
					@click="copy(data)"
				>
					<Icon name="bx:copy" size="1rem" />
				</motion.button>
			</div>
		</div>
	</tooltip>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'

const {
	placeholder: propPlaceholder,
	isSecure = false,
	isEdit,
} = defineProps<{
	placeholder?: string
	isSecure?: boolean
	isEdit: boolean
	title: string
}>()

const data = defineModel<string | undefined>({ required: true })

const main = useTemplateRef('main')
const input = useTemplateRef('input-ref')

const [isShow, visibility] = useToggle(!isSecure)
const { copy, isSupported } = useClipboard()
const isHover = useElementHover(main)

const activeElement = useActiveElement()
const isActiveInput = computed(() => activeElement.value === input.value)
watch([() => isActiveInput.value, () => isEdit], ([isActiveInput, isEdit]) => {
	if (!isSecure || !isEdit || !isActiveInput) return
	visibility(true)
})

const placeholder = computed(() => {
	if (!isSecure || isShow.value) return propPlaceholder
	return '*'.repeat(propPlaceholder?.length ?? 0)
})
</script>
