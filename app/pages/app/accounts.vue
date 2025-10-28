<template>
	<section class="h-full">
		<div class="flex items-center justify-between gap-2 flex-col sm:flex-row sm:px-2">
			<div class="flex items-center gap-2">
				<h1 class="text-xl sm:text-2xl font-bold">Accounts</h1>
				<Tooltip pos="bottom" tip="Add record">
					<Tooltip pos="right" content-bg="transparent">
						<template #content>
							<kbd class="kbd">Enter</kbd>
						</template>
						<button class="btn btn-ghost btn-square" @click="addNewAccount">
							<Icon name="bx:plus" />
						</button>
					</Tooltip>
				</Tooltip>
			</div>
			<label v-show="data.length" class="input input-sm w-[clamp(3rem,13rem,100%)] font-mono">
				<Icon name="bx:search" class="h-[1em] opacity-50" size="1.75rem" />
				<input ref="search-ref" v-model="search" type="search" class="grow" placeholder="Search" />
				<kbd class="kbd kbd-sm hidden sm:inline-flex">Ctrl</kbd>
				<kbd class="kbd kbd-sm hidden sm:inline-flex">K</kbd>
			</label>
		</div>
		<div class="divider mt-0"></div>
		<div class="overflow-y-auto h-[calc(100%-4.5rem)] space-y-4 pr-2.5">
			<div v-if="!isFinished || !data" class="size-full flex items-center justify-center">
				<Icon name="bx:loader-alt" size="2rem" class="animate-spin" />
			</div>
			<div v-else-if="data.length && search.length" class="flex flex-wrap justify-center gap-2">
				<AccountCard
					v-for="({ refIndex, item: value }, idx) in results"
					:key="refIndex + (value.url ?? value.title ?? '')"
					:account="value"
				/>
			</div>
			<template v-else-if="data.length">
				<VueDraggable
					v-model="data"
					:animation="150"
					:disabled="!!idForEdit.length"
					target=".draggable-target"
					ghost-class="ghost"
				>
					<div class="draggable-target flex flex-wrap justify-start gap-4 p-1">
						<AccountCard
							v-for="value in data"
							:key="value.id"
							:account="value"
							@save="saveEditAccount($event)"
							@delete="deleteAccount($event)"
						/>
					</div>
				</VueDraggable>
			</template>
			<div v-else class="flex justify-center">
				<div
					class="card card-dash border-base-content/50 bg-base-300 w-96 rounded-field"
					:data-theme="isDark ? 'light' : 'dark'"
				>
					<div class="card-body">
						<h2 class="card-title">You don't have any records yet</h2>
						<div class="card-actions justify-end">
							<button class="btn btn-ghost" @click="addNewAccount">Add</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script lang="ts" setup>
import { nanoid } from 'nanoid'
import { VueDraggable } from 'vue-draggable-plus'
import type { Account } from '~/types'

definePageMeta({ layout: 'app' })

const route = useRoute()

const isDark = useDark()

const searchEl = useTemplateRef('search-ref')
const search = shallowRef('')

const idForEdit = useState<string>('account:id-for-edit', () => '')

const { Ctrl_K, enter } = useMagicKeys()

whenever(
	() => Ctrl_K?.value,
	() => searchEl.value?.focus(),
)
whenever(
	() => enter?.value,
	() => addNewAccount(),
)

const { isFinished, data: fullData, set } = useData()

const data = computed({
	get: () => fullData.value?.accounts || [],
	set: (val: Account[]) => set('accounts', val),
})

const addNewAccount = () => {
	search.value = ''
	const id = nanoid(5)
	data.value = [{ id, title: '', url: '', data: [] }, ...data.value]
	idForEdit.value = id
}

const saveEditAccount = (account?: Account) => {
	let id = -1
	if (!account) {
		id = data.value.findIndex(({ id }) => id === idForEdit.value)
		if (id === -1) return
		account = data.value[id]!
	} else {
		id = data.value.findIndex(({ id }) => id === account!.id)
		if (id === -1) return
	}

	const isEmpty = !account.title && !account.url && !account.data.length
	const newAccounts = isEmpty ? data.value.toSpliced(id, 1) : data.value.toSpliced(id, 1, account)
	set('accounts', newAccounts)
}

const removeEmptyAccounts = () => {
	if (!data.value || !isFinished.value) return
	const newData = data.value
		.map((d) => {
			if ((!d.title || !d.url) && !d.data.length) return null

			const accounts = d.data.filter(({ login, password }) => Boolean(login || password))
			if (!accounts.length) return null

			return { ...d, data: accounts }
		})
		.filter((val) => val !== null)
	data.value = newData
}

onMounted(() => {
	removeEmptyAccounts()

	if ('new' in route.query) {
		useRouter().replace({ query: {} })
		addNewAccount()
	}
})

onUnmounted(() => {
	saveEditAccount()
})

const deleteAccount = (accountId: string) => {
	const id = data.value.findIndex(({ id }) => id === accountId)
	if (id === -1) return
	const newAccounts = data.value.toSpliced(id, 1)
	set('accounts', newAccounts)
}

const { results } = useFuse(search, () => data.value, {
	fuseOptions: {
		keys: ['title', 'url', 'data.login', 'data.description'],
		isCaseSensitive: false,
		threshold: 0.1,
	},
	resultLimit: 10,
	matchAllWhenSearchEmpty: true,
})
</script>

<style scoped>
@reference '#tailwind.css';

.ghost {
	@apply opacity-50 bg-base-content text-base-100;
}
</style>
