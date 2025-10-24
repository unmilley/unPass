<template>
	<div class="flex justify-center items-center h-full">
		<form @submit.prevent="handleSubmit">
			<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
				<legend class="fieldset-legend">
					<Icon :name="isLogin ? 'bx:user-check' : 'bx:user-plus'" />
					{{ isLogin ? 'Login' : 'Register' }}
				</legend>

				<AuthFormUsername
					ref="username-input"
					v-model="username"
					v-model:error="usernameError"
					:is-login
					:user-usernames
				/>
				<AuthFormPassword
					ref="password-input"
					v-model="password"
					v-model:error="passwordError"
					@check-conditions="conditions = $event"
				/>

				<button type="submit" class="btn btn-neutral mt-4" :disabled="!conditions">
					{{ isLogin ? 'Continue' : 'Create' }}
				</button>

				<button v-show="userUsernames.length" type="button" class="mt-2 link link-hover" @click="changeManualReg()">
					{{ !isLogin ? 'Go back to the login' : 'Create new account' }}
				</button>
			</fieldset>
		</form>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: 'app' })

const route = useRoute()

const { usersDB, isFinished, login, register, userUsernames, isExistUser } = useAuth()

const usernameInputEl = useTemplateRef('username-input')
const passwordInputEl = useTemplateRef('password-input')

const username = shallowRef('')
const usernameError = shallowRef('')

const password = shallowRef('')
const passwordError = shallowRef('')

const conditions = shallowRef(false)

const [isManualReg, changeManualReg] = useToggle(false)
const isLogin = computed(() => isFinished.value && !!userUsernames.value.length && !isManualReg.value)

const setLastUsername = () => {
	const el = usersDB.value?.toSorted((a, b) => b.lastSeen - a.lastSeen)[0]
	if (!el) return
	username.value = el.username
}

watchImmediate(isLogin, async (val) => {
	if (val) {
		setLastUsername()
		await nextTick(() => usernameInputEl.value?.focus.select())
	} else {
		username.value = ''
		await nextTick(() => usernameInputEl.value?.focus.input())
	}
})

watchThrottled(
	username,
	(value) => {
		usernameError.value = ``
		if (isLogin.value || !isExistUser(value)) return
		usernameError.value = `${value} is exist`
	},
	{ throttle: 250 },
)

const handleSubmit = () => {
	if (isLogin.value) {
		const data = login(username.value, password.value)
		if (data.error) {
			passwordError.value = data.error
			passwordInputEl.value?.focus.input()
			return
		}
	} else {
		const data = register(username.value, password.value)
		if (data.error) {
			passwordError.value = data.error
			passwordInputEl.value?.focus.input()
			return
		}
		changeManualReg(false)
		handleSubmit()
	}
	navigateTo('/app/' + (route.query['from'] ?? ''))
}
</script>
