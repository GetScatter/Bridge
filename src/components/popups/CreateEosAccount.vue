<template>
	<section class="create-eos-account">
		<!--<section class="popup-head">-->
			<!--<figure class="symbol">-->
				<!--<img src="https://www.btcnn.com/wp-content/uploads/2018/11/eos-cryptocurrency-crypto-currency-coin-logo-3cbf68c28ac9549e-512x512.png" />-->
			<!--</figure>-->
			<!--<figure class="title">Create an account for {{network.name}}</figure>-->
		<!--</section>-->

		<section class="popup-content">
			<figure class="description">
				{{network.name}} accounts require various resources in order to use.
				Because of this, you will have to pay a small fee to create your account.
				<br>
				<br>
				<br>
				<br>
				<b>This account will cost $2.12</b>
			</figure>
		</section>

		<section class="popup-buttons">
			<Button secondary="1" text="Cancel" />
			<Button primary="1" text="Pay with Card" />
		</section>

	</section>
</template>

<script>

	const STATES = {
		CARD:0,
		BILLING:1,
	};

	export default {
		props:['popin'],
		data(){return {

		}},
		computed:{
			network(){
				return this.popin.data.props.network;
			},
		},
		methods:{

		},

	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.create-eos-account {
		max-width:400px;
		width:100%;
		text-align:center;

		.popup-content {
			padding:20px 40px;
		}

		.symbol {
			img {
				width:60px;
			}
		}

		.title {
			margin-top:20px;
			font-size: 18px;
			font-weight: bold;
		}

		.description {
			padding:40px 0;
			font-size: 14px;
		}

		button {
			margin-top:10px;
			display:inline-block;
		}
	}

</style>