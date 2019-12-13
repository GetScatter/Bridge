<template>
	<section class="dash-action-template">
		<section class="image">
			<img src="assets/onboarding_get_started.jpg" />
		</section>

		<section class="details">
			<figure class="above-title">UPGRADE YOURSELF</figure>
			<figure class="title">Link a Credit Card</figure>
			<figure class="text">Credit cards can be used to load up accounts and also interact with third party applications.</figure>
			<Button @click.native="addCreditCard" primary="1" text="I'm ready!"/>
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
					if(done) this.$router.push({name:this.RouteNames.Wallet, query:{type:'card'}});
				}))
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.cta-cc {
		overflow: visible;
		text-align:center;
		border:1px solid $borderlight;
		border-radius:20px;
		display:flex;
		align-items: center;
		justify-content: center;

		.title {
			font-size: $font-size-large;
			font-weight:bold;
		    font-family: 'Poppins', sans-serif;
		}

		.text {
			font-size: $font-size-standard;
		    font-family: 'Poppins', sans-serif;
			margin-top:4px;
			margin-bottom:20px;
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
