import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	modules: ['@nuxt/icon', '@vueuse/nuxt', '@nuxtjs/color-mode'],

	css: ['~/assets/css/main.css'],

	icon: {
		mode: 'svg',
		collections: ['bx'],
		provider: 'iconify',
		size: '1.25rem',
	},

	colorMode: {
		preference: 'system',
		fallback: 'dark',
		classSuffix: '',
		dataValue: 'theme',
		storageKey: 'theme',
		storage: 'cookie',
	},
	app: {
		head: {
			link: [
				{ rel: 'icon', type: 'image/png', href: '/pwa/favicon-96x96.png', sizes: '96x96' },
				{ rel: 'icon', type: 'image/svg+xml', href: '/pwa/favicon.svg' },
				{ rel: 'shortcut icon', href: '/pwa/favicon.ico' },
				{ rel: 'apple-touch-icon', sizes: '180x180', href: '/pwa/apple-touch-icon.png' },
				{ rel: 'manifest', href: '/pwa/app.webmanifest', crossorigin: 'use-credentials' },
			],
			meta: [{ name: 'apple-mobile-web-app-title', content: 'unPass' }],
		},
	},

	ssr: false,
	vite: {
		plugins: [tailwindcss()],
		clearScreen: false,
		envPrefix: ['VITE_', 'TAURI_'],
		server: { strictPort: true },
	},
	ignore: ['**/src-tauri/**'],
})
