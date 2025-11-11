<template>
	<div class="alert [--alert-color:var(--color-base-100)] border-0 min-h-16">
		<AccountHeaderFavicon :url="account.url ?? ''" />
		<div v-if="isEdit" class="w-full max-w-[111px]">
			<input
				v-model="account.title"
				class="block w-[109px] font-bold border-b border-base-content placeholder-shown:text-base-content/50"
				type="text"
				placeholder="Github"
			/>
			<input
				v-model="account.url"
				class="block text-xs border-b border-base-content placeholder-shown:text-base-content/50"
				type="text"
				placeholder="https://github.com"
			/>
		</div>
		<div v-else class="w-full max-w-[111px]">
			<h3 class="font-bold border-b border-transparent" :title>{{ title }}</h3>
			<TauriLink
				:href="account.url"
				:title="account.url"
				class="block link link-hover text-xs cursor-pointer border-b border-transparent"
			>
				{{ account.url }}
			</TauriLink>
		</div>
		<Dropdown ref="dropdown-ref" class="dropdown-end">
			<summary class="btn btn-sm btn-square">
				<Icon name="bx:menu" size="1.25rem" />
			</summary>
			<ul
				class="menu dropdown-content z-10 w-max max-w-52 p-2 shadow-sm bg-base-100/80 backdrop-blur-xs border border-base-300 rounded-box"
			>
				<li @click="dropdown?.close()">
					<a @click.prevent="emits('edit', account.id)">
						<Icon name="bx:edit-alt" />
						Edit
					</a>
				</li>
				<div class="divider my-0"></div>
				<li @click="dropdown?.close()">
					<a class="bg-error/20 text-error-content hover:bg-error" @click.prevent="emits('delete', account.id)">
						<Icon name="bx:trash-alt" />
						Remove
					</a>
				</li>
			</ul>
		</Dropdown>
	</div>
</template>

<script lang="ts" setup>
import type { Account } from '~/types'

const { isEdit, title } = defineProps<{ isEdit: boolean; title: string }>()
const emits = defineEmits<{ edit: [string]; delete: [string] }>()
const dropdown = useTemplateRef('dropdown-ref')

const account = defineModel<Account>({ required: true })
</script>
