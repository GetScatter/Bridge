<template>
	<section class="import-mnemonic">

		<section class="popup-content">
			<figure class="title">Let's import your <span>words</span>.</figure>
			<figure class="sub-title">Your words (otherwise known as a mnemonic phrase) can be converted into your keys.</figure>

			<br>
			<br>
			<figure class="line"></figure>
			<br>
			<br>
			<Input style="margin-bottom:0;" v-on:changed="x => mnemonic = x" placeholder="Enter your words here, separated by a space" />
		</section>

		<section class="popup-buttons">
			<Button @click.native="() => closer(null)" text="Cancel" />
			<Button @click.native="done" text="Done" icon="fas fa-check" primary="1" />
		</section>

	</section>
</template>

<script>
	import Vue from 'vue';
	import "../../styles/transfers.scss";
	import {mapActions, mapState} from "vuex";
	import * as UIActions from '../../store/ui_actions';
	import {blockchainName, BlockchainsArray, Blockchains} from '@walletpack/core/models/Blockchains'
	import KeyService from "../../services/utility/KeyService";
	import KeyPairService from '@walletpack/core/services/secure/KeyPairService';
	import AccountService from '@walletpack/core/services/blockchain/AccountService';
	import SingularAccounts from "../../services/utility/SingularAccounts";
	import Popups from "../../util/Popups";
	import PopupService from "../../services/utility/PopupService";

	export default {
		props:['popin', 'closer'],
		data(){return {
			mnemonic:'',
		}},
		computed:{
			...mapState([
				'scatter',
			]),
		},
		methods:{
			done(){
				try {
					const hex = KeyService.phraseToBuffer(this.mnemonic);
					if (hex) return this.closer(Buffer.from(hex, 'hex'));
					PopupService.push(Popups.snackbar("The phrase you entered was not correct."));
				} catch(e){
					PopupService.push(Popups.snackbar("The phrase you entered was not correct."));
				}
			},
			...mapActions([
				UIActions.RELEASE_POPUP
			])
		},
	}
</script>

<style lang="scss">
	@import "../../styles/variables";

	.import-mnemonic {
		max-width:400px;
		width:calc(100% - 80px);
		margin:0 auto;
		position: relative;

		.sub-title {
			margin-top:-20px !important;
			font-size: $font-size-standard !important;
		}

	}

	.blue-steel {
		.import-mnemonic {

		}
	}

</style>
