<template>
	<div ref="main" class="card w-full h-full">
		<div class="card-body p-0">
			<div class="flex items-center gap-2" :class="{ invisible: !data.title && !isEdit }">
				<Icon name="bx:credit-card-front" size="1.25rem" />
				<span v-if="!isEdit" class="block border-b border-transparent h-[22px]">{{ data.title }}</span>
				<input v-else v-model="data.title" class="block border-b border-base-content" type="text" placeholder="Debit" />
			</div>
			<div class="">
				<div class="join join-vertical relative w-full">
					<CardItemMain
						v-model="data.number"
						title="Number card"
						:is-edit
						is-secure
						placeholder="1224 **** **** 1100"
					/>
					<div class="join-item join join-horizontal *:mt-0!">
						<CardItemMain v-model="data.date" title="Date" :is-edit is-secure placeholder="1229" />
						<CardItemMain v-model="data.cvv" title="CVV/CVC" :is-edit is-secure placeholder="111" />
					</div>
				</div>
			</div>
			<div class="">
				<AnimatePresence :initial="false">
					<motion.div
						v-if="isShowMore"
						:initial="{ height: '0px' }"
						:animate="{ height: 'auto' }"
						:exit="{ height: '0px' }"
						key="details"
						class="space-y-2 mb-2"
					>
						<CardItemDetail
							v-for="{ type, placeholder, isVisible, title, isTextarea, isSecure } in details"
							:key="type"
							v-model="data[type]"
							:is-visible
							:isEdit
							:title
							:type
							:isSecure
							:placeholder
							:is-textarea
							@add="addDetail"
							@delete="deleteDetail"
						/>
					</motion.div>
				</AnimatePresence>
				<Tooltip v-if="isSomeDetail" class="w-full" :tip="isShowMore ? 'Hide more' : 'Show more'">
					<button class="btn w-full" @click="toggleShowMore()" :disabled="!isSomeDetail">
						<Motion :animate="{ rotate: isShowMore ? 180 : 0 }">
							<Icon name="bx:chevron-down" size="1.5rem" />
						</Motion>
					</button>
				</Tooltip>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { CardItemDetail } from '#components'
import { AnimatePresence, Motion, motion } from 'motion-v'
import type { CardData } from '~/types'

const props = defineProps<{ data: CardData; isEdit: boolean }>()
const emits = defineEmits<{ 'update:data': [CardData] }>()

const data = reactive(props.data)

const [isShowMore, toggleShowMore] = useToggle(false)

watch(data, (val) => {
	emits('update:data', val)
})

watchImmediate(
	() => props.isEdit,
	(val) => (isShowMore.value = val),
)

const details = computed((): Array<Omit<InstanceType<typeof CardItemDetail>['$props'], 'isEdit' | 'modelValue'>> => {
	return [
		{ type: 'pin', title: 'Pin', placeholder: '1235', isVisible: 'pin' in data, isSecure: true },
		{
			type: 'secretWord',
			title: 'Secret word',
			placeholder: 'Berries',
			isVisible: 'secretWord' in data,
			isSecure: true,
		},
		{
			type: 'description',
			title: 'Description',
			placeholder: 'Cashback on the 25th',
			isVisible: 'description' in data,
			isTextarea: true,
		},
	]
})

const isSomeDetail = computed(() => details.value.some(({ isVisible }) => isVisible))

const addDetail = (type: keyof CardData, el: HTMLElement | null) => {
	data[type] = ''
	nextTick(() => {
		if (!el) return
		const textarea = el.querySelector('textarea')
		const input = el.querySelector('input')
		textarea && textarea.focus()
		input && input.focus()
	})
}
const deleteDetail = (type: keyof CardData) => {
	delete data[type]
}

// defineExpose({ visibilityPassword })
</script>
