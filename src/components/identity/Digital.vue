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

			<figure class="id-name">Digital name <span class="unverified" v-if="!usingIdentity">(unregistered)</span></figure>
			<section class="flex">
				<Input :disabled="true" :text="identityName" v-on:changed="x => changeIdentityName(x)" />
				<Button style="flex:0 0 auto;" icon="fal fa-id-badge" primary="1" text="Manage" @click.native="manageIdentity" />
			</section>
			<br>
			<Input :focus="focusEmail" :red-label="invalidEmail" :label="!invalidEmail ? 'Email address' : 'Please enter a valid email address'" :text="identity.personal.email" v-on:changed="x => changeEmail(x)" />
			<br>
			<br>
			<figure class="line"></figure>
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
			identity:null,
			loaded:false,

			saved:true,
			focusEmail:false,
		}},
		async mounted(){
			this.identity = this.scatter.keychain.identities[0].clone();
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
			invalidEmail(){
				if(!this.identity.personal.email || !this.identity.personal.email.length) return true;
				return this.identity.personal.email && this.identity.personal.email.length && !/\S+@\S+\.\S+/.test(this.identity.personal.email);
			},
			avatar(){
				if(!this.identity) return;
				return this.avatars[this.identity.id];
			},
			usingIdentity(){
				if(!this.identity) return false;
				return this.identity.ridl.toString().indexOf('::') > -1;
			},
			identityName(){
				if(!this.identity) return '';
				return this.usingIdentity ? `${this.identity.name}@scatter` : this.identity.name;
			},
			savedSinceChanges(){
				return this.saved && !saveTimeout;
			}
		},
		methods:{
			manageIdentity(){
				this.focusEmail = false;
				this.$nextTick(() => {
					if(this.invalidEmail) {
						this.focusEmail = true;
						return PopupService.push(Popups.snackbar("Please enter a valid email before managing your identity."));
					}
					PopupService.push(Popups.manageIdentity(() => {
						this.identity = this.scatter.keychain.identities[0].clone();
					}));
				})
			},
			changeEmail(email){
				this.identity.personal.email = email;
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
					if(this.invalidEmail) return;
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
			align-items: center;

			.unverified {
				margin-left:5px;
				font-size: $font-size-tiny;
				font-weight: bold;
				color:$grey;
			}
		}


		.claim-username {
			margin-top:-10px;
			display:flex;
			justify-content: space-between;
			align-items: center;

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
