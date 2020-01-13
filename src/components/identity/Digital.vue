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

			<figure class="id-name"><b>Online Username</b> - This name is used for applications, ratings and sending/requesting money.</figure>
			<Input big="1" :text="identity.name" v-on:changed="x => identity.name = x" />

			<!--<section class="claim-username" v-if="!isValidName">-->
				<!--<figure class="description red">This username is not valid. An online username must be between 3 and 20 characters and contain only letters and numbers.</figure>-->
			<!--</section>-->
			<!--<section class="claim-username" v-else>-->
				<!--<figure class="description">The name "<b>{{identity.name}}</b>" is available. You can register this name to gain access to premium features of Scatter like social, requesting money from contacts, and applying application ratings.</figure>-->
				<!--<Button text="Register Name" primary="1" />-->
			<!--</section>-->

			<br>
			<br>
			<Input label="Email Address" :text="identity.personal.email" v-on:changed="x => identity.personal.email = x" />
			<label style="color:red;" v-if="invalidEmail">Email is invalid</label>
			<br>
			<figure class="line"></figure>
			<br>
			<br>



			<section class="avatar">
				<section class="details">
					<figure class="title">Avatar</figure>
					<figure class="description">Applications you're interacting with can choose to display this image.</figure>
					<Button v-if="avatar" @click.native="removeAvatar" primary="1" text="Remove" />
					<Button @click.native="uploadAvatar" primary="1" :text="avatar ? 'Change' : 'Choose an image'" />
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

	let saveTimeout;
	export default {
		data(){return {
			identity:null,
			loaded:false,

			// loadingRidlData:false,
			// availableIdentity:false,
		}},
		mounted(){
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
			isValidName(){
				return this.identity && Identity.nameIsValid(this.identity.name);
			},
			invalidEmail(){
				return this.identity.personal.email && this.identity.personal.email.length && !/\S+@\S+\.\S+/.test(this.identity.personal.email);
			},
			avatar(){
				if(!this.identity) return;
				return this.avatars[this.identity.id];
			},
		},
		methods:{
			save(){
				if(!this.loaded) return;
				if(!this.isValidName) return;
				if(!this.invalidEmail) return;
				IdentityService.updateIdentity(this.identity);
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
		watch:{
			// async ['identity.name'](){
			// 	this.availableIdentity = null;
			// 	if(!this.isValidName) return;
			// 	this.loadingRidlData = true;
			// 	this.availableIdentity = await RIDLService.identityNameIsAvailable(this.identity.name);
			// 	this.loadingRidlData = false;
			// },
			identity:{
				handler(){
					if(!this.loaded) return;
					clearTimeout(saveTimeout);
					saveTimeout = setTimeout(() => this.save(), 500);
				},
				deep:true,
			},
			['identity.name'](){
				this.identity.name = this.identity.name.trim();
			}
		}

	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.digital {

		.id-name {
			display:block;
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

				&.red {
					color:red;
					font-weight: bold;
				}
			}

			button {
				flex: 0 0 auto;
				margin-left:40px;
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
