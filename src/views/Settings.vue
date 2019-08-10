<template>
	<section class="settings">

		<section class="switcher">
			<figure class="type" @click="state = STATES.GENERAL" :class="{'active':state === STATES.GENERAL}">General</figure>
			<figure class="type" @click="state = STATES.SECURITY" :class="{'active':state === STATES.SECURITY}">Security</figure>
		</section>

		<br>

		<section class="panel-pad limiter settings-panel" v-if="state === STATES.GENERAL">
			<section class="title">General Settings</section>
			<figure class="text">
				These are some general settings for Scatter
			</figure>

			<br>
			<br>
			<br>

			<section class="setting">
				<label>Select your theme</label>
				<select @change="changeTheme">
					<option :selected="theme === THEMES.FLUORESCENT">{{THEMES.FLUORESCENT}}</option>
					<option :selected="theme === THEMES.BLUE_STEEL">{{THEMES.BLUE_STEEL}}</option>
				</select>
			</section>
		</section>







		<section class="panel-pad limiter settings-panel" v-if="state === STATES.SECURITY">
			<section class="title">Security Settings</section>
			<figure class="text">
				These settings allow you to enhance your Scatter's security, and get backups of your data.
			</figure>

			<br>
			<br>
			<br>

			<!-- TWO FACTOR AUTH -->
			<section class="setting">
				<section class="flex">
					<section>
						<label>Two Factor Authentication</label>
						<figure class="text">
							Two factor authentication allows you to enable an extra step to logging into your account.
						</figure>
					</section>
					<Switcher :state="twoFactor" v-on:switched="toggleTwoFactor" />
				</section>
			</section>

			<!-- CHANGE PASSWORD -->
			<section class="setting">
				<section class="flex">
					<section>
						<label>Change your password</label>
						<figure class="text">
							Changing your password periodically is healthy. Just make sure you don't get locked out.
						</figure>
					</section>
					<Button text="Change" />
				</section>
			</section>

			<!-- EXPORT SEED -->
			<section class="setting">
				<section class="flex">
					<section>
						<label>Export your backup seed</label>
						<figure class="text">
							This seed has the ability to regenerate all of the private keys which control your accounts.
						</figure>
					</section>
					<Button text="export" />
				</section>
			</section>

			<!-- EXPORT PRIVATE KEYS -->
			<section class="setting">
				<label>Export individual private keys</label>
				<figure class="text">
					Some other wallets don't support seeds, you can export each private key here individually and import them manually into those wallets.
				</figure>

				<br>

				<section class="buttons-list">
					<Button v-for="kv in BlockchainsArray" :text="blockchainName(kv.value)" />
				</section>
			</section>


		</section>


	</section>
</template>

<script>
	import {mapActions, mapState} from "vuex";
	import Loader from "../util/Loader";
	import * as UIActions from "../store/ui_actions";
	import Switcher from "../components/reusable/Switcher";
	import PopupService from "../services/utility/PopupService";
	import Popups from "../util/Popups";
	import {blockchainName, BlockchainsArray} from "@walletpack/core/models/Blockchains";

	const STATES = {
		GENERAL:0,
		SECURITY:1,
	};

	export default {
		components:{
			Switcher
		},
		data(){return {
			STATES,
			state:STATES.GENERAL,
			BlockchainsArray,

			twoFactor:false,
		}},
		mounted(){

		},
		computed:{
			...mapState([
				'scatter',
				'swiped',
				'theme'
			]),
		},
		methods:{
			changeTheme(event){
				this[UIActions.SET_THEME](event.target.value);
			},
			toggleTwoFactor(){
				this.twoFactor = !this.twoFactor;
				if(this.twoFactor){
					PopupService.push(Popups.twoFactorAuth(success => {
						if(!success) this.twoFactor = false;
					}, true))
				}
			},
			blockchainName,


			...mapActions([
				UIActions.SET_THEME
			])
		}


	}
</script>

<style scoped lang="scss">
	@import "../styles/variables";

	.switcher {
		margin-top:10px;
	}

	.settings {

		.settings-panel {
			.title {
				font-size: $font-size-large;
				font-weight: bold;
			}

			.text {
				margin-top:5px;
				font-size: $font-size-standard;
				color:$grey;
			}
		}

		.setting {
			margin-top:20px;
			padding-bottom:20px;

			&:not(:last-child){
				border-bottom:1px solid $borderlight;
			}

			.flex {
				align-items: center;

				button {
					padding-left:20px;
				}

				button, .switch {
					flex:0 0 auto;
					margin-left:20px;
				}
			}

			label {
				font-size: $font-size-small;
				font-weight: bold;
				color:$grey;
				display:block;
				margin-bottom:10px;
			}

			.text {
				margin-top:0;
				font-size: $font-size-small;
				color: inherit;
			}

			.buttons-list {
				button {
					display:inline-block;
					margin-right:5px;
				}
			}


		}
	}



</style>

