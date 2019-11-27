<template>
	<section class="transaction-success">

		<section class="popup-content">

			<figure class="title">Transaction <span>Successful</span></figure>
			<figure class="sub-title">Congratulations, your transaction went through successfully and was recorded on the global ledger.</figure>

		</section>

		<section class="popup-buttons">
			<Button @click.native="() => closer(null)" text="Close" />
			<Button primary="1" @click.native="open" text="View Details" />
		</section>

	</section>
</template>

<script>


	import {mapGetters} from "vuex";

	export default {
		props:['popin', 'closer'],
		data(){return {

		}},
		computed:{
			...mapGetters([
				'explorers',
			]),
			tx(){
				return this.popin.data.props.tx
			},
			blockchain(){
				return this.popin.data.props.blockchain
			},
			explorer(){
				return this.explorers[this.blockchain].parsed()
			}
		},
		mounted(){

		},
		destroyed(){

		},
		methods:{
			open(){
				this.openInBrowser(this.explorer.transaction(this.tx));
				this.closer(true);
			},
		},
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.transaction-success {
		max-width:400px;

		width:calc(100% - 80px);
		margin:0 auto;

		.sub-title {
			margin-top:-10px;
			font-size: $font-size-standard;
		}

	}


</style>
