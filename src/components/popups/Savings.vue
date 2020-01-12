<template>
	<section class="transfer">
		<section class="popup-content">



			<TransferHead :token="token"
			              :title="`How much <span>${token.symbol}</span> do you want to add to your <span>savings</span>?`"
			              v-on:amount="x => fiat = x" subtitle="" />

			<section class="flex description">
				<img src="@/assets/savings.svg" />
				<span>Adding tokens to savings allows you to generate annual revenue on your assets by locking them up.</span>
			</section>

			<!--<section class="apr">-->
				<!--{{token.symbol}} tokens provide 7.5% APR-->
			<!--</section>-->
		</section>

		<section class="popup-buttons">
			<Button @click.native="() => closer(null)" text="Cancel" />
			<Button :loading="sending" primary="1" text="Add to savings" icon="fal fa-piggy-bank" @click.native="send" />
		</section>


	</section>
</template>
<script>
	import "../../styles/transfers.scss";
	import SymbolBall from "../reusable/SymbolBall";
	import TransferHead from "../reusable/TransferHead";
	import {mapState} from "vuex";

	export default {
		props:['popin', 'closer'],
		components: {TransferHead, SymbolBall},
		data(){return {
			sending:false,
		}},
		mounted(){

		},
		computed:{
			...mapState([
				'scatter',
			]),
			token(){
				return this.popin.data.props.token;
			},
		},
		methods:{
			async save(){

			},
		},
		watch:{

		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.transfer {
		.apr {
			background:$blue;
			color:white;
			padding:10px 20px;
			margin:40px -40px -40px -40px;
			overflow: hidden;
			font-size: $font-size-small;

		}

		.description {
			display:flex;
			align-items: center;
			margin-top:20px;

			img {
				width:100px;
			}

			span {
				padding-left:10px;
				font-size: $font-size-standard;
				text-align:left;
			}
		}
	}

</style>
