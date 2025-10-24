<template>
	<div class="space-y-1">
		<label class="label">Username</label>

		<select v-if="isLogin" ref="username-select" autocomplete="username" class="select mb-1" v-model="username">
			<option v-for="usernames in userUsernames" :value="usernames">{{ usernames }}</option>
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
	</div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{ isLogin?: boolean; userUsernames?: string[] }>(), { isLogin: true, userUsernames: () => [] })

const username = defineModel<string>({ required: true })
const usernameError = defineModel<string>('error', { required: false })

const usernameInputEl = useTemplateRef('username-input')
const usernameSelectEl = useTemplateRef('username-select')

defineExpose({
	focus: {
		input: (): void => usernameInputEl.value?.focus(),
		select: (): void => usernameSelectEl.value?.focus(),
	},
})
</script>
