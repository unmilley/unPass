<template>
	<div
		ref="main"
		class="card bg-base-300 w-64 h-[284px] border border-base-content/0 transition-colors"
		:class="{ 'border-base-content! outline-1 outline-base-content': isEdit }"
	>
		<div
			class="card-body grid grid-cols-[1fr] gap-2.5 p-0 transition-[grid-template-rows] duration-1000 overflow-hidden"
			:class="[isEdit ? 'grid-rows-[64px_108px_40px_40px]' : 'grid-rows-[64px_154px_40px]']"
		>
			<AccountHeader v-model="account" :is-edit :title @edit="idForEdit = $event" @delete="deleteAccount($event)" />
			<!--   -->
			<div class="flex flex-col px-4 transition-[height] duration-1000" :class="[isEdit ? 'h-[124px]' : 'h-[158px]']">
				<Carousel ref="carouselRef" v-model="currentSlide" v-bind="config" class="h-[inherit]!">
					<template v-if="account.data.length">
						<Slide v-for="(data, index) in account.data" :key="index" :index>
							<AccountItem ref="account-form" :data :is-edit @update:data="account.data[index] = $event" />
						</Slide>
					</template>
					<Slide :key="account.data.length" :index="account.data.length">
						<button class="btn btn-square" @click="addEmptyData">
							<Icon name="bx:user-plus" />
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

import type { Account } from '~/types'

const props = defineProps<{ account: Account }>()
const emits = defineEmits<{ save: [Account]; delete: [string] }>()

const accountFormEl = useTemplateRef('account-form')

const account = reactive(props.account)

const idForEdit = useState<string>('account:id-for-edit', () => '')
const clearIdForEdit = () => (idForEdit.value = '')

const save = () => {
	account.data = account.data.filter(({ login, password }) => Boolean(login || password))
	emits('save', account)
	clearIdForEdit()
}

const isEdit = computed(() => idForEdit.value === account.id)

const carouselRef = ref()
const currentSlide = shallowRef(0)
const amountSlides = computed(() => account.data.length + 1)

const title = computed(() => (account.title ? account.title : transformDomain(account.url ?? '')))

const addEmptyData = () => {
	if (!isEdit.value) idForEdit.value = account.id
	account.data.push({ login: '', password: '' })
}

const deleteAccount = (id: string) => {
	emits('delete', id)
}

const config: Partial<CarouselConfig> = {
	height: 'auto',
	itemsToShow: 1,
	wrapAround: true,
	mouseWheel: true,
	mouseDrag: false,
	touchDrag: true,
	gap: 0,
	slideEffect: 'fade',
}

const changeSlide = (isNext: boolean) => {
	accountFormEl.value?.forEach((el) => el?.visibilityPassword(false))
	isNext ? carouselRef.value.next() : carouselRef.value.prev()
}
</script>
