<template>
	<div class="flex justify-center items-center h-full">
		<form @submit.prevent="handleSubmit">
			<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
				<legend class="fieldset-legend">
					<Icon :name="isLogin ? 'bx:user-check' : 'bx:user-plus'" />
					{{ isLogin ? 'Login' : 'Register' }}
				</legend>

				<label class="label">Username</label>

				<select v-if="isLogin" ref="username-select" autocomplete="username" class="select mb-1" v-model="username">
					<option v-for="usernames in usersUsername" :value="usernames">{{ usernames }}</option>
				</select>
				<input
					v-else
					ref="username-input"
					v-model="username"
					autocomplete="username"
					type="text"
					class="input mb-1"
					:class="{ 'input-error animate-shake-bottom': usernameError }"
					placeholder="Morty Smith"
					required
					minlength="1"
				/>
				<transition mode="out-in" name="blur">
					<p v-if="usernameError" class="flex gap-1 items-center text-error">
						<Icon name="bx:error-alt" />
						{{ usernameError }}
					</p>
				</transition>

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
						class="btn btn-soft ~btn-primary btn-square btn-xs absolute top-2 right-2 z-[1]"
						type="button"
						@click="visibilityPassword()"
					>
						<Icon :name="isShowPassword ? 'bx:hide' : 'bx:show-alt'" />
					</button>
				</div>

				<button type="submit" class="btn btn-neutral mt-4" :disabled="!conditions.isAllCheck">
					{{ isLogin ? 'Continue' : 'Create' }}
				</button>

				<button v-show="usersUsername.length" type="button" class="mt-2 link link-hover" @click="changeManualReg()">
					{{ !isLogin ? 'Go back to the login' : 'Create new account' }}
				</button>
			</fieldset>
		</form>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: 'app' })

const { usersDB, isFinished, login, register } = useAuth()

const isCapsLockPressed = useKeyModifier('CapsLock')

const usernameInputEl = useTemplateRef('username-input')
const usernameSelectEl = useTemplateRef('username-select')
const passwordEl = useTemplateRef('password-input')

const username = shallowRef('')
const usernameError = shallowRef('')

const password = shallowRef('')
const passwordError = shallowRef('')
const [isShowPassword, visibilityPassword] = useToggle(false)
const conditions = computed(() => {
	const base = checkConditions(password.value)
	return { base, isAllCheck: base.every(({ check }) => check) }
})

const usersUsername = computed(() => usersDB.value?.map(({ username }) => username) || [])
const [isManualReg, changeManualReg] = useToggle(false)
const isLogin = computed(() => isFinished && !!usersUsername.value.length && !isManualReg.value)

const setLastUsername = () => {
	const el = usersDB.value?.sort((a, b) => b.lastSeen - a.lastSeen)[0]
	if (!el) return
	username.value = el.username
}

watchImmediate(isLogin, async (val) => {
	if (val) {
		setLastUsername()
		await nextTick(() => usernameSelectEl.value?.focus())
	} else {
		username.value = ''
		await nextTick(() => usernameInputEl.value?.focus())
	}
})

watchThrottled(
	username,
	(value) => {
		usernameError.value = ``
		if (isLogin.value || !usersUsername.value.includes(value)) return
		usernameError.value = `${value} is exist`
	},
	{ throttle: 250 },
)

const handleSubmit = () => {
	if (isLogin.value) {
		const data = login(username.value, password.value)
		if ('error' in data) {
			passwordError.value = data.error
			passwordEl.value?.focus()
			return
		}
	} else {
		const data = register(username.value, password.value)
		if ('error' in data) {
			passwordError.value = data.error
			passwordEl.value?.focus()
			return
		}
	}
	navigateTo('/app')
}
</script>

<script lang="ts">
function checkConditions(password: string) {
	return [
		{ title: 'At least 8 char', check: password.length >= 8 },
		{ title: 'At least 1 uppercase', check: /(?=.*[A-Z])/.test(password) },
		{ title: 'At least 1 number', check: /(?=.*\d)/.test(password) },
	]
}
</script>
