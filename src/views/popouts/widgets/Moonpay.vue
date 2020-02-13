<template>
	<section class="moonpay">
		<section class="content">
			<iframe v-if="src" sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
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
	import {POST} from '@walletpack/core/services/apis/BackendApiService';

	export default {
		props:['popup', 'closer'],
		data(){return {
			src:null
		}},
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
			random(){
				return this.popup.data.props.random
			},
			identifier(){
				return this.scatter.hash;
			},

		},
		async mounted(){
			const options = {
				// apiKey:'pk_test_uQlwYQs3jLbrl53VWKv1xW1XZ7eHsr65',
				apiKey:'pk_live_NuTKeMYegyaGK6Puxk7Pn89RbvDgG3P',
				colorCode:'%2300A8FF',
				externalCustomerId:this.identifier + (this.random || ''),
			};

			if(this.to) options.walletAddress = this.to;
			if(this.token) options.currencyCode = this.token.symbol;
			if(this.amount) options.baseCurrencyAmount = parseFloat(this.amount).toFixed(2);
			if(this.memo) options.walletAddressTag = this.memo;
			if(this.email) options.email = this.email;

			const userCurrency = this.scatter.settings.displayCurrency;
			options.baseCurrencyCode = ['EUR', 'GBP', 'USD'].includes(userCurrency) ? userCurrency : 'USD';

			let url = 'https://buy.moonpay.io' + Object.keys(options).reduce((acc, key, index) => {
				acc += index === 0 ? '?' : '&';
				acc += key + '=' + options[key];
				return acc;
			}, '');

			console.log('url', url);

			const signed = await POST(`moonpay/sign`, {url});
			url += `&signature=${encodeURIComponent(signed)}`;
			console.log(url);

			this.src = url;
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
