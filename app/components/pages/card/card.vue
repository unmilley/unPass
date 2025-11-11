<template>
	<div
		ref="main"
		class="card bg-base-300 w-64 min-h-[284px] border border-base-content/0 transition-colors"
		:class="{ 'border-base-content! outline-1 outline-base-content': isEdit }"
	>
		<div
			class="card-body grid grid-cols-[1fr] gap-2.5 p-0 transition-[grid-template-rows] duration-1000 overflow-hidden"
			:class="[isEdit ? 'grid-rows-[64px_1fr_40px_40px]' : 'grid-rows-[64px_1fr_40px]']"
		>
			<CardHeader v-model="card" :is-edit :title @edit="idForEdit = $event" @delete="deleteCard($event)" />
			<!--   -->
			<div
				class="flex flex-col px-4 transition-[height] duration-1000 h-full"
				:class="[isEdit ? 'min-h-[124px]' : 'min-h-[158px]']"
			>
				<Carousel ref="carouselRef" v-model="currentSlide" v-bind="config" class="h-[inherit]!">
					<template v-if="card.data.length">
						<Slide v-for="(data, index) in card.data" :key="index" :index>
							<CardItem ref="card-form" :data :is-edit @update:data="card.data[index] = $event" />
						</Slide>
					</template>
					<Slide :key="card.data.length" :index="card.data.length">
						<button class="btn btn-square" @click="addEmptyData">
							<Icon name="bx:add-to-queue" />
						</button>
					</Slide>
				</Carousel>
			</div>
			<div class="flex justify-between items-center h-10 overflow-hidden" v-if="amountSlides >= 1">
				<button class="btn btn-circle btn-ghost" @click="changeSlide(false)">
					<Icon name="bx:chevron-left" size="1.5rem" />
				</button>
				<div class="flex gap-1">
					<div
						v-for="s in amountSlides"
						:key="s"
						class="size-2 rounded-full border border-white cursor-pointer"
						:class="{ 'bg-white': s - 1 === currentSlide }"
						@click="currentSlide = s - 1"
					></div>
				</div>
				<button class="btn btn-circle btn-ghost" @click="changeSlide(true)">
					<Icon name="bx:chevron-right" size="1.5rem" />
				</button>
			</div>
			<Transition name="slide-down">
				<button v-if="isEdit" class="btn btn-soft" @click="save()">Save</button>
			</Transition>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { Carousel, Slide, type CarouselConfig } from 'vue3-carousel'
import 'vue3-carousel/carousel.css'

import type { Card } from '~/types'

const props = defineProps<{ card: Card }>()
const emits = defineEmits<{ save: [Card]; delete: [string] }>()

// const cardFormEl = useTemplateRef('card-form')

const card = reactive(props.card)

const idForEdit = useState<string>('card:id-for-edit', () => '')
const clearIdForEdit = () => (idForEdit.value = '')

const save = () => {
	card.data = card.data.filter(({ number }) => Boolean(number))
	emits('save', card)
	clearIdForEdit()
}

const isEdit = computed(() => idForEdit.value === card.id)

const carouselRef = ref()
const currentSlide = shallowRef(0)
const amountSlides = computed(() => card.data.length + 1)

const title = computed(() => (card.title ? card.title : ''))

const addEmptyData = () => {
	if (!isEdit.value) idForEdit.value = card.id
	card.data.push({
		number: '',
		date: '',
		cvv: '',
	})
}

const deleteCard = (id: string) => {
	emits('delete', id)
}

const config: Partial<CarouselConfig> = {
	height: 'auto',
	itemsToShow: 1,
	wrapAround: true,
	mouseWheel: false,
	mouseDrag: false,
	touchDrag: true,
	gap: 0,
	slideEffect: 'fade',
}

const changeSlide = (isNext: boolean) => {
	// cardFormEl.value?.forEach((el) => el?.visibilityPassword(false))
	isNext ? carouselRef.value.next() : carouselRef.value.prev()
}
</script>
