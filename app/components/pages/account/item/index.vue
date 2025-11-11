<template>
	<div ref="main" class="card w-full h-full">
		<div class="card-body p-0">
			<div class="flex items-center gap-2" :class="{ invisible: !data.title && !isEdit }">
				<Icon name="bx:user-circle" size="1.25rem" />
				<span v-if="!isEdit" class="block border-b border-transparent h-[22px]">{{ data.title }}</span>
				<input
					v-else
					v-model="data.title"
					class="block border-b border-base-content"
					type="text"
					placeholder="Username"
				/>
			</div>
			<div class="">
				<div class="join join-vertical relative w-full">
					<AccountItemMain v-model="data.login" :is-edit="!!isEdit" title="Login" placeholder="Login, Email, Phone" />
					<AccountItemMain
						v-model="data.password"
						:is-edit="!!isEdit"
						is-secure
						title="Password"
						placeholder="Password"
					/>
				</div>
			</div>
			<Transition name="slide-up">
				<div v-if="!isEdit" class="flex items-center gap-2 text-error" :class="{ invisible: true }">
					<Icon name="bx:info-square" size="1.25rem" />
					<nuxt-link to="/" class="link-hover">Password issue</nuxt-link>
				</div>
			</Transition>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { AccountData } from '~/types'

const props = defineProps<{ data: AccountData; isEdit?: boolean }>()
const emits = defineEmits<{ 'update:data': [AccountData] }>()

const data = reactive(props.data)

watch(data, (val) => {
	emits('update:data', val)
})
</script>
