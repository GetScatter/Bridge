<template>
	<section class="transfer">
		<section class="popup-content">

			<TransferHead :token="token" :title="title" v-on:amount="x => token.amount = x" />

			<section class="flex description">
				<img src="/static/assets/savings.svg" />
				<span>{{subtitle}}</span>
			</section>
		</section>

		<section class="popup-buttons">
			<Button @click.native="() => closer(null)" text="Cancel" />
			<Button v-if="!open" :loading="sending" primary="1" text="Add to savings" icon="fal fa-piggy-bank" @click.native="save" />
			<Button v-if="open" :loading="sending" primary="1" text="Break piggy" icon="fal fa-hammer" @click.native="unsave" />
		</section>


	</section>
</template>
<script>
	import "../../styles/transfers.scss";
	import SymbolBall from "../reusable/SymbolBall";
	import TransferHead from "../reusable/TransferHead";
	import {mapState} from "vuex";
	import SavingsService from "../../services/utility/SavingsService";

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
			open(){
				return this.popin.data.props.open;
			},
			title(){
				return this.open
					? `How much <span>${this.token.symbol}</span> do you want to take out of <span>savings</span>?`
					: `How much <span>${this.token.symbol}</span> do you want to add to your <span>savings</span>?`;
			},
			subtitle(){
				return this.open
					? `Taking tokens out of savings triggers a time delay where tokens will neither be in savings or available for sending.`
					: `Adding tokens to savings allows you to either acquire network resources or generate annual revenue on your assets by locking them up for a period of time.`;
			},

		},
		methods:{
			async save(){
				this.sending = true;
				const result = await SavingsService.save(this.token);
				this.sending = false;
			},
			async unsave(){
				this.sending = true;
				const result = await SavingsService.unsave(this.token);
				this.sending = false;
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
