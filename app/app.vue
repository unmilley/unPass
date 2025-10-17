<template>
	<div>
		<NuxtRouteAnnouncer />
		<NuxtLayout>
			<NuxtPage
				:transition="{
					name: 'page',
					mode: 'out-in',
				}"
			/>
		</NuxtLayout>
	</div>
</template>

<style>
.page-enter-active,
.page-leave-active {
	transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
	opacity: 0;
	filter: blur(0.05rem);
}
</style>
