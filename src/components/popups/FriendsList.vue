<template>
	<section class="friends-list">

		<section class="popin-container" v-if="!addingFriend">
			<section class="popup-content">

				<SearchBar v-if="terms.length || filteredFriends.length" v-on:terms="x => terms = x" style="margin-top:0px;" />

				<section class="friends" v-if="filteredFriends.length">
					<section class="friend" :key="`friend_${i}`" v-for="(friend,i) in filteredFriends">
						<section class="info">
							<figure class="name">{{friend.name}}</figure>
							<figure class="details" v-if="token">{{friend.accounts.find(x => x.blockchain === token.blockchain && x.chainId === token.chainId).recipient}}</figure>
						</section>
						<section class="actions" v-if="!token">
							<Button v-tooltip="`Remove Friend`" icon="fal fa-ban" @click.native="removeFriend(friend)" />
							<Button v-tooltip="`Edit Friend`" icon="fal fa-pencil" @click.native="editFriend(friend)" />
							<Button v-if="friend.identity.length" v-tooltip="`Request Money`" primary="1" icon="fal fa-inbox-in" @click.native="requestMoney(friend)" />
						</section>
						<section class="actions" v-if="token">
							<Button icon="fal fa-check" text="Select" primary="1" @click.native="closer(friend)" />
						</section>
					</section>
				</section>

				<section class="no-friends" v-if="!terms.length && !filteredFriends.length">
					<figure class="title">Oh no, you don't have any friends yet!</figure>
					<figure class="sub-title">Click on the button below to get started adding your first friend. Your friends list makes you safer by making sure you are always sending tokens and money to the right accounts.</figure>
					<Button :forcedStyles="{height:'50px', padding:'0 30px'}" style="display:inline-block;" @click.native="toggleAddingFriend" primary="1" icon="fal fa-user-plus" text="Add your first friend" />
				</section>

			</section>




			<section class="popup-buttons" v-if="token">
				<Button @click.native="() => closer(null)" text="Cancel" />
			</section>

			<section class="popup-buttons" v-else>
				<Button @click.native="() => closer(null)" text="Close" />
				<Button v-if="terms.length || filteredFriends.length" @click.native="toggleAddingFriend" primary="1" icon="fal fa-user-plus" text="Add a friend" />
			</section>
		</section>


		<!-- ------------------- -->
		<!-- ADDING A NEW FRIEND -->
		<!-- ------------------- -->
		<section class="popin-container" v-if="addingFriend">
			<section class="popup-head blue-back">
				<figure class="sub-title">
					You will be able to <u>request money</u> from friends who approve your friendship.
					You can always <u>send</u> tokens and money to friends even if they haven't approved your friendship, even though... they aren't true friends.
				</figure>
			</section>

			<section class="popup-content">
				<Input style="margin-bottom:0;" placeholder="Name" :text="newFriend.name" v-on:changed="x => newFriend.name = x" />

				<section class="switcher">
					<figure class="type" @click="newFriendState = NEW_FRIEND_STATES.IDENTITY" :class="{'active':newFriendState === NEW_FRIEND_STATES.IDENTITY}">Their Identity</figure>
					<figure class="type" @click="newFriendState = NEW_FRIEND_STATES.ACCOUNTS" :class="{'active':newFriendState === NEW_FRIEND_STATES.ACCOUNTS}">Their Accounts</figure>
				</section>

				<section v-if="newFriendState === NEW_FRIEND_STATES.IDENTITY">
					<Input style="margin-bottom:0;" placeholder="Identity name (yourfriend@scatter)" :text="newFriend.identity" v-on:changed="x => newFriend.identity = x" />
				</section>
				<section v-if="newFriendState === NEW_FRIEND_STATES.ACCOUNTS">
					<section class="friend-accounts">
						<section class="friend-account" v-for="(account, index) in newFriend.accounts">
							<Input :disabled="addFriendFrom ? index === 0 : false" style="flex:1; margin:0;" placeholder="account / address" :text="account.recipient" v-on:changed="x => account.recipient = x" />
							<Select :disabled="addFriendFrom ? index === 0 : false" style="flex:1; margin:0; margin-left:5px;" :parser="network => network ? network.name : 'Select a network'"
							        :options="availableNetworks" :selected="accountNetwork(account)"
							        v-on:selected="x => selectNetwork(account, x)" />
							<Button v-tooltip="`Remove`" style="flex:0 0 auto; margin-left:5px;"
							        v-if="addFriendFrom ? index !== 0 : newFriend.accounts.length > 1"
							        icon="fal fa-ban"
							        @click.native="removeFriendAccount(account)" />
						</section>
					</section>
					<section class="flex">
						<figure style="flex:1;"></figure>
						<Button style="margin-top:10px; flex:0 0 auto;" text="Add account" icon="fal fa-plus" primary="1" @click.native="addDummyFriendAccount" />
					</section>
				</section>

			</section>

			<section class="popup-buttons">
				<Button v-if="!addFriendFrom" @click.native="toggleAddingFriend" text="Nevermind" />
				<Button v-if="addFriendFrom" @click.native="closer(null)" text="Nevermind" />
				<Button @click.native="addFriend" primary="1" icon="fal fa-check" :text="editingFriend ? 'Save friend' : 'Add friend'" />
			</section>
		</section>



	</section>
</template>

<script>
	import "../../styles/transfers.scss";
	import {mapActions, mapGetters, mapState} from "vuex";
	import SymbolBall from "../reusable/SymbolBall";
	import Friend from "../../models/Friend";
	import * as Actions from '@walletpack/core/store/constants';
	import Popups from "../../util/Popups";
	import PopupService from "../../services/utility/PopupService";

	const NEW_FRIEND_STATES = {
		IDENTITY:0,
		ACCOUNTS:1,
	}

	export default {
		props:['popin', 'closer'],
		components: {SymbolBall},
		data(){return {
			terms:'',

			addingFriend:false,
			newFriend:Friend.placeholder(),

			NEW_FRIEND_STATES,
			newFriendState:NEW_FRIEND_STATES.IDENTITY,
		}},
		created(){
			if(this.addFriendFrom) {
				this.addingFriend = true;
				this.newFriend.accounts = [this.addFriendFrom];
				this.newFriendState = NEW_FRIEND_STATES.ACCOUNTS;
			}
		},
		computed:{
			...mapState([
				'scatter',
			]),
			...mapGetters([
				'friends',
			]),
			// If a token is passed in, this popup is a FRIEND SELECTOR
			token(){
				return this.popin.data.props.token;
			},
			addFriendFrom(){
				return this.popin.data.props.addFriendFrom;
			},
			filteredFriends(){
				return this.friends
					.filter(x => x.name.toLowerCase().indexOf(this.terms) > -1 || x.identity.toLowerCase().indexOf(this.terms) > -1 || x.accounts.some(y => y.recipient.toLowerCase().indexOf(this.terms) > -1))
					// Token can be passed in to filter friends list for available friends to send to
					.filter(x => this.token ? x.accounts.some(y => y.blockchain === this.token.blockchain && y.chainId === this.token.chainId) : true);
			},
			networks(){
				return this.scatter.settings.networks;
			},
			availableNetworks(){
				return this.networks.filter(network => {
					return !this.newFriend.accounts.some(x => x.blockchain === network.blockchain && x.chainId === network.chainId);
				})
			},
			editingFriend(){
				if(!this.scatter.friends) return false;
				return this.scatter.friends.find(x => x.id === this.newFriend.id);
			}
		},
		methods:{
			accountNetwork(account){
				return this.networks.find(x => x.blockchain === account.blockchain && x.chainId === account.chainId);
			},
			toggleAddingFriend(){
				this.addingFriend = !this.addingFriend;
				this.newFriend = Friend.placeholder();
				this.addDummyFriendAccount();
			},
			addDummyFriendAccount(){
				if(!this.availableNetworks.length) return;
				this.newFriend.accounts.push({recipient:'', blockchain:this.availableNetworks[0].blockchain, chainId:this.availableNetworks[0].chainId});
			},
			removeFriendAccount(account){
				this.newFriend.accounts = this.newFriend.accounts.filter(x => `${x.recipient}${x.blockchain}${x.chainId}` !== `${account.recipient}${account.blockchain}${account.chainId}`);
				if(!this.newFriend.accounts.length) this.addDummyFriendAccount();
			},
			selectNetwork(friendAccount, network){
				friendAccount.blockchain = network.blockchain;
				friendAccount.chainId = network.chainId;
			},
			editFriend(friend){
				this.newFriend = Friend.fromJson(friend).clone();
				this.addingFriend = true;
			},
			requestMoney(friend){
				PopupService.push(Popups.requestStable(friend, done => {

				}));
			},
			removeFriend(friend){
				const clone = this.scatter.clone();
				if(!clone.friends) clone.friends = [];
				clone.friends = clone.friends.filter(x => x.id !== friend.id);
				this[Actions.SET_SCATTER](clone);
			},
			addFriend(){
				const clone = this.scatter.clone();
				if(!clone.friends) clone.friends = [];
				clone.friends = clone.friends.filter(x => x.id !== this.newFriend.id);
				clone.friends.push(this.newFriend);
				this[Actions.SET_SCATTER](clone);
				if(this.addFriendFrom) return this.closer(this.newFriend);
				this.toggleAddingFriend();
			},
			...mapActions([
				Actions.SET_SCATTER
			])
		},
	}
</script>

<style lang="scss">
	@import "../../styles/variables";

	.friends-list {
		max-width:500px;
		width:calc(100% - 80px);
		margin:0 auto;

		.switcher {
			margin-bottom:20px;
		}



		.popup-content {
			.sub-title {
				margin-top:-20px;
				font-size: $font-size-small;
				margin-bottom:20px;
			}
		}

		.scroller {
			overflow-y: auto;
			max-height:200px;
			margin:0 -40px -40px;
			padding:0 40px 40px;
		}

		.friends {

			.friend {
				display:flex;
				align-items: center;

				&:not(:last-child){
					margin-bottom:5px;
					padding-bottom:5px;
					border-bottom:1px solid $borderlight;
				}

				.info {
					flex:1;
					text-align: left;

					.name {
						font-size: $font-size-standard;
						font-weight: bold;
					}

					.details {
						font-size: $font-size-tiny;
						color:$blue;
					}
				}
				.name {

				}

				.actions {
					flex:0 0 auto;
					display:flex;
					align-items: center;

					button {
						margin-left:5px;
					}
				}
			}
		}

		.friend-accounts {

			.friend-account {
				display:flex;
				align-items: center;

				&:not(:first-child){
					margin-top:5px;
				}

				.select {
					.options {
						top: 45px;
					}
				}
			}
		}



		.no-friends {
			text-align:center;

			.sub-title {
				margin-top:-15px;
				margin-bottom:40px;
				font-size: $font-size-small;
			}

		}

	}

	.blue-steel {


		.friends {

			.friend {
				&:not(:last-child){
					border-bottom:1px solid $borderdark;
				}

			}
		}
	}


</style>
