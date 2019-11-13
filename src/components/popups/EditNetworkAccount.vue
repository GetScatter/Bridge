<template>
	<section class="edit-network-account transfer">

		<section class="popup-content">
			<figure class="title" style="margin-bottom:10px;">Select your <span>{{network.name}}</span> account</figure>
			<figure class="sub-title">You can select an account from the list below to choose it as the default to use.</figure>

			<br><br>
			<figure class="line"></figure>
			<br><br>

			<SearchBar v-on:terms="x => terms = x" />

			<section class="items">
				<figure class="item" @click="select(account)" v-for="account in accounts">
					{{account.sendable()}}
				</figure>
			</section>

		</section>




		<section class="popup-buttons">
			<Button @click.native="() => closer(null)" text="Cancel" />
		</section>

	</section>
</template>

<script>
	import "../../styles/transfers.scss";
	import {blockchainName} from '@walletpack/core/models/Blockchains'
	import SingularAccounts from "../../services/utility/SingularAccounts";
	import {mapActions, mapState} from "vuex";
	import * as Actions from '@walletpack/core/store/constants';
	import BalanceService from '@walletpack/core/services/blockchain/BalanceService';

	export default {
		props:['popin', 'closer'],
		data(){return {
			terms:'',
		}},
		created(){

		},
		computed:{
			network(){
				return this.popin.data.props.network
			},
			accounts(){
				return this.network.accounts().filter(x => {
					return x.sendable().toLowerCase().trim().indexOf(this.terms.toLowerCase().trim()) > -1;
				}).sort((a,b) => b.authority === 'active' ? 1 : 0).reduce((acc, account) => {
					if(!acc.find(x => x.sendable() === account.sendable())) acc.push(account);
					return acc;
				}, [])
			}
		},
		methods:{
			select(account){
				const oldAccount = SingularAccounts.accounts([this.network])[0];
				if(oldAccount.sendable() !== account.sendable()){
					this[Actions.REMOVE_BALANCES]([oldAccount.identifiable()])
				}

				SingularAccounts.setPredefinedAccount(this.network, account);
				BalanceService.loadBalancesFor(account);
				this.closer(true);
			},
			...mapActions([
				Actions.SET_BALANCES,
				Actions.REMOVE_BALANCES,
			])
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.edit-network-account {
		max-width:400px;
		width:calc(100% - 80px);
		margin:0 auto;

		.sub-title {
			margin-top:10px;
		}


		.items {
			position: relative;
			min-height:150px;

			.item {
				cursor: pointer;
				margin-bottom:5px;
				border-radius:4px;
				border:1px solid $borderlight;
				padding:15px;
				display:flex;
				font-size: $font-size-standard;
				font-weight:bold;
				align-items: center;
				flex-direction:row;

				&:hover {
					color:white;
					background:$blue;
					border:1px solid $darkblue;
				}

			}
		}
	}


</style>
