<template>
	<section class="dashboard panel-pad">
		<section class="cta">
			<CTAPremium v-if="hasCard" @click.native="hasCard = false" />
			<CTACreditCard v-if="!hasCard" @click.native="hasCard = true" />
		</section>

		<section class="lists">
			<section class="list" v-for="list in lists">
				<section @click="selectedList = list.id">
					<figure class="count">{{list.count}}</figure>
					<figure class="title" :class="{'selected':isMobile && selectedList === list.id}">{{list.title}}</figure>
				</section>
				<section v-if="!isMobile || selectedList === list.id">
					<section class="items">
						<section class="item" v-for="item in list.items">
							<figure class="img"></figure>
							<figure class="item-title">{{item.title}}</figure>
							<figure class="item-subtitle">{{item.subtitle}}</figure>
						</section>
						<section class="more" v-if="list.items.length">
							View All <i class="fas fa-chevron-right"></i>
						</section>
					</section>
				</section>
			</section>
		</section>
	</section>
</template>

<script>
	import CTACreditCard from "../components/dashboard/CTACreditCard";
	import CTAPremium from "../components/dashboard/CTAPremium";
	import ScatterCore from "scatter-core";
	import BalanceService from "scatter-core/services/blockchain/BalanceService";
	import PriceService from "scatter-core/services/apis/PriceService";
	import AppsService from "scatter-core/services/apps/AppsService";
	export default {
		data(){return {
			selectedList:0,
			hasCard:false,
		}},
		components: {
			CTACreditCard,
			CTAPremium,
		},
		computed:{
			currency(){
				return PriceService.fiatSymbol()
			},
			lists(){


				let apps = AppsService.linkedApps();
				apps = {
					id:2,
					count:apps.length,
					title:'Apps Linked',
					items:apps.map(x => ({
						img:x.img,
						title:x.name,
						subtitle:x.type
					}))
				};




				let balances = BalanceService.totalBalances().totals;
				balances = Object.keys(balances).map(key => balances[key]);
				balances = balances.sort((a,b) => {
					return b.fiatBalance(false) - a.fiatBalance(false)
				});
				balances = {
					id:0,
					count:balances.length,
					title:'Tokens',
					items:balances.slice(0,5).map(x => ({
						img:'',
						title:x.symbol,
						subtitle:x.fiatBalance(false) ? this.currency + x.fiatBalance(false) : ''
					}))
				};


				return [
					balances,
					{
						id:1,
						count:0,
						title:'Items',
						items:[],
					},
					apps,
				]
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../styles/variables";

	.dashboard {

		.cta {
			min-height:100px;
			padding-bottom:40px;
		}

		.lists {
			display:flex;

			.list {
				flex:1;


				&:nth-child(2){
					margin:0 80px;
				}

				.count {
					font-size: 48px;
					font-weight: bold;
				}

				.title {
					color:$grey;
					padding-bottom:20px;
					margin-bottom: 5px;
					border-bottom:1px solid $borderlight;
					font-size: 13px;
					font-weight: bold;
				}

				.items {
					position: relative;
					min-height:150px;

					.item {
						cursor: pointer;
						padding:6px 0;
						display:flex;
						font-size: 13px;
						align-items: center;

						.item-title {
							width:70%;
						}

						.item-subtitle {
							width:30%;
							text-align: right;
							font-size: 11px;
							font-weight: bold;
							color:$grey;
						}

						&:hover {
							color:$blue;
						}
					}

					.more {
						position: absolute;
						bottom:-50px;
						left:0;
						right:0;

						border-top:1px solid $borderlight;
						padding-top:20px;
						font-size: 11px;
						text-transform: uppercase;
						font-weight: bold;
						color:$blue;

						i {
							float:right;
						}
					}
				}
			}
		}
	}

	.blue-steel {
		.lists {
			.list {
				.title {
					border-bottom:1px solid $borderdark;
				}

				.items {
					.more {
						border-top:1px solid $borderdark;
					}
				}
			}
		}
	}

	.mobile {
		.dashboard {

			.lists {
				display:flex;
				position: relative;

				.list {
					&:nth-child(2){
						margin:0;
					}

					.count {
						font-size: 24px;
						text-align:center;
					}

					.title {
						font-size: 13px;
						text-align:center;

						&.selected {
							border-bottom:1px solid $blue;
						}
					}

					.items {
						position:absolute;
						left:0;
						right:0;
						min-height:auto;
						margin-bottom:200px;

						.item {
							font-size: 16px;

							.item-subtitle {
								font-size: 13px;
							}
						}

						.more {
							text-align:left;

							i {
								float:right;
							}
						}
					}
				}
			}
		}
	}

</style>

