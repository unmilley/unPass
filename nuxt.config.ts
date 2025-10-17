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

	ssr: false,
	vite: {
		plugins: [tailwindcss()],
		clearScreen: false,
		envPrefix: ['VITE_', 'TAURI_'],
		server: { strictPort: true },
	},
	ignore: ['**/src-tauri/**'],
})
