<template>
	<div ref="main" class="relative">
		<template v-if="isVisible">
			<label class="label justify-between w-full">
				<span>{{ title }}</span>
				<button v-if="isEdit" class="btn btn-square btn-xs mr-1" @click="emits('delete', type)">
					<Icon name="bx:x" />
				</button>
			</label>
			<textarea
				v-if="isTextarea"
				ref="textarea"
				v-model="data"
				class="textarea resize-none focus:outline-0 placeholder-shown:text-base-content/50"
				:placeholder
				:readonly="!isEdit"
			/>
			<input
				v-else
				v-model="data"
				ref="input-ref"
				:type="isShow ? 'text' : 'password'"
				class="input focus:outline-0 placeholder-shown:text-base-content/50"
				:readonly="!isEdit"
				:placeholder
			/>
			<div class="absolute top-[29px] right-2 flex gap-1 z-1">
				<motion.button
					v-if="isSecure && data"
					:animate="{ opacity: isHover ? 1 : 0, scale: isHover ? 1 : 0 }"
					class="btn btn-soft btn-xs btn-square"
					:class="{ 'btn-active': isShow }"
					@click="visibility()"
				>
					<Icon :name="isShow ? 'bx:hide' : 'bx:show'" size="1rem" />
				</motion.button>
				<motion.button
					v-if="isSupported && !isEdit && data"
					:animate="{ opacity: isHover ? 1 : 0, scale: isHover ? 1 : 0 }"
					class="btn btn-soft btn-xs btn-square"
					@click="copy(data)"
				>
					<Icon name="bx:copy" size="1rem" />
				</motion.button>
			</div>
		</template>
		<template v-else-if="isEdit">
			<button class="btn btn-sm w-full" @click="emits('add', type, main)">{{ title }} <Icon name="bx:plus" /></button>
		</template>
	</div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import type { CardData } from '~/types'

const {
	isTextarea = false,
	placeholder: propPlaceholder,
	isSecure = false,
} = defineProps<{
	placeholder?: string
	type: keyof CardData
	isVisible: boolean
	isTextarea?: boolean
	isSecure?: boolean
	title: string
	isEdit: boolean
}>()
const emits = defineEmits<{
	add: [type: keyof CardData, el: HTMLElement | null]
	delete: [type: keyof CardData]
}>()

const data = defineModel<string | undefined>({ required: true })

const { textarea } = useTextareaAutosize({
	input: data.value,
	styleProp: 'minHeight',
})

const main = useTemplateRef('main')

const [isShow, visibility] = useToggle(false)
const { copy, isSupported } = useClipboard()
const isHover = useElementHover(main)

const placeholder = computed(() => {
	if (!isSecure || isShow.value) return propPlaceholder
	return '*'.repeat(propPlaceholder?.length ?? 0)
})
</script>
