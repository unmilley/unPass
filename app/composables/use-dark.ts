export const useDark = createGlobalState(() => {
	const { $colorMode } = useNuxtApp()

	return computed<boolean>({
		get: () => $colorMode.value === 'dark',
		set: (val) => ($colorMode.value = val ? 'dark' : 'light'),
	})
})
