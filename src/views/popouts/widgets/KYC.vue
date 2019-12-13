<template>
	<section class="kyc">
		<section class="content">
			<div v-show="!url" id='veriff-root'></div>
			<iframe v-if="url" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
			        frameborder="0"
			        height="100%"
			        :src="url"
			        width="100%"
			>
				<p>Your browser does not support iframes.</p>
			</iframe>
		</section>

		<section class="popout-buttons">
			<Button @click.native="closer(false)" text="Cancel" />
		</section>

	</section>
</template>

<script>
	import Veriff from '@veriff/js-sdk';
	import PopupService from "../../../services/utility/PopupService";
	import Popups from "../../../util/Popups";

	export default {
		props:['popup', 'closer'],
		data(){return {
			veriff:null,
			url:null,
		}},
		computed:{
			identity(){
				return this.popup.data.props.identity
			},
		},
		mounted(){
			this.veriff = Veriff({
				// TODO: Hardcoded
				apiKey: 'abb12bb9-d0b2-44e8-9cd4-7a0986142f1e',
				parentId: 'veriff-root',
				onSession: (err, response) => {
					if(err) {
						console.log('err', err);
						return PopupService.push(Popups.snackbar(err.statusText ? err.statusText : 'There was an error processing this verification request.'));
					}

					console.log('response', response);

					if(response && response.status === 'success'){
						const verification = response.verification;
						console.log('verification', verification);
						if(verification.url.indexOf('https://magic.veriff.me') !== 0) return console.error('Bad verification URL!');
						this.url = verification.url;
					}
				}
			});

			this.veriff.setParams({
				person: {
					givenName: this.identity.personal.firstname,
					lastName: this.identity.personal.lastname
				},
				vendorData: this.identity.personal.email,
			});

			this.veriff.mount({
				formLabel: {
					givenName: 'First name',
					lastName: 'Last name',
					vendorData: 'Email'
				},
				submitBtnText: 'Get verified',
				loadingText: 'Please wait'
			});
		}
	}
</script>

<style scoped lang="scss">
	@import "../../../styles/variables";

	.kyc {

		.content {
			padding:0;
		}

		iframe {
		}
	}

</style>
