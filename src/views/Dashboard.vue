<template>
	<section class="dashboard panel-pad">
		<section class="cta">
			<CTACreditCard />
		</section>

		<section class="lists">
			<section class="list" v-for="list in lists">
				<figure class="count">{{list.count}}</figure>
				<figure class="title">{{list.title}}</figure>
				<section class="items">
					<section class="item" v-for="item in list.items">
						<figure class="img"></figure>
						<figure class="item-title">{{item.title}}</figure>
						<figure class="item-subtitle">{{item.subtitle}}</figure>
					</section>
				</section>
				<section class="more">
					View All <i class="fas fa-chevron-right"></i>
				</section>
			</section>
		</section>
	</section>
</template>

<script>
	import CTACreditCard from "../components/dashboard/CTACreditCard";
	import ScatterCore from "scatter-core";
	import BalanceService from "scatter-core/services/blockchain/BalanceService";
	import PriceService from "scatter-core/services/apis/PriceService";
	import AppsService from "scatter-core/services/apps/AppsService";
	export default {
		components: {
			CTACreditCard
		},
		computed:{
			currency(){
				return PriceService.fiatSymbol()
			},
			lists(){


				let apps = AppsService.linkedApps();
				apps = {
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
					count:balances.length,
					title:'Tokens',
					items:balances.slice(0,5).map(x => ({
						img:'',
						title:x.symbol,
						subtitle:this.currency + x.fiatBalance(false)
					}))
				};


				return [
					apps,
					{
						count:0,
						title:'Items',
						items:[],
					},
					balances
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
				}

				.more {
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

	.dark {
		.lists {
			.list {
				.title {
					border-bottom:1px solid $borderdark;
				}

				.more {
					border-top:1px solid $borderdark;
				}
			}
		}
	}

</style>

