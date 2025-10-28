<template>
	<div ref="main" class="card w-full h-full">
		<div class="card-body p-0 **:[input]:placeholder-shown:text-base-content/50">
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
					<input
						type="text"
						class="input join-item focus:outline-0"
						v-model="data.login"
						:readonly="!isEdit"
						placeholder="Login, Email, Phone"
					/>
					<input
						:type="isShowPassword ? 'text' : 'password'"
						class="input join-item focus:outline-0"
						v-model="data.password"
						:readonly="!isEdit"
						placeholder="Password"
					/>
					<Transition name="blur">
						<div v-if="isHover && isSupported && !isEdit" class="absolute top-2 right-2 flex gap-1 z-1">
							<button class="btn btn-soft btn-xs btn-square" @click="copy(data.login)">
								<Icon name="bx:copy" size="1rem" />
							</button>
						</div>
					</Transition>
					<div class="absolute bottom-2 right-2 flex gap-1 z-1">
						<Transition name="blur">
							<button
								v-show="isHover"
								class="btn btn-soft btn-xs btn-square"
								:class="{ 'btn-active': isShowPassword }"
								@click="visibilityPassword()"
							>
								<Icon :name="isShowPassword ? 'bx:hide' : 'bx:show'" size="1rem" />
							</button>
						</Transition>
						<Transition name="blur">
							<button
								v-if="isHover && isSupported && !isEdit"
								class="btn btn-soft btn-xs btn-square"
								@click="copy(data.password)"
							>
								<Icon name="bx:copy" size="1rem" />
							</button>
						</Transition>
					</div>
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

const main = useTemplateRef('main')
const isHover = useElementHover(main)

const { copy, isSupported } = useClipboard()
const [isShowPassword, visibilityPassword] = useToggle(false)

defineExpose({ visibilityPassword })
</script>
