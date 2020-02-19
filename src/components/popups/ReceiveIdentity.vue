<template>
	<section class="receive">

		<section class="popup-content">
			<section>
				<figure class="title">Receive <span>money</span></figure>
				<figure class="sub-title">You can receive <b>money</b> directly to your identity by giving others your identity@domain.</figure>
			</section>

			<br>
			<br>
			<section class="flex">
				<Input disabled="1" :text="identityName" style="margin-bottom:0;" />
				<Button v-tooltip="`Copy identity name`" icon="fas fa-copy" @click.native="copy" />
			</section>
		</section>

		<section class="popup-buttons">
			<Button @click.native="() => closer(null)" text="Done" primary="1" />
		</section>

	</section>
</template>

<script>
	import Vue from 'vue';
	import "../../styles/transfers.scss";
	import {mapActions, mapState} from "vuex";
	import SingularAccounts from "../../services/utility/SingularAccounts";
	import PopupService from "../../services/utility/PopupService";
	import Popups from "../../util/Popups";
	import * as UIActions from '../../store/ui_actions';
	import QRService from "../../services/utility/QRService";

	export default {
		props:['popin', 'closer'],
		data(){return {
			copied:null,
			lastPopup:null,
			qr:null,
			qrs:{},
		}},
		computed:{
			...mapState([
				'scatter',
			]),
			identity(){
				return this.scatter.keychain.identities[0]
			},
			identityName(){
				return `${this.identity.name}@${this.identity.fioDomain ? this.identity.fioDomain : 'scatter'}`.toLowerCase();
			}
		},
		mounted(){

		},
		methods:{
			copy(){
				window.wallet.utility.copy(this.identityName);

				PopupService.push(Popups.snackbar(`Copied "${this.identityName}" clipboard.`));
			},
			...mapActions([
				UIActions.RELEASE_POPUP
			])
		},
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.receive {
		max-width:400px;
		width:calc(100% - 80px);
		margin:0 auto;
		position: relative;

		.sub-title {
			margin-top:-20px;
			font-size: $font-size-standard;
			color:$blue;
		}


	}

	.blue-steel {
		.receive {

		}
	}

</style>
