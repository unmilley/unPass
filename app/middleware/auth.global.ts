const DisabledMiddleware = ['/', '/app/sign-in']

export default defineNuxtRouteMiddleware((to, from) => {
	if (DisabledMiddleware.includes(to.path)) return

	const { isAuth } = useAuth()
	if (!isAuth.value) return navigateTo('/app/sign-in')
})
