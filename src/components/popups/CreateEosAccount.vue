<template>
	<section class="create-eos-account">
		<figure class="symbol">
			<img src="https://www.btcnn.com/wp-content/uploads/2018/11/eos-cryptocurrency-crypto-currency-coin-logo-3cbf68c28ac9549e-512x512.png" />
		</figure>
		<figure class="title">Create an account for {{network.name}}</figure>
		<figure class="description">
			EOSIO accounts cost money, so you will have to pay a small fee to create one.
		</figure>
		<Button text="Pay $2.12 with Credit Card" />

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
		padding:40px;
		text-align:center;

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
			margin:20px 0;
			border-top:1px solid $borderlight;
			border-bottom:1px solid $borderlight;
			font-size: 14px;
		}

		button {
			margin-top:10px;
			display:inline-block;
		}
	}

	.blue-steel {
		.create-eos-account {
			.description {
				border-top:1px solid $borderdark;
				border-bottom:1px solid $borderdark;
			}
		}
	}

</style>