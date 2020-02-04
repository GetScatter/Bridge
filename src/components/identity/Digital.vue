<template>
	<section>
		<section class="digital panel-pad limiter" v-if="identity">
			<section class="panel-head">
				<figure class="title">Digital Identity</figure>
				<figure class="description">Your digital identity defines your online presence. It is primarily used for third party applications.</figure>
			</section>

			<br>
			<br>
			<br>
			<br>

			<figure class="unsaved-changes" v-if="!savedSinceChanges">You have unsaved changes.</figure>

			<figure class="id-name">
				<div style="flex:1;"><b>Online Username</b> - This name is used for applications, ratings and sending/requesting money.</div>
				<div v-if="!usingIdentity"><b>({{name.length}}/20)</b></div>
			</figure>
			<Input big="1" :disabled="usingIdentity" :text="identityName" v-on:changed="x => changeIdentityName(x)" />

			<section v-if="usingIdentity">
				<section class="claim-username">
					<figure style="flex:1;" class="description red"></figure>
					<Button @click.native="changeIdentityKey" v-tooltip="`Change key`" icon="fal fa-random" />
					<Button v-tooltip="`Unlink identity`" @click.native="unlinkIdentity" icon="fas fa-unlink" />
					<Button @click.native="copyPublicKey" v-tooltip="`Copy public key`" icon="fal fa-copy" />
					<Button @click.native="exportIdentityKey" primary="1" v-tooltip="`Export private key`" icon="fal fa-key" />
				</section>
			</section>

			<section v-else>
				<section v-if="!loadingRidlData">
					<section class="claim-username" v-if="!isValidName">
						<figure class="description red"><b>This username is not valid.</b> An online username must be between 3 and 56 characters and contain only letters, numbers, and dash (but not as the first or last character).</figure>
					</section>
					<section class="claim-username" v-else-if="identityAvailable">
						<figure class="description" v-if="!ownsIdentity"><b>This username is available.</b> You can register this name to gain access to premium features of Scatter like requesting money from contacts and applying ratings.</figure>
						<figure class="description" v-if="ownsIdentity"><b>You already own this identity.</b></figure>
						<Button v-if="ownsIdentity" text="Link" @click.native="registerIdentity" icon="fas fa-link" primary="1" />
						<Button v-if="!ownsIdentity" text="Register Identity" @click.native="registerIdentity" icon="fas fa-check" primary="1" />
					</section>
					<section class="claim-username" v-else>
						<figure class="description red"><b>This username is not available.</b></figure>
					</section>
				</section>

				<section v-else>
					<i class="fa fa-spinner animate-spin"></i>
				</section>
			</section>



			<section v-if="!usingIdentity">
				<br>
				<br>
				<br>
				<br>
				<Input :text="publicKey" label="Your identity's key is used to prove authenticity." disabled="1" />
				<section class="claim-username">
					<figure class="description grey"><b>Always make sure you have a copy of your keys. If you lose them, you will lose access to your identity!</b></figure>
					<Button text="Change" @click.native="changeIdentityKey" icon="fal fa-random" />
					<Button @click.native="exportIdentityKey" text="Export" primary="1" icon="fal fa-key" />
				</section>
			</section>
			<br>
			<br>
			<figure class="line"></figure>
			<br>
			<br>
			<Input :red-label="invalidEmail" :label="!invalidEmail ? 'Email Address' : 'Email is invalid!'" :text="identity.personal.email" v-on:changed="x => changeEmail(x)" />
			<br>
			<br>



			<section class="avatar">
				<section class="details">
					<figure class="title">Avatar</figure>
					<figure class="description">Applications you're interacting with can choose to display this image.</figure>
					<Button v-if="avatar" @click.native="removeAvatar" primary="1" text="Remove" />
					<Button icon="fas fa-camera-retro" @click.native="uploadAvatar" primary="1" :text="avatar ? 'Change' : 'Choose an image'" />
				</section>
				<figure class="image" :style="`background-image:url('${avatar}')`">
					<i v-if="!avatar" class="fas fa-camera-retro"></i>
				</figure>
			</section>

			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
		</section>
	</section>
</template>

<script>

	import {mapActions, mapGetters, mapState} from "vuex";
	import Identity from "@walletpack/core/models/Identity";
	import IdentityService from "@walletpack/core/services/utility/IdentityService";
	import PopupService from "../../services/utility/PopupService";
	import Popups from "../../util/Popups";
	import * as Actions from '@walletpack/core/store/constants';
	import RidlService from "../../services/utility/RidlService";
	import PluginRepository from '@walletpack/core/plugins/PluginRepository';
	import {Blockchains} from '@walletpack/core/models/Blockchains'
	import Keypair from '@walletpack/core/models/Keypair'

	let saveTimeout = null, nameTimeout;
	export default {
		data(){return {
			name:'',
			identity:null,
			loaded:false,

			loadingRidlData:false,
			ridlIdentity:null,
			saved:true,
		}},
		async mounted(){
			this.identity = this.scatter.keychain.identities[0].clone();
			this.name = this.identity.name;
			this.loadingRidlData = true;
			await this.checkAvailability();
			setTimeout(() => {
				this.loaded = true;
			}, 1000);
		},
		computed:{
			...mapState([
				'scatter'
			]),
			...mapGetters([
				'avatars',
			]),
			isValidName(){
				return this.identity && RidlService.validName(this.name);
			},
			invalidEmail(){
				if(this.identity.personal.email && !this.identity.personal.email.length) return false;
				return this.identity.personal.email && this.identity.personal.email.length && !/\S+@\S+\.\S+/.test(this.identity.personal.email);
			},
			avatar(){
				if(!this.identity) return;
				return this.avatars[this.identity.id];
			},
			publicKey(){
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
				return this.identity.ridl.toString().indexOf('::') > -1;
			},
			identityName(){
				return this.usingIdentity ? `${this.name}@scatter` : this.name;
			},
			savedSinceChanges(){
				return this.saved && !saveTimeout;
			}
		},
		methods:{
			changeEmail(email){
				this.identity.personal.email = email;
				this.save();
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
				this.name = name.replace(/ /gi, "").toLowerCase();
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
				this.ridlIdentity = await RidlService.findIdentity(this.name);
				this.loadingRidlData = false;
				this.save();
			},
			async registerIdentity(){
				if(this.ownsIdentity){
					this.identity.ridl = `${this.ridlIdentity.chain}::${this.ridlIdentity.id}`;
				} else {
					const registered = await RidlService.payForIdentity(this.identity);
					if(!registered) return;
					this.identity.ridl = `${registered.chain}::${registered.id}`;
				}
				this.save();
			},
			save(){
				const name = this.name;
				this.saved = false;
				clearTimeout(saveTimeout);
				saveTimeout = setTimeout(() => {
					if(!this.loaded) {
						clearTimeout(saveTimeout);
						saveTimeout = null;
						this.saved = true;
						return;
					}
					if(!this.isValidName) return;
					if(this.invalidEmail) return;
					if(this.loadingRidlData) return;
					if(!this.identityAvailable) return;
					this.identity.name = name;
					IdentityService.updateIdentity(this.identity);
					this.saved = true;
					clearTimeout(saveTimeout);
					saveTimeout = null;
				}, 500);
			},
			removeAvatar(){
				const scatter = this.scatter.clone();
				delete scatter.keychain.avatars[this.identity.id];
				this[Actions.SET_SCATTER](scatter);
			},
			async uploadAvatar(){
				let filepath = await window.wallet.storage.getFileLocation(['jpg', 'png', 'jpeg']);
				if(!filepath || !filepath.length) return;
				filepath = filepath[0];
				let ext = filepath.split('.');
				ext = ext[ext.length-1];
				const base64 = await window.wallet.storage.openFile(filepath, { encoding: 'base64' });
				if(!base64) return PopupService.push(Popup.snackbar("Error converting image file."));
				// Resizing to 350x350 MAX (ratio preserved)
				// -------------------------------------------
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");
				const image = new Image();
				image.onload = e => {
					const calculateAspectRatioFit = () => {
						const ratio = Math.min(350 / image.width, 350 / image.height);
						return { width: Math.round(image.width*ratio), height: Math.round(image.height*ratio) };
					}
					canvas.height = calculateAspectRatioFit().height;
					canvas.width = calculateAspectRatioFit().width;
					ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, calculateAspectRatioFit().width, calculateAspectRatioFit().height);
					const resized = new Image();
					resized.src = canvas.toDataURL(`image/${ext}`);
					const scatter = this.scatter.clone();
					scatter.keychain.avatars[this.identity.id] = resized.src;
					this[Actions.SET_SCATTER](scatter);
				};
				image.src = `data:image/${ext};base64, ${base64}`;
				// -------------------------------------------

			},
			...mapActions([
				Actions.SET_SCATTER
			])
		},

	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.digital {

		.unsaved-changes {
			position:fixed;
			bottom:100px;
			left:10px;
			z-index:2;
			background:$blue;
			color:white;
			border-radius:4px;
			font-size: $font-size-tiny;
			padding:5px 10px;
		}

		.id-name {
			display:flex;
			width:100%;
			font-size: $font-size-standard;
			font-family: 'Poppins', sans-serif;
			margin-bottom:7px;
		}


		.claim-username {
			margin-top:-10px;
			display:flex;
			justify-content: space-between;
			align-items: center;

			.description {
				font-size: $font-size-standard;
				color:$blue;
				margin-right:15px;

				&.red {
					color:red;
				}

				&.grey {
					color:$grey;
				}
			}

			button {
				flex: 0 0 auto;
				margin-left:5px;
			}
		}

		.avatar {
			display:grid;
			grid-template-columns:auto 150px;

			button {
				display:inline-block;

				&:not(:first-child){
					margin-right:5px;
				}
			}

			.image {
				flex:0 0 auto;
				width:150px;
				height:100px;
				border-radius:4px;
				display:flex;
				justify-content: center;
				align-items: center;
				font-size: 24px;
				background-color:$blue;
				color:#fff;
			}

			.details {
				text-align:left;

				.title {
					font-size: 16px;
					font-weight: bold;
				}

				.description {
					margin-top:5px;
					font-size: 11px;
					color:$grey;
				}

				button {
					margin-top:10px;
				}
			}
		}
	}

</style>
