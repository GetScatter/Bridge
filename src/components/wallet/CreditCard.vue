<template>
	<section class="credit-card panel-head panel-pad limiter">

		<section v-if="scatter.keychain.cards.length">
			<GraphicCard />
			<section class="details">
				<figure class="title">Credit Card</figure>
				<figure class="description">Your credit card number or personal information never makes it to third party applications.</figure>
				<Button @click.native="removeCard" primary="1" text="Remove Card"/>
			</section>
		</section>

		<section v-else>
			<CTACreditCard />
		</section>

		<br>
		<br>
		<br>
	</section>
</template>

<script>
	import GraphicCard from '../graphics/GraphicCard'
	import CreditCardService from "../../services/credit/CreditCardService";
	import {mapState} from "vuex";
	import CTACreditCard from "../dashboard/CTACreditCard";

	export default {
		components:{
			CTACreditCard,
			GraphicCard,
		},
		computed:{
			...mapState([
				'scatter'
			])
		},
		methods:{
			removeCard(){
				CreditCardService.removeCard()
			}
		}

	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.credit-card {
		text-align:left;
		display:flex;
		align-items: center;

		.card {
			display:inline-block;
			margin:0 auto;
			margin-top:30px;
			float:none;
		}

		button {
			margin-top:20px;

		}

		.details {
			padding-left:20px;

			.title {
				font-family: 'Poppins', sans-serif;
			}
		}
	}

</style>