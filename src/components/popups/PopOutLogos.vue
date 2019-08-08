<template>
	<section :class="{'logos':!!app.img}">
		<figure class="logo" v-if="!!app.img">
			<!--<Scatter v-if="app.applink === 'Scatter'" />-->
			<img v-if="app.img" :src="app.img" />
			<span v-else>{{app.name}}</span>
		</figure>
	</section>
</template>

<script>
	export default {
		props:['app']
	}
</script>