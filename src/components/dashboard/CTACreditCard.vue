<template>
	<section class="cta-cc">
		<section class="container panel-pad">
			<section class="details">
				<figure class="title">Add a credit card</figure>
				<figure class="text">
					Add a credit card to Scatter and open up direct token purchases and third party application integration.
				</figure>
			</section>
			<Button @click.native="addCreditCard" text="Add a Credit Card" />


			<!--<GraphicCard plus="0" />-->
		</section>

	</section>
</template>

<script>
	import { mapState } from 'vuex'

	import GraphicCard from '../graphics/GraphicCard';
	import PopupService from "../../services/utility/PopupService";
	import Popups from "../../util/Popups";

	export default {
		components:{
			GraphicCard
		},
		computed:{

		},
		methods:{
			addCreditCard(){
				PopupService.push(Popups.addCreditCard(done => {

				}))
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.cta-cc {
		overflow: visible;
		background:$blue-gradient;
		margin-top: -80px;
		padding-top:80px;
		padding-bottom:100px;
		text-align:center;

		.title {
			font-size: $font-size-large;
			font-weight:bold;
		    font-family: 'Poppins', sans-serif;
			color:white;
		}

		.text {
			font-size: $font-size-standard;
		    font-family: 'Poppins', sans-serif;
			margin-top:4px;
			margin-bottom:20px;
			color:rgba(255,255,255,0.6);
		}

		button {
			color:white;
			background:lighten($blue, 10%);
			display:inline-block;

		}
	}

	.blue-steel {

	}

	.mobile {

	}


</style>
