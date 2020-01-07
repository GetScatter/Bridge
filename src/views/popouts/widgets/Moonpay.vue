<template>
	<section class="moonpay">
		<section class="content">
			<iframe sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
					frameborder="0"
					height="100%"
					:src="src"
					width="100%"
			>
				<p>Your browser does not support iframes.</p>
			</iframe>
		</section>

		<section class="popout-buttons">
			<Button @click.native="closer(false)" text="Close" />
		</section>

	</section>
</template>

<script>
	import {mapState} from "vuex";

	export default {
		props:['popup', 'closer'],
		computed:{
			...mapState([
				'scatter',
			]),
			token(){
				return this.popup.data.props.token
			},
			amount(){
				return this.popup.data.props.amount
			},
			to(){
				return this.popup.data.props.to
			},
			memo(){
				return this.popup.data.props.memo
			},
			email(){
				return this.popup.data.props.email
			},
			src(){
				const options = {
					apiKey:'pk_test_uQlwYQs3jLbrl53VWKv1xW1XZ7eHsr65',
					colorCode:'%2300A8FF',
				};

				if(this.to) options.walletAddress = this.to;
				if(this.token) options.currencyCode = this.token.symbol;
				if(this.amount) options.baseCurrencyAmount = parseFloat(this.amount).toFixed(2);
				if(this.memo) options.walletAddressTag = this.memo;
				if(this.email) options.email = this.email;

				const userCurrency = this.scatter.settings.displayCurrency;
				options.baseCurrencyCode = ['EUR', 'GBP', 'USD'].includes(userCurrency) ? userCurrency : 'USD';

				const url = 'https://buy-staging.moonpay.io' + Object.keys(options).reduce((acc, key, index) => {
					acc += index === 0 ? '?' : '&';
					acc += key + '=' + options[key];
					return acc;
				}, '');

				console.log(url);

				return url;
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../../../styles/variables";

	.moonpay {

		.content {
			padding:0;
		}

		iframe {
		}
	}

</style>
