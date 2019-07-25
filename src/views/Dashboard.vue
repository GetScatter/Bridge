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
	export default {
		components: {
			CTACreditCard
		},
		computed:{
			lists(){
				const randomNum = prefix => (typeof prefix === 'string' ? prefix : '').toString() + (Math.round(Math.random() * 100) + 1).toString();
				return [
					{
						count:randomNum(),
						title:'Apps Linked',
						items:[
							{img:'', title:'Decentium', subtitle:null},
							{img:'', title:'Enemy Metal', subtitle:null},
							{img:'', title:'Gods Unchained', subtitle:null},
						],
					},
					{
						count:randomNum(),
						title:'Items',
						items:[
							{img:'', title:'Magical Sword', subtitle:randomNum('$')},
							{img:'', title:'Amulet of poo', subtitle:randomNum('$')},
							{img:'', title:'Darkened bottle', subtitle:randomNum('$')},
							{img:'', title:'House det', subtitle:randomNum('$')},
							{img:'', title:'Digital Water', subtitle:randomNum('$')},
						],
					},
					{
						count:randomNum(),
						title:'Tokens',
						items:[
							{img:'', title:'EOS', subtitle:randomNum('$')},
							{img:'', title:'ETH', subtitle:randomNum('$')},
							{img:'', title:'BTC', subtitle:randomNum('$')},
							{img:'', title:'RIDL', subtitle:randomNum('$')},
							{img:'', title:'TUSD', subtitle:randomNum('$')},
						],
					}
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

						.item-title {
							width:70%;
						}

						.item-subtitle {
							width:30%;
							text-align: right;
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

