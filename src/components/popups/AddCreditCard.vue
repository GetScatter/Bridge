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

			<!-- <figure class="progress-line">
				<section class="bubble-container" @click="state = STATES.CARD" :class="{'active':state === STATES.CARD}">
					<figure class="bubble" :class="{'clickable':state !== STATES.CARD}">
						1
						<figure class="text">Card</figure>
					</figure>
				</section>
				<section class="bubble-container" :class="{'active':state === STATES.BILLING}">
					<figure class="bubble">
						2
						<figure class="text">Billing</figure>
					</figure>
				</section>
			</figure> -->
		</section>

		<section>

		</section>

		<section class="popup-content">
			<section v-if="state === STATES.CARD">
				<Input label="Card holder name" :text="card.name" v-on:changed="x => card.name = x" />
				<section class="flex">
					<Input style="flex:1;" label="Credit card number" :text="card.secure.number" v-on:changed="x => card.secure.number = x" />
					<Input style="flex:0.5;" label="Expiration" :text="card.expiration" v-on:changed="x => card.expiration = x" />
				</section>
			</section>

			<section v-if="state === STATES.BILLING">
				<Input label="Email" :text="card.name" v-on:changed="x => card.name = x" />
				<Input placeholder="Select a date" label="Date of Birth" type="date" :text="card.name" v-on:changed="x => card.name = x" />

				<figure class="line"></figure>
				<br>

				<Input label="Address" :text="card.name" v-on:changed="x => card.name = x" />
				<section class="flex">
					<Input label="City" :text="card.name" v-on:changed="x => card.name = x" />
					<Input label="State" :text="card.name" v-on:changed="x => card.name = x" />
				</section>
				<section class="flex">
					<Input label="Country" :text="card.name" v-on:changed="x => card.name = x" />
					<Input label="Postal Code" :text="card.name" v-on:changed="x => card.name = x" />
				</section>
			</section>
		</section>

		<section class="popup-buttons">
			<!-- LEFT -->
			<Button v-if="state === STATES.CARD" secondary="1" text="Cancel" />
			<Button @click.native="state = STATES.CARD" v-if="state === STATES.BILLING" secondary="1" text="Back" />

			<!-- RIGHT -->
			<Button v-if="state === STATES.CARD" text="Go to billing" @click.native="state = STATES.BILLING" primary="1" />
			<Button v-if="state === STATES.BILLING" primary="1" text="Save Card Information" />
		</section>
	</section>
</template>

<script>
	import CreditCard from "@walletpack/core/models/CreditCard";
	import GraphicCard from "../graphics/GraphicCard";

	const STATES = {
		CARD:0,
		BILLING:1,
	};

	export default {
		components: {GraphicCard},
		data(){return {
			STATES,
			state:STATES.CARD,
			card:CreditCard.placeholder()
		}},
		methods:{
			formatExpiration(){
				this.$nextTick(() => {
					if(this.card.expiration.indexOf('/') === -1 && this.card.expiration.length >= 2)
						this.card.expiration = this.card.expiration.slice(0, 2) + "/" + this.card.expiration.slice(2)
				})
			},
			formatCard(){
				this.$nextTick(() => {
					this.card.secure.number = this.card.secure.number.replace(/\D/g, '');
				});
			}
		},
		watch:{
			['card.expiration'](){
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

			svg {
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