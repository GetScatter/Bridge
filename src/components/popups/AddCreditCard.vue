<template>
	<section class="add-credit-card">
		<section class="popup-head">
			<!--<GraphicCard class="card" />-->
			<!--<figure class="title">Add a card</figure>-->


			<figure class="progress-line">
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
			</figure>
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
			<Button v-if="state === STATES.CARD" text="Go to billing" @click.native="state = STATES.BILLING" />
			<Button v-if="state === STATES.BILLING" text="Save Card Information" />
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

	.popup-content {
		margin-top:30px;
	}

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

		.title {
			font-size: 24px;
			font-weight: bold;
			margin-top:20px;
		}

		.progress-line {
			margin-top:-19px;
			display:flex;
			justify-content: space-evenly;
			position:absolute;
			left:0;
			right:0;
			bottom:-19px;

			.bubble-container {
				position: relative;
				z-index:1;
				text-align:center;
				display:flex;
				flex-direction: column;
				align-items: center;

				.bubble {
					height:36px;
					width:36px;
					border-radius:50%;
					display:flex;
					justify-content: center;
					align-items: center;
					background:$light;
					font-size: 16px;
					font-weight: bold;
					color:$grey;
					padding-top:2px;

					border:1px solid $lightgrey;

					&.clickable {
						cursor:pointer;
					}

					.text {
						position: absolute;
						bottom:-18px;
						font-size: 11px;
						font-weight: bold;
						margin-top:7px;
						opacity:0.3;
						color:$black;
					}
				}

				&.active {
					.bubble {
						border:1px solid $darkblue;
						background:$blue;
						color:#fff;

						.text {
							opacity:1;
						}
					}
				}
			}
		}
	}

	.blue-steel {
		.add-credit-card {
			.progress-line {

				.bubble-container {

					.bubble {
						background:$dark;
						color:$grey;
						border:1px solid $borderdark;

						.text {
							color:$grey;
						}
					}

					&.active {
						.bubble {
							background:$blue;
							color:#fff;
							border:1px solid $blue;

							.text {
								color:#fff;
							}
						}
					}
				}
			}
		}
	}

</style>