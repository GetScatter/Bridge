<template>
	<section style="padding-top:20px; display:flex; align-items: flex-end;">
		<Input :disabled="forced" style="margin-bottom:0; flex:1;" placeholder="Account / Address" :text="recipient" v-on:changed="x => recipientLocal = x" />
		<Button v-if="featureFlags.premium && !recipientFriend" :primary="recipient.length" style="margin-left:5px;" icon="fal fa-user" v-tooltip="`Add Friend`" @click.native="addFriend" />
		<Button v-if="featureFlags.premium && !recipientFriend" :primary="!recipient.length" style="margin-left:5px;" icon="fal fa-user-friends" v-tooltip="`Select Friend`" @click.native="selectFriend" />
		<Button v-if="featureFlags.premium && recipientFriend" style="margin-left:5px;" v-tooltip="`Sending to a friend`" :text="recipientFriend.name.substr(0,15) + (recipientFriend.name.length > 15 ? '...' : '')" />
	</section>
</template>

<script>
	import {mapState} from "vuex";
	import PopupService from "../../services/utility/PopupService";
	import Popups from "../../util/Popups";

	export default {
		props:['token', 'forced', 'recipient'],
		data(){return {
			recipientLocal:'',
		}},
		computed:{
			...mapState([
				'scatter',
			]),

			recipientFriend(){
				if(!this.hasPremium) return false;
				if(!this.token) return false;
				return this.scatter.friends.find(friend => friend.accounts.some(x => x.recipient === this.recipient && x.blockchain === this.token.blockchain && x.chainId === this.token.chainId));
			},
		},
		methods:{
			addFriend(){
				if(!this.hasPremium) return PopupService.push(Popups.goPremium(() => {}));
				if(!this.recipient.length) return PopupService.push(Popups.snackbar("You must enter an account name or address"));
				PopupService.push(Popups.friendsList(friend => {}, null, {
					recipient:this.recipient,
					blockchain:this.token.blockchain,
					chainId:this.token.chainId,
				}));
			},
			selectFriend(){
				if(!this.hasPremium) return PopupService.push(Popups.goPremium(() => {}));
				PopupService.push(Popups.friendsList(friend => {
					if(!friend) return;
					this.recipientLocal = friend.accounts.find(x => x.blockchain === this.token.blockchain && x.chainId === this.token.chainId).recipient;
					console.log('friend', friend);

				}, this.token));
			},
		},
		watch:{
			['recipientLocal'](){
				this.$emit('recipient', this.recipientLocal);
			}
		}
	}
</script>
