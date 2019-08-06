<template>
	<section class="cta-cc">
		<GraphicCard plus="0" />

		<section class="details">
			<figure class="title">Add your credit card for easier payments</figure>
			<figure class="text">
				Add a credit card to Scatter and open up direct token purchases and third party application integration.
			</figure>
			<Button text="Add a Credit Card" primary="1"/>
		</section>
	</section>
</template>

<script>
	import { mapState } from 'vuex'

	import GraphicCard from '../graphics/GraphicCard';

	export default {
		components:{
			GraphicCard
		},
		computed:{

		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.cta-cc {
		overflow: visible;

		.title {
			font-size: $font-size-large;
			font-weight:bold;
		    font-family: 'Poppins', sans-serif;
		}

		.text {
			font-size: $font-size-standard;
		    font-family: 'Poppins', sans-serif;
		    opacity:0.4;
			margin-top:4px;
			margin-bottom:20px;
		}
	}

	.blue-steel {
		.cta-cc {
			.card {
				.plus {
					border:2px solid $dark;
				}
			}
		}
	}

	.mobile {
		.cta-cc {
			overflow: hidden;
			text-align:center;

			.card {
				text-align:center;
				float:none;
				margin:0 auto;
			}

			.title {
				display:inline-block;
				width:100%;
				margin-top:20px;
			}

			.text {
				display:inline-block;
				width:100%;
			}

			button {
				display:inline-block;
			}
		}
	}


</style>
