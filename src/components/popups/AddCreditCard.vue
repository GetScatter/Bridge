<template>
	<section class="add-credit-card">
		<figure class="card"></figure>
		<figure class="title">Add a card</figure>
		<figure class="progress-line">
			<section class="bubble-container" @click="state = STATES.CARD" :class="{'active':state === STATES.CARD}">
				<figure class="bubble">1</figure>
				<figure class="text">Card</figure>
			</section>
			<section class="bubble-container" :class="{'active':state === STATES.BILLING}">
				<figure class="bubble">2</figure>
				<figure class="text">Billing</figure>
			</section>
		</figure>

		<section v-if="state === STATES.CARD">
			<section class="inputs">
				<Input label="Card holder name" :text="card.name" v-on:changed="x => card.name = x" />
				<section class="flex">
					<Input style="flex:1;" label="Credit card number" :text="card.secure.number" v-on:changed="x => card.secure.number = x" />
					<Input style="flex:0.5;" label="Expiration" :text="card.expiration" v-on:changed="x => card.expiration = x" />
				</section>
			</section>

			<Button text="Go to billing" @click.native="state = STATES.BILLING" />
		</section>

		<section v-if="state === STATES.BILLING">
			<section class="inputs">
				<section class="flex">
					<Input label="Email" :text="card.name" v-on:changed="x => card.name = x" />
					<Input label="Date of Birth" :text="card.name" v-on:changed="x => card.name = x" />
				</section>
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

			<Button text="Add Card" />
		</section>
	</section>
</template>

<script>
	import CreditCard from "scatter-core/models/CreditCard";

	const STATES = {
		CARD:0,
		BILLING:1,
	};

	export default {
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
		padding:40px;
		text-align:center;

		button {
			margin-top:10px;
			display:inline-block;
		}

		.card {
			height:70px;
			width:124px;
			background:$blue-gradient;
			border-radius:8px;
			margin:0 auto;
		}

		.title {
			font-size: 24px;
			font-weight: bold;
			margin-top:20px;
		}

		.progress-line {
			margin-top:30px;
			display:flex;
			justify-content: space-evenly;
			position: relative;

			&:after {
				content:'';
				display:block;
				position: absolute;
				top:18px;
				width:100%;
				height:1px;
				background:$lightgrey;
				z-index:0;
			}

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
					color:$lightgrey;
					padding-top:1px;
					padding-right:1px;

					border:1px solid $lightgrey;
				}

				.text {
					font-size: 11px;
					font-weight: bold;
					margin-top:7px;
					opacity:0.3;
				}

				&.active {
					.bubble {
						border:1px solid $darkblue;
						background:$blue;
						color:#fff;
					}

					.text {
						opacity:1;
					}
				}
			}
		}

		.inputs {
			margin-top:20px;
		}
	}

</style>