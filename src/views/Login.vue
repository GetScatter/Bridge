<template>
	<section class="login">
		<h1>Scatter Bridge</h1>

		<Button text="Login" :click="login" />
	</section>
</template>

<script>
	import {mapState, mapActions} from 'vuex';
	import * as Actions from 'scatter-core/store/constants';

	export default {
		methods:{
			login(){
				console.log('Logged in with fake oauth');

				let registering = true;

				const uuid = 'testingtestingtestingtestingtesting'
				const password = 'testingtestingtestingtestingtesting';
				

			},

			...mapActions([
				Actions.CREATE_SCATTER
			])
		}
	}
</script>

<style scoped lang="scss">
	@import "../styles/variables";

	.login {
		height:100vh;
		display:flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

</style>

