<template>
	<section class="reset-scatter">

		<section class="popup-content">

			<figure class="title">Are you sure you want to <span>Reset Scatter</span>?</figure>
			<figure class="sub-title">
				This action is not reversible, and you will lose all of the keys/accounts that you haven't saved, your current settings, and all other data.
			</figure>

		</section>

		<section class="popup-buttons">
			<Button primary="1" @click.native="() => closer(null)" text="Cancel" />
			<Button @click.native="reset" icon="fas fa-exclamation-triangle" text="Reset" />
		</section>

	</section>
</template>

<script>
	import SocketService from "@walletpack/core/services/utility/SocketService";

	export default {
		props:['popin', 'closer'],
		data(){return {

		}},
		mounted(){

		},
		destroyed(){

		},
		methods:{
			async reset(){
				await SocketService.close();

				setTimeout(async () => {
					await window.wallet.storage.clearWalletData();
					await window.wallet.lock();
					window.wallet.utility.reload()
				}, 500);
			},
		},
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.reset-scatter {
		max-width:400px;

		width:calc(100% - 80px);
		margin:0 auto;

		animation: red-alert 0.5s linear infinite;

		@keyframes red-alert {
			0%, 100% { border:5px solid transparent; }
			50% {border:5px solid $red;}
		}

		.sub-title {
			color:$red;
			font-weight: bold;
		}
	}


</style>
