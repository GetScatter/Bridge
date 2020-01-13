<template>
	<section class="add-or-edit-network">

		<section class="popup-content">

			<figure class="title" v-if="editing">Editing <span>network settings</span></figure>
			<figure class="title" v-if="!editing">Adding <span>custom network</span></figure>

			<section class="switcher">
				<figure class="type" @click="state = STATES.NETWORK" :class="{'active':state === STATES.NETWORK}">Details</figure>
				<figure class="type" @click="state = STATES.TOKEN" :class="{'active':state === STATES.TOKEN}">System Token</figure>
			</section>

			<section class="scroller" v-if="state === STATES.NETWORK">
				<Input label="Name" placeholder="My Custom Network" :text="network.name" v-on:changed="x => network.name = x" />
				<Select style="margin:0 0 20px 0;" bordered="1" label="Blockchain" :selected="network.blockchain" :options="blockchains" v-on:selected="x => network.blockchain = x" :parser="x => blockchainName(x)" />
				<section class="flex">
					<Input style="flex:1;" label="Host (domain only)" placeholder="example.com" :text="network.host" v-on:changed="x => network.host = x" />
					<Input style="flex:0.3;" label="Port" placeholder="443" type="number" :text="network.port" v-on:changed="x => network.port = x" />
				</section>
				<Select style="margin:0 0 20px 0;" bordered="1" label="Protocol" :selected="network.protocol" :options="['http', 'https']" v-on:selected="x => network.protocol = x" />
				<section class="flex">
					<Input :disabled="!!editing" label="Chain ID" placeholder="aca..." :text="network.chainId" v-on:changed="x => network.chainId = x" />
					<Button v-if="!editing" :loading="gettingChainId" icon="fas fa-link" style="margin-top:21px;" @click.native="fetchChainId" />
				</section>
				<Input label="Path (leave blank for no path)" placeholder="/example" :text="network.path" v-on:changed="x => network.path = x" />
			</section>

			<section class="scroller" v-if="state === STATES.TOKEN">
				<section class="flex" style="align-items: center">
					<figure class="custom-token-text">If this network uses a custom token as its system token, enable this option and configure the details.</figure>
					<Switcher style="flex:0 0 auto;" :state="network.token" v-on:switched="useCustomToken" />
				</section>
				<br />
				<br />
				<section class="flex" v-if="network.token">
					<Input style="flex:1; margin-bottom:0;"
					       :placeholder="contractPlaceholder"
					       :text="network.token.contract"
					       :disabled="editing"
					       v-on:changed="x => network.token.contract = x"
					       label="Contract account" />
					<Input style="flex:0.5; margin-bottom:0;" placeholder="XXX"
					       label="Symbol"
					       :text="network.token.symbol"
					       :disabled="editing"
					       v-on:changed="x => network.token.symbol = x" />
					<Input style="flex:0.5; margin-bottom:0;" placeholder="4" type="number"
					       label="Decimals"
					       :disabled="editing"
					       :text="network.token.decimals" v-on:changed="x => network.token.decimals = x" />
				</section>
			</section>

		</section>

		<section class="popup-buttons">
			<Button @click.native="() => closer(null)" text="Cancel" />
			<Button primary="1" @click.native="save" text="Save" />
		</section>

	</section>
</template>

<script>

	import {mapState} from "vuex";
	import Network from '@walletpack/core/models/Network'
	import Token from '@walletpack/core/models/Token'
	import NetworkService from '@walletpack/core/services/blockchain/NetworkService'
	import PopupService from "../../services/utility/PopupService";
	import Popups from "../../util/Popups";
	import PluginRepository from '@walletpack/core/plugins/PluginRepository'
	import {BlockchainsArray, Blockchains, blockchainName} from '@walletpack/core/models/Blockchains'

	const STATES = {
		NETWORK:'network',
		TOKEN:'token',
	}

	export default {
		props:['popin', 'closer'],
		data(){return {
			state:STATES.NETWORK,
			STATES,
			network:Network.placeholder(),
			gettingChainId:false,
		}},
		computed:{
			...mapState([
				'scatter',
			]),
			editing(){
				return this.popin.data.props.network;
			},
			contractPlaceholder(){
				if(!this.network.token || !this.network.token.blockchain) return;
				return PluginRepository.plugin(this.network.token.blockchain).contractPlaceholder();
			},
			blockchains(){
				return BlockchainsArray.map(x => x.value);
			}
		},
		mounted(){
			if(this.editing){
				this.network = this.editing.clone();
			} else {
				this.network.blockchain = Blockchains.EOSIO;
			}
		},
		methods:{
			blockchainName,
			async save(){
				if(this.editing){
					await NetworkService.updateNetwork(this.network);
				} else {
					const saved = await NetworkService.addNetwork(this.network);
					if(saved.hasOwnProperty('error')){
						return PopupService.push(Popups.snackbar(saved.error));
					}
				}

				this.closer(this.network);
			},
			useCustomToken(){
				if(this.network.token) return this.network.token = null;

				const token = Token.placeholder();
				token.blockchain = this.network.blockchain;
				this.network.token = token;
			},
			async fetchChainId(){
				this.gettingChainId = true;
				this.network.chainId = await PluginRepository.plugin(this.network.blockchain).getChainId(this.network);
				this.gettingChainId = false;
			},
		},
		watch:{
			['network.host'](){
				if(!this.network.host) return;
				if(this.network.host.indexOf('//') > -1){
					this.network.host = this.network.host.split('//')[1];
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.add-or-edit-network {
		max-width:400px;

		width:calc(100% - 80px);
		margin:0 auto;

		.custom-token-text {
			font-size: $font-size-small;
			text-align:left;
		}

		.sub-title {
			margin-top:-20px;
			font-size: $font-size-standard;
		}

		.scroller {
			margin:0 -40px -40px;
			padding:20px 40px;
			max-height:280px;
			overflow-y: auto;
		}

		.switcher {
			margin:-20px -40px 0;
			width:calc(100% + 80px);
		}
	}


</style>
