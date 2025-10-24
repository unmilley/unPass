export const routeSidebarItems = [
	[
		{ title: 'Homepage', icon: 'bx:home-heart', path: '/app', isSecure: true },
		{ title: 'Accounts', icon: 'bx:user-circle', path: '/app/accounts', isSecure: true },
		{ title: 'Cards', icon: 'bx:credit-card', path: '/app/card', isSecure: true },
	],
	[],
	[{ title: 'Settings', icon: 'bx:cog', path: '/app/settings', isSecure: true }],
]

export const disabledRouteMiddleware = ['/', '/app/sign-in']
