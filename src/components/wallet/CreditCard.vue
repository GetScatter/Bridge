<template>
	<section class="credit-card">

		<section class="hero-panel">
			<figure class="corners"></figure>
		</section>

		<slot></slot>

		<section class="panel-pad limiter">
			<section class="details">
				<h2>You have a credit card linked</h2>
				<p>
					The credit card you have linked to Scatter can be used to load up your accounts as well as interact with third party applications.
				</p>

				<section class="keyval">
					<label>Last 4 digits of your credit card</label>
					<Input disabled="1" :text="card.lastFour" />
				</section>

				<section class="keyval">
					<label>Expiration Date</label>
					<Input disabled="1" :text="card.expiration" />
				</section>


				<section class="flex">
					<Button @click.native="editCard" text="Edit Card Details"/>
					<Button @click.native="removeCard" primary="1" text="Remove Card"/>
				</section>
			</section>

			<br>
			<br>
			<br>
		</section>


	</section>
</template>

<script>
	import GraphicCard from '../graphics/GraphicCard'
	import CreditCardService from "../../services/credit/CreditCardService";
	import {mapState} from "vuex";
	import CTACreditCard from "../dashboard/CTACreditCard";
	import {RouteNames} from "../../vue/Routing";
	import Popups from "../../util/Popups";
	import PopupService from "../../services/utility/PopupService";

	export default {
		components:{
			CTACreditCard,
			GraphicCard,
		},
		computed:{
			...mapState([
				'scatter'
			]),
			card(){
				return this.scatter.keychain.cards[0]
			}
		},
		methods:{
			removeCard(){
				this.$router.push({name:RouteNames.Wallet, query:{type:'assets'}});
				CreditCardService.removeCard()
			},
			editCard(){
				PopupService.push(Popups.addCreditCard(done => {

				}, this.card));
			},
		}

	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.credit-card {

		h2 {
			margin-bottom:5px;
		}

		p {
			font-size: $font-size-tiny;
		}

		.keyval {
			margin-top:30px;

			label {
				font-size: $font-size-small;
				color:$grey;
				margin-bottom:10px;
				display:block;
			}
		}

	}

</style>
