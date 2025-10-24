<template>
	<div class="space-y-1">
		<label class="label" for="password">Master key</label>
		<div class="relative *:[p]:font-mono">
			<input
				ref="password-input"
				v-model="password"
				:type="isShowPassword ? 'text' : 'password'"
				:placeholder="isShowPassword ? 'Oh!hell0_<3' : '***********'"
				autocomplete="current-password"
				required
				title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
				class="input mb-1"
				:class="{ 'input-error animate-shake-bottom': passwordError }"
				minlength="8"
				pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
				@input="passwordError = ''"
			/>
			<transition mode="out-in" name="blur">
				<p v-if="isCapsLockPressed" class="flex gap-1 items-center">
					<Icon name="bx:info-circle" />
					Caps Lock is on
				</p>
				<p v-else-if="passwordError" class="flex gap-1 items-center text-error">
					<Icon name="bx:error-alt" />
					{{ passwordError }}
				</p>
			</transition>
			<p v-for="{ title, check } in conditions.base" :key="title" class="flex items-center">
				<Icon :name="check ? 'bx:check' : 'bx:x'" />
				{{ title }}
			</p>
			<button
				v-show="password.length"
				class="btn btn-soft btn-square btn-xs absolute top-2 right-2 z-1"
				type="button"
				@click="visibilityPassword()"
			>
				<Icon :name="isShowPassword ? 'bx:hide' : 'bx:show-alt'" />
			</button>
		</div>
	</div>
</template>

<script lang="ts" setup>
const emits = defineEmits<{ checkConditions: [boolean] }>()

const passwordInputEl = useTemplateRef('password-input')

const password = defineModel<string>({ required: true })
const passwordError = defineModel<string>('error', { required: false })
const [isShowPassword, visibilityPassword] = useToggle(false)

const isCapsLockPressed = useKeyModifier('CapsLock')
const conditions = computed(() => {
	const base = checkConditions(password.value)
	return { base, isAllCheck: base.every(({ check }) => check) }
})

function checkConditions(password: string) {
	return [
		{ title: 'At least 8 char', check: password.length >= 8 },
		{ title: 'At least 1 uppercase', check: /(?=.*[A-Z])/.test(password) },
		{ title: 'At least 1 number', check: /(?=.*\d)/.test(password) },
	]
}

watchDebounced(
	() => conditions.value,
	({ isAllCheck }) => emits('checkConditions', isAllCheck),
	{ debounce: 250, maxWait: 500, immediate: true },
)

defineExpose({
	focus: {
		input: (): void => passwordInputEl.value?.focus(),
	},
})
</script>
