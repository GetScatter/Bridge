<template>
	<section>
		<section class="digital panel-pad limiter" v-if="identity">
			<section class="panel-head">
				<figure class="icon"><i class="fad fa-id-card-alt"></i></figure>
				<figure class="title">Digital Identity</figure>
				<figure class="description">Your digital identity is your online presence.</figure>
			</section>

			<br>
			<br>
			<br>
			<Input big="1" label="Online Username" :text="identity.name" v-on:changed="x => identity.name = x" />
			<section class="claim-username">
				<figure class="description" v-if="!isValidName">This username is not valid. Your username must be between 3 and 20 characters and contain only letters and numbers.</figure>
				<!--<figure class="description">This username is available</figure>-->
				<!--<Button text="Claim Username" />-->
			</section>

			<br>
			<Input label="Email Address" :text="identity.personal.email" v-on:changed="x => identity.personal.email = x" />
			<br>
			<br>
			<figure class="line"></figure>
			<br>
			<br>
			<br>



			<section class="avatar">
				<section class="details">
					<figure class="title">Avatar</figure>
					<figure class="description">Applications you're interacting with can choose to display this image.</figure>
					<Button text="Choose File" />
				</section>
				<figure class="image"><i class="fas fa-camera-retro"></i></figure>
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

	import {mapState} from "vuex";
	import Identity from "@walletpack/core/models/Identity";
	import IdentityService from "@walletpack/core/services/utility/IdentityService";

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
			isValidName(){
				return this.identity && Identity.nameIsValid(this.identity.name);
			},
		},
		methods:{
			save(){
				if(!this.loaded) return;
				if(!this.isValidName) return;
				IdentityService.updateIdentity(this.identity);
			},
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
		}

	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.digital {


		.claim-username {
			margin-top:-10px;
			display:flex;
			justify-content: space-between;
			align-items: center;

			.description {
				font-size: $font-size-standard;
				opacity:0.44;
			}

			button {
				margin:0;
			}
		}

		.avatar {
			display:grid;
			grid-template-columns:auto 150px;

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
