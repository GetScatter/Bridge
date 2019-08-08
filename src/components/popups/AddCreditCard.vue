<template>
	<section class="add-credit-card">
		<section class="popup-head">
			<!--<GraphicCard class="card" />-->
			<!--<figure class="title">Add a card</figure>-->
			<section class="bubble-container" @click="state = STATES.CARD" :class="{'active':state === STATES.CARD}">
				<span class="head-title"><i class="fad fa-credit-card"></i> Card details</span>
				<span class="head-step">1 <i>/</i> 2</span>
			</section>
			<section class="bubble-container" :class="{'active':state === STATES.BILLING}">
				<span class="head-title"><i class="fad fa-credit-card"></i> Billing details</span>
				<span class="head-step">2 <i>/</i> 2</span>
			</section>
		</section>

		<section class="popup-content">
			<section v-if="state === STATES.CARD">
				<Input label="Card holder name" :text="card.secure.personalInformation.name" v-on:changed="x => card.secure.personalInformation.name = x" />
				<section class="flex">
					<Input type="number" style="flex:1;" label="Credit card number" :text="card.secure.number" v-on:changed="x => card.secure.number = x" />
					<Input style="flex:0.5;" label="Expiration" :text="card.secure.expiration" v-on:changed="x => card.secure.expiration = x" />
				</section>
			</section>

			<section v-if="state === STATES.BILLING">
				<Input label="Email" :text="card.secure.personalInformation.email" v-on:changed="x => card.secure.personalInformation.email = x" />
				<Input placeholder="Select a date" label="Date of Birth" type="date" :text="card.secure.personalInformation.birthdate" v-on:changed="x => card.secure.personalInformation.birthdate = x" />

				<figure class="line"></figure>
				<br>

				<Input label="Address" :text="card.secure.personalInformation.address" v-on:changed="x => card.secure.personalInformation.address = x" />
				<section class="flex">
					<Input label="City" :text="card.secure.personalInformation.city" v-on:changed="x => card.secure.personalInformation.city = x" />
					<Input label="State" :text="card.secure.personalInformation.state" v-on:changed="x => card.secure.personalInformation.state = x" />
				</section>
				<section class="flex">
					<Input label="Country" :text="card.name" v-on:changed="x => card.name = x" />
					<Input label="Postal Code" :text="card.secure.personalInformation.zipcode" v-on:changed="x => card.secure.personalInformation.zipcode = x" />
				</section>
			</section>
		</section>

		<section class="popup-buttons">
			<!-- LEFT -->
			<Button @click.native="() => closer(null)" v-if="state === STATES.CARD" secondary="1" text="Cancel" />
			<Button @click.native="state = STATES.CARD" v-if="state === STATES.BILLING" secondary="1" text="Back" />

			<!-- RIGHT -->
			<Button @click.native="goToBilling" v-if="state === STATES.CARD" text="Go to billing" primary="1" />
			<Button :loading="saving" @click.native="saveCard" v-if="state === STATES.BILLING" primary="1" text="Save Card Information" />
		</section>
	</section>
</template>

<script>
	import CreditCard from "@walletpack/core/models/CreditCard";
	import GraphicCard from "../graphics/GraphicCard";
	import {mapActions, mapState} from "vuex";
	import * as Actions from "@walletpack/core/store/constants";
	import IdentityService from "@walletpack/core/services/utility/IdentityService";
	import PopupService from "../../services/utility/PopupService";
	import Popups from "../../util/Popups";
	import CreditCardService from "../../services/credit/CreditCardService";

	const STATES = {
		CARD:0,
		BILLING:1,
	};

	export default {
		props:['closer'],
		components: {GraphicCard},
		data(){return {
			STATES,
			state:STATES.CARD,
			card:CreditCard.placeholder(),

			saving:false,
		}},
		computed:{
			...mapState([
				'scatter'
			]),
			identity(){
				return this.scatter.keychain.identities[0];
			},
			location(){
				return this.scatter.keychain.locations[0];
			}
		},
		mounted(){
			this.card.secure.personalInformation.name = `${this.identity.personal.firstname} ${this.identity.personal.lastname}`.trim();
			this.card.secure.personalInformation.email = this.identity.personal.email;
			this.card.secure.personalInformation.birthdate = this.identity.personal.birthdate;
			this.card.secure.personalInformation.address = this.location.address;
			this.card.secure.personalInformation.city = this.location.city;
			this.card.secure.personalInformation.state = this.location.state;
			this.card.secure.personalInformation.country = this.location.country;
			this.card.secure.personalInformation.zipcode = this.location.zipcode;
			this.$forceUpdate();
		},
		methods:{
			formatExpiration(){
				this.$nextTick(() => {
					if(this.card.secure.expiration.indexOf('/') === -1 && this.card.secure.expiration.length >= 2)
						this.card.secure.expiration = this.card.secure.expiration.slice(0, 2) + "/" + this.card.secure.expiration.slice(2);

					if(this.card.secure.expiration.length > 5) this.card.secure.expiration = this.card.secure.expiration.slice(0,5);
				})
			},
			formatCard(){
				this.$nextTick(() => {
					this.card.secure.number = this.card.secure.number.replace(/\D/g, '');
				});
			},

			trimPersonalInfo(){
				Object.keys(this.card.secure.personalInformation).map(x => this.card.secure.personalInformation[x] = this.card.secure.personalInformation[x].trim());
			},

			goToBilling(){
				this.trimPersonalInfo();
				if(!this.card.secure.personalInformation.name.length) return PopupService.push(Popups.snackbar("You must enter your full name"));
				if(!this.card.secure.number.length) return PopupService.push(Popups.snackbar("You must enter your credit card number"));
				if(this.card.secure.expiration.length !== 5) return PopupService.push(Popups.snackbar("You must enter your credit card expiration date"));
				this.state = STATES.BILLING;
			},

			async saveCard(){
				this.trimPersonalInfo();
				this.saving = true;
				await CreditCardService.saveCard(this.card.clone());
				this.saving = false;
				this.closer(true);
			},

			...mapActions([
				Actions.SET_SCATTER
			])
		},
		watch:{
			['card.secure.expiration'](){
				this.formatExpiration()
			},
			['card.secure.number'](){
				this.formatCard()
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.add-credit-card {
		max-width:400px;
		width:100%;
		text-align:center;

		button {
			margin-top:10px;
			display:inline-block;
		}

		.card {
			transform:scale(0.5);
			margin:-10px auto -50px;
			display:inline-block;
			float:none;
		}

		.head-title {
			font-size: $font-size-big;
			font-weight: bold;
			font-family: 'Poppins', sans-serif;
			float:left;

			i {
				color:$blue;
				font-size:$font-size-large;
				margin-right:4px;
			}
		}

		.head-step {
			color:$grey;
			float:right;
			font-family: 'Poppins', sans-serif;
			font-weight:bold;

			i {
				color:$blue;
				padding:0 8px;
			}
		}

		.bubble-container {
			width:100%;
			display:none;

			&.active {
				display:block;
			}
		}
	}

	.blue-steel {
		.add-credit-card {
			.head-step {
				color:white;
			}
		}
	}

</style>