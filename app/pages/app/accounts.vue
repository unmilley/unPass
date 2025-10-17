<template>
	<section class="h-full">
		<div class="flex items-center justify-between gap-2 flex-col sm:flex-row sm:px-2">
			<h1 class="text-xl sm:text-2xl font-bold">Accounts</h1>
			<label class="input input-sm w-[clamp(3rem,13rem,100%)]">
				<Icon name="bx:search" class="h-[1em] opacity-50" />
				<input ref="search-ref" v-model="search" type="search" class="grow" placeholder="Search" />
				<kbd class="kbd kbd-sm hidden sm:inline-flex">Ctrl</kbd>
				<kbd class="kbd kbd-sm hidden sm:inline-flex">K</kbd>
			</label>
		</div>
		<div class="divider mt-0"></div>
		<div class="overflow-y-auto h-[calc(100%-4.5rem)] space-y-4 pr-2.5">
			<!--  -->
			<div
				v-for="{ refIndex, item: value } in results"
				:key="refIndex + (value.url ?? value.title)"
				class="mockup-browser border-base-300 border w-full"
			>
				<div class="mockup-browser-toolbar">
					<input v-if="value.url" v-model="value.url" class="input outline-0" type="text" />
					<input v-else-if="value.title" v-model="value.title" class="input outline-0" type="text" />
				</div>
				<div class="grid place-content-center border-t border-base-300 h-60">Hello!</div>
			</div>
			<!--  -->
		</div>
	</section>
</template>

<script lang="ts" setup>
import { useFuse, type UseFuseOptions } from '~/composables/fuse'
import type { Account } from '~/types'

definePageMeta({ layout: 'app' })

const searchEl = useTemplateRef('search-ref')
const search = shallowRef('')

const { Ctrl_K } = useMagicKeys()

whenever(
	() => Ctrl_K?.value,
	() => searchEl.value?.focus(),
)

const tempAccountData = ref<Account[]>([
	{
		title: '',
		url: 'https://e.mail.ru',

		data: [
			{
				title: '',
				login: 'qwe@qwe.qwe',
				password: '123',
				description: '',
			},
			{
				title: '',
				login: 'qwe2@qwe.qwe',
				password: '123',
				description: '',
			},
		],
	},
	{
		title: '',
		url: 'https://github.com',
		data: [
			{
				title: 'qwe1',
				login: 'qwe@qwe.qwe',
				password: '123',
				description: '',
			},
			{
				title: 'qwe2',
				login: 'qwe@qwe.qwe',
				password: '123',
				description: '',
			},
		],
	},
	{
		title: '',
		url: 'https://google.com',
		data: [
			{
				title: '',
				login: 'qwe@qwe.qwe',
				password: '123',
				description: '',
			},
			{
				title: '',
				login: 'qwe2@qwe.qwe',
				password: '123',
				description: '',
			},
		],
	},
	{
		title: 'Steam',
		url: '',
		data: [
			{
				title: '',
				login: 'qwe',
				password: '123',
				description: 'qwe@qwe.qwe',
			},
			{
				title: '',
				login: 'qwe2',
				password: '123',
				description: 'qwe@qwe.qwe',
			},
		],
	},
	{
		title: 'Госуслуги',
		url: 'https://www.gosuslugi.ru',
		data: [
			{
				title: '',
				login: '79921111111',
				password: '123',
				description: '',
			},
		],
	},
])

const options = computed<UseFuseOptions<Account>>(() => ({
	fuseOptions: {
		keys: ['title', 'url', 'data.login', 'data.description'],
		isCaseSensitive: false,
		threshold: 0.1,
	},
	resultLimit: 10,
	matchAllWhenSearchEmpty: true,
}))

const { results } = useFuse(search, tempAccountData, options)
</script>
