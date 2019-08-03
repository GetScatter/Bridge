<template>
	<section class="cta-cc">
		<GraphicCard plus="1" />

		<section class="details">
			<figure class="title">Easier <b>Payments</b></figure>
			<figure class="text">
				Add a credit card to Scatter and open up direct token purchases and third party application integration.
			</figure>
			<Button text="Add a Credit Card"/>
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
		overflow: hidden;



		.title {
			font-size: 28px;
			font-weight: bold;

			b {
				color:$blue;
				font-weight: 800;
			}
		}

		.text {
			color:$grey;
			font-size: 13px;
			margin-top:10px;
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
				text-align:left;
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
