<template>
	<section class="dashboard">

		<section style="position:relative;">
			<div class="corners"></div>
			<section class="cta">
				<transition name="fade" mode="out-in">
					<CTACreditCard v-if="!hasCard" />
					<!--<CTAPremium v-else-if="hasCard && !hasKyc" />-->
					<CTAApps v-else />

					<!--<CTACreditCard />-->
					<!--<CTAApps />-->
				</transition>
			</section>
		</section>

		<section class="lists limiter panel-pad">
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
						<section class="more" v-if="list.items.length" @click="list.click">
							View all {{list.title}} <i class="fas fa-chevron-right"></i>
						</section>
					</section>
				</section>
			</section>
		</section>

		<br>
		<br>
		<br>
		<br>
		<br>
		<br>
		<br>

	</section>
</template>

<script>
	import ScatterCore from "@walletpack/core";
	import BalanceService from "@walletpack/core/services/blockchain/BalanceService";
	import PriceService from "@walletpack/core/services/apis/PriceService";
	import AppsService from "@walletpack/core/services/apps/AppsService";
	import PopupService from "../services/utility/PopupService";
	import Popups from "../util/Popups";
	import {mapState} from "vuex";
	import Loader from "../util/Loader";
	import SingletonService from "../services/utility/SingletonService";
	import WindowService from "../services/utility/WindowService";
	export default {
		data(){return {
			selectedList:0,
		}},
		components: {
			CTACreditCard:() => import("../components/dashboard/CTACreditCard"),
			CTAPremium:() => import("../components/dashboard/CTAPremium"),
			CTAApps:() => import("../components/dashboard/CTAApps"),
		},
		mounted(){
			setTimeout(() => {
				Loader.set(false);
			}, 1000);

			if(!SingletonService.isInit()){
				SingletonService.init();
			}

			// setTimeout(async() => {
			// 	if(!SingletonService.isInit()){
			// 		await SingletonService.init();
			// 	}
			//
			// 	this.$nextTick(() => {
			// 		Loader.set(false);
			// 		setTimeout(() => {
			// 			if(WindowService.arePopupsBlocked()) PopupService.push(Popups.allowPopups(() => {}));
			// 		}, 2000);
			// 	});
			// }, 1)
		},
		computed:{
			...mapState([
				'scatter',
				'swiped',
				'isMobile'
			]),
			hasCard(){
				return !!this.scatter.keychain.cards.length
			},
			hasKyc(){
				return true;
				return this.scatter.keychain.identities[0].kyc;
			},
			currency(){
				return PriceService.fiatSymbol()
			},
			lists(){
				let apps = AppsService.linkedApps();

				let balances = BalanceService.totalBalances(true).totals;
				balances = Object.keys(balances).map(key => balances[key]);
				balances = balances.sort((a,b) => {
					return b.fiatBalance(false) - a.fiatBalance(false)
				});

				let lists = [{
					id:0,
					click:() => this.$router.push({name:this.RouteNames.Wallet, query:{type:'assets'}}),
					count:balances.length,
					title:'Tokens',
					items:balances.slice(0,5).map(x => ({
						img:'',
						title:x.symbol,
						subtitle:x.fiatBalance(false) ? this.currency + x.fiatBalance(false) : ''
					}))
				}];

				if(!this.isMobile || apps.length) lists.push({
					id:2,
					click:() => this.$router.push({name:this.RouteNames.Apps}),
					count:apps.length,
					title:'Apps',
					items:apps.length ? apps.map(x => ({
						img:x.img,
						title:x.name,
						subtitle:x.type
					})) : [{
						img:null,
						// subtitle:'No apps',
						title:`You don't have any apps linked yet. Visit the app explorer to get started.`
					}]
				});

				return lists;
			}
		},
		methods:{

		},
		watch:{
			['swiped'](){
				if(this.swiped !== null){
					this.selectedList += this.swiped;
					if(this.selectedList > this.lists.length-1) this.selectedList = this.lists.length-1;
					if(this.selectedList < 0) this.selectedList = 0;
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../styles/variables";

	.dashboard {

		display:flex;
		flex-direction: column;
		height:calc(100vh - #{$navbarheight} - #{$topactions} + 80px);

		.curvy-bg {
			position:absolute;
			top:0;
			left:0;
			right:0;
			z-index:-1;
			overflow:hidden;
			opacity:0.2;
			height:500px;

			svg {
				width:100%;
				height:1360px;
			}
		}

		.wrapper {
			padding-top:30px;
			display:flex;
			flex-direction:column;
			width:100%;
		}

		.cta {
			min-height:100px;
			display:block;
		}

		.lists {
			display:flex;
			width:100%;

			.list {
				flex:1;
				border-radius:20px;

				&:not(:first-child){
					margin-left:50px;
				}

				.count {
					font-size: $font-size-huge;
					font-weight: bold;
					font-family: 'Poppins', sans-serif;
				}

				.title {
					color:$grey;
					padding-bottom:20px;
					margin-bottom: 10px;
					border-bottom:1px solid rgba($blue, 0.24);
					font-size: $font-size-standard;
				}

				.items {
					position: relative;
					min-height:150px;

					.item {
						padding:6px 0;
						display:flex;
						font-size: $font-size-standard;
						font-weight:bold;
						align-items: center;
						flex-direction:row;

						.item-title {
							width:70%;
							font-family: 'Poppins', sans-serif;
						}

						.item-subtitle {
							width:30%;
							text-align: right;
							font-size: $font-size-standard;
							font-weight: normal;
							color:$blue;
							font-family: 'Poppins', sans-serif;
						}
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
							font-size: $font-size-big;
							font-weight: bold;

							.item-subtitle {
								font-size: $font-size-big;
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

