<template>
	<section class="wallet panel-pad">


		<section class="action-bar">
			<figure class="title">Wallet</figure>
			<section class="actions">
				<Button text="Receive" icon="fas fa-share" />
				<Button text="Send" icon="fas fa-share" />
				<Button text="Exchange" icon="fas fa-share" />
			</section>
		</section>

		<section class="list-and-panel">
			<section class="nav-list">
				<figure class="item" @click="state = STATES.Assets" :class="{'active':state === STATES.Assets}">Assets</figure>
				<figure class="item" @click="state = STATES.Items" :class="{'active':state === STATES.Items}">Items</figure>
				<figure class="item" @click="state = STATES.Cards" :class="{'active':state === STATES.Cards}">Cards</figure>
				<figure class="item" @click="state = STATES.History" :class="{'active':state === STATES.History}">History</figure>
			</section>

			<section class="list-panel">


				<section class="token-list">
					<section class="token" v-for="token in tokens">
						<figure class="icon"></figure>
						<section class="basic-info">
							<figure class="name">{{token.symbol}}</figure>
							<figure class="price">$4.00</figure>
						</section>
						<section class="balance">$4,0000</section>
					</section>
				</section>



			</section>
		</section>
	</section>
</template>

<script>
	import Token from "scatter-core/models/Token";

	const STATES = {
		Assets:0,
		Items:1,
		Cards:2,
		History:3,
	};

	export default {
		data(){return {
			STATES,
			state:STATES.Assets
		}},
		computed:{
			tokens(){
				return [
					Token.fromJson({symbol:'EOS'}),
					Token.fromJson({symbol:'ETH'}),
					Token.fromJson({symbol:'BTC'}),
				]
			}
		}

	}
</script>

<style scoped lang="scss">
	@import "../styles/variables";

	.wallet {
		.action-bar {
			padding-bottom:20px;
			border-bottom:1px solid $borderlight;
			overflow:hidden;
			display:flex;
			align-items: center;

			.title {
				flex:1;
				font-size: 24px;
				font-weight: bold;
				float:left;
			}

			.actions {
				overflow:hidden;

				button {
					float:right;
					margin-left:10px;
				}
			}
		}

		.token-list {
			.token {
				padding:20px 0;
				display:flex;
				align-items: center;

				&:not(:last-child){
					border-bottom:1px solid $borderlight;
				}

				.icon {
					width:34px;
					height:34px;
					border-radius:50%;
					margin-right:20px;
					background:$grey;
				}

				.basic-info {
					flex:1;

					.name {
						font-size: 16px;
						font-weight: bold;
					}

					.price {
						font-size: 13px;
					}
				}

				.balance {

				}
			}
		}
	}

	.dark {
		.wallet {
			.action-bar {
				border-bottom: 1px solid $borderdark;
			}

			.token-list {
				.token {
					&:not(:last-child){
						border-bottom:1px solid $borderdark;
					}
				}
			}
		}
	}



</style>

