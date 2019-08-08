<template>
	<section class="cta-premium">
		<section class="graphic">

		</section>

		<section class="details">
			<figure class="title">Unlock <b>Premium</b></figure>
			<figure class="text">
				Verifying your identity opens up glorious premium features, removes the $150 credit card threshold and lowers fees for things like card purchases.
			</figure>
			<Button text="Begin Verification"/>
		</section>
	</section>
</template>

<script>
	import { mapState } from 'vuex'

	export default {
		computed:{

		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.cta-premium {
		overflow: hidden;

		.graphic {
			width:250px;
			height:140px;
			background:$blue-gradient;
			border-radius:10px;
			position: relative;
			float:left;
			margin-right:50px;
			padding:22px 24px 20px;
		}

		.title {
			font-size: 28px;
			font-weight: bold;

		}

		.text {
			color:$grey;
			font-size: 13px;
			margin-bottom:20px;
			margin-top:4px;
		}
	}

	.mobile {
		.cta-premium {
			overflow: hidden;
			text-align:center;

			.graphic {
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
