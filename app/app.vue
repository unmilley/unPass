<template>
	<div>
		<NuxtRouteAnnouncer />
		<NuxtLayout>
			<NuxtPage
				:transition="{
					name: 'blur',
					mode: 'out-in',
				}"
			/>
		</NuxtLayout>
	</div>
</template>
