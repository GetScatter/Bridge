<template>
	<section class="transfer">
		<section class="popup-content">
			<figure class="title">Discarding <span>{{token.symbol}}</span></figure>
			<figure class="sub-title">
				This will remove all {{token.symbol}} from your wallet.
				<b>This action is not reversible!</b>
			</figure>

		</section>

		<section class="popup-buttons">
			<Button @click.native="() => closer(null)" text="Cancel" />
			<Button :loading="sending" primary="1" text="Discard" icon="fal fa-ban" @click.native="burn" />
		</section>


	</section>
</template>
<script>
	import "../../styles/transfers.scss";
	import SymbolBall from "../reusable/SymbolBall";
	import TransferHead from "../reusable/TransferHead";
	import {mapState} from "vuex";
	import SavingsService from "../../services/utility/SavingsService";
	import Discarder from "../../services/utility/Discarder";
	import Popups from "../../util/Popups";
	import PopupService from "../../services/utility/PopupService";

	export default {
		props:['popin', 'closer'],
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
			async burn(){
				this.sending = true;
				const result = await Discarder.discard(this.token);
				this.sending = false;
				if(result) this.closer(true);
				else PopupService.push(Popups.snackbar(`There was an issue discarding ${this.token.symbol}.`))

			},
		},
		watch:{

		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";


</style>
