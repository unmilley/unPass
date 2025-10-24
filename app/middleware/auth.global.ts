import { disabledRouteMiddleware } from '~/src/routing'

const getRedirectFrom = (path: string): string => {
	if (path.includes('app/')) {
		path = path.split('/').at(-1) ?? ''
		return path ? `?from=${path}` : getRedirectFrom('')
	}
	return ''
}

export default defineNuxtRouteMiddleware((to, from) => {
	if (disabledRouteMiddleware.includes(to.path)) return

	const { isAuth } = useAuth()
	if (!isAuth.value) return navigateTo(`/app/sign-in${getRedirectFrom(from.path)}`)
})
