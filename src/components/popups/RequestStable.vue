<template>
	<section class="transfer">
		<section class="popup-content">

			<TransferHead :token="token"
			              :title="`How much <span>money</span> do you want to <span>request</span> from <span>${friend.identity.split('@')[0]}</span>?`"
			              v-on:amount="x => fiat = x" />

			<br>
			<br>
			<figure class="line"></figure>
			<br>

			<Input label="Want to add a memo?" :text="memo" v-on:changed="x => memo = x" style="margin-bottom:0;" />

		</section>

		<section class="popup-buttons">
			<Button @click.native="() => closer(null)" text="Cancel" />
			<Button :loading="sending" primary="1" text="Send" icon="fal fa-paper-plane" @click.native="send" />
		</section>


	</section>
</template>
<script>
	import "../../styles/transfers.scss";
	import TransferHead from "../reusable/TransferHead";
	import {mapState} from "vuex";
	import Token from '@walletpack/core/models/Token'

	export default {
		props:['popin', 'closer'],
		components: {TransferHead},
		data(){return {
			memo:'',
			fiat:0,

			sending:false,
		}},
		mounted(){

		},
		computed:{
			...mapState([
				'scatter',
			]),
			friend(){
				return this.popin.data.props.friend;
			},
			token(){
				return Token.fromJson({
					blockchain:'btc',
					chainId:'1',
					symbol:'$'
				});
			},
		},
		methods:{
			async send(){

			},
		},
		watch:{

		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

</style>
