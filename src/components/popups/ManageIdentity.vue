<template>
	<section class="manage-identity">

		<section class="popup-content">

			<section v-if="!usingIdentity">
				<figure class="title">Setup your <span>identity</span></figure>
				<figure class="sub-title">Your identity is your online persona. You can choose to be who you are, or who you wish to be. Once you register yourself on the identity network you'll gain access to special features like applying reputations to things.</figure>

				<br>
				<br>
				<figure class="line"></figure>
				<br>
				<br>
			</section>

			<figure class="id-name" v-if="!usingIdentity">
				<div style="flex:1;">Your online username</div>
				<div><b>({{name.length}}/56)</b></div>
			</figure>

			<figure class="id-name" v-if="usingIdentity">
				<div style="flex:1;">You are currently known as</div>
			</figure>
			<Input big="1" :disabled="usingIdentity" :text="identityName" v-on:changed="x => changeIdentityName(x)" />

			<section v-if="usingIdentity">
				<section class="claim-username">
					<figure style="flex:1;" class="description">
						You can manage your identity using the buttons on the right.
					</figure>
					<Button @click.native="changeIdentityKey" v-tooltip="`Change key`" icon="fal fa-random" />
					<Button v-tooltip="`Unlink identity`" @click.native="unlinkIdentity" icon="fas fa-unlink" />
					<Button @click.native="copyPublicKey" v-tooltip="`Copy public key`" icon="fal fa-copy" />
					<Button @click.native="exportIdentityKey" primary="1" v-tooltip="`Export private key`" icon="fal fa-key" />
				</section>
			</section>

			<section v-else-if="ridlIsAvailable && !usingIdentity">
				<section v-if="!loadingRidlData">
					<section class="claim-username" v-if="!isValidName">
						<figure class="description red"><b>This name is not valid.</b> Your name must be between 3 and 56 characters and contain only letters, numbers, and dash (but not as the first or last character).</figure>
					</section>
					<section class="claim-username" v-else-if="identityAvailable">
						<figure class="description" v-if="!ownsIdentity"><b>Congratulations!</b> This name is available for registration. Just click the button on the right and off you go.</figure>
						<figure class="description" v-if="ownsIdentity"><b>You already own this name.</b> Just click the button on the right to immediately link this name to your digital identity.</figure>
						<Button :loading="working" v-if="ownsIdentity" text="Link" @click.native="registerIdentity" icon="fas fa-link" primary="1" />
						<Button :loading="working" v-if="!ownsIdentity" text="Register Identity" @click.native="registerIdentity" icon="fas fa-check" primary="1" />
					</section>
					<section class="claim-username" v-else>
						<figure class="description red"><b>This username is not available.</b></figure>
					</section>
				</section>

				<section v-else>
					<section class="claim-username">
						<figure class="description"></figure>
						<Button :loading="true" />
					</section>
				</section>
			</section>

			<section v-if="ridlIsAvailable === false">
				<section class="claim-username">
					<figure v-if="!loadingRidlData" class="description grey">Identity network is down, please try again later.</figure>
					<figure v-if="loadingRidlData" class="description"></figure>
					<Button @click.native="checkRidlNetwork" :loading="loadingRidlData" icon="fas fa-sync-alt" />
				</section>
			</section>



			<section v-if="!usingIdentity">
				<br>
				<br>
				<br>
				<br>
				<Input :text="publicKey" label="Your identity's shareable security key" disabled="1" />
				<section class="claim-username">
					<figure class="description red small">Always make sure you have a copy of your <u>private</u> keys. If you lose them, you will lose access to your identity! Click the <u>export key</u> button on the right to save your private key.</figure>
					<Button v-tooltip="`Change key`" @click.native="changeIdentityKey" icon="fal fa-random" />
					<Button @click.native="exportIdentityKey" v-tooltip="`Export key`" primary="1" icon="fal fa-key" />
				</section>
			</section>

		</section>

		<section class="popup-buttons">
			<Button @click.native="closer(null)" text="Close" />
		</section>

	</section>
</template>

<script>

	import {mapState} from "vuex";
	import PopupService from "../../services/utility/PopupService";
	import Popups from "../../util/Popups";
	import RidlService from "../../services/utility/RidlService";
	import IdentityService from "@walletpack/core/services/utility/IdentityService";

	let saveTimeout, nameTimeout;
	export default {
		props:['popin', 'closer'],
		data(){return {
			identity:null,
			loadingRidlData:false,
			ridlIdentity:null,
			ridlIsAvailable:false,
			name:'',
			saved:true,
			working:false,
		}},
		computed:{
			...mapState([
				'scatter',
			]),
			isValidName(){
				return this.identity && RidlService.validName(this.name);
			},
			publicKey(){
				if(!this.identity) return '';
				return this.identity.publicKey.replace('EOS', 'ID_KEY_');
			},
			identityAvailable(){
				if(!this.ridlIdentity) return true;
				return this.ownsIdentity;
			},
			ownsIdentity(){
				return this.ridlIdentity && this.ridlIdentity.key === this.identity.publicKey;
			},
			usingIdentity(){
				if(!this.identity) return false;
				return this.identity.ridl.toString().indexOf('::') > -1;
			},
			identityName(){
				if(!this.identity) return '';
				return this.usingIdentity ? `${this.name}@scatter` : this.name;
			},

		},
		async mounted(){
			this.identity = this.scatter.keychain.identities[0].clone();
			this.name = this.identity.name;
			this.loadingRidlData = true;
			this.checkRidlNetwork();
			await this.checkAvailability();
		},
		methods:{

			async checkRidlNetwork(){
				console.log('this.featureFlags.ridl', this.featureFlags.ridl);
				this.loadingRidlData = true;
				if(!this.featureFlags.ridl) {
					setTimeout(() => {
						this.ridlIsAvailable = false;
						this.loadingRidlData = false;
					}, 50);
					return;
				}
				this.ridlIsAvailable = await RidlService.isAvailable();
				this.loadingRidlData = false;
			},
			copyPublicKey(){
				window.wallet.utility.copy(this.publicKey);
				PopupService.push(Popups.snackbar(`Your identity's public key was copied to your clipboard.`))
			},
			async exportIdentityKey(){
				const unlocked = await new Promise(r => {
					PopupService.push(Popups.getPassword(async password => {
						if(!password) return r(false);
						if(window.wallet) r(await window.wallet.verifyPassword(password).catch(() => false));
					}));
				});

				if(unlocked) PopupService.push(Popups.exportPrivateKey(Keypair.fromJson({
					id:this.identity.id,
					blockchains:[Blockchains.EOSIO]
				})))
			},
			changeIdentityKey(){
				PopupService.push(Popups.changeIdentityKey(async changed => {
					if(changed) {
						if(this.usingIdentity){
							const [chain, id] = this.identity.ridl.split('::');
							const keyChanged = await RidlService.changeKey(id, changed.publicKey, chain, this.identity.publicKey);
							if(!keyChanged) return;
							PopupService.push(Popups.transactionSuccess(Blockchains.EOSIO, keyChanged.txid));
						}


						this.identity.privateKey = changed.privateKey;
						this.identity.publicKey = changed.publicKey;
						await IdentityService.updateIdentity(this.identity);
						this.identity = this.scatter.keychain.identities[0].clone();


						if(!this.usingIdentity) PopupService.push(Popups.snackbar(`Your identity's key was changed successfully.`));
					}
				}));
			},
			changeIdentityName(name){
				if(this.usingIdentity) return;
				this.name = name.replace(/ /gi, "");
				if(!this.isValidName) return false;
				this.loadingRidlData = true;
				clearTimeout(nameTimeout);
				nameTimeout = setTimeout(async () => {
					await this.checkAvailability();
					this.save();
				}, 500);
			},
			unlinkIdentity(){
				this.identity.ridl = '';
				this.checkAvailability();
			},
			async checkAvailability(){
				if(!this.ridlIsAvailable) return false;
				this.ridlIdentity = await RidlService.findIdentity(this.name);
				this.loadingRidlData = false;
				this.save();
			},
			async registerIdentity(){
				this.working = true;
				if(this.ownsIdentity){
					this.identity.ridl = `${this.ridlIdentity.chain}::${this.ridlIdentity.id}`;
				} else {
					const registered = await RidlService.payForIdentity(this.identity);
					if(!registered) return this.working = false;
					this.identity.ridl = `${registered.chain}::${registered.id}`;
				}
				this.working = false;
				this.save();
			},
			save(){
				const name = this.name;
				this.saved = false;
				clearTimeout(saveTimeout);
				saveTimeout = setTimeout(() => {
					if(!this.isValidName) return;
					if(this.loadingRidlData) return;
					if(!this.identityAvailable) return;
					this.identity.name = name;
					IdentityService.updateIdentity(this.identity);
					this.saved = true;
					clearTimeout(saveTimeout);
					saveTimeout = null;
				}, 500);
			},
		},
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.manage-identity {
		max-width:600px;

		width:calc(100% - 80px);
		margin:0 auto;

		.sub-title {
			margin-top:-20px;
			font-size: $font-size-small;
		}

		.id-name {
			display:flex;
			width:100%;
			font-size: $font-size-standard;
			font-family: 'Poppins', sans-serif;
			margin-bottom:7px;
			text-align:left;
		}


		.claim-username {
			margin-top:-10px;
			display:flex;
			justify-content: space-between;
			align-items: center;
			text-align:left;

			.description {
				flex:1;
				font-size: $font-size-small;
				color:$blue;
				margin-right:25px;

				&.red {
					color:red;
				}

				&.grey {
					color:$grey;
				}

				&.small {
					font-size: $font-size-tiny;
				}
			}

			button {
				flex: 0 0 auto;
				margin-left:5px;
			}
		}
	}


</style>
