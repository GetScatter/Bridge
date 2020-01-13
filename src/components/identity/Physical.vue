<template>
	<section>
		<section class="physical panel-head panel-pad limiter" v-if="identity && location">
			<figure class="title">Physical Identity</figure>
			<figure class="description">Your physical identity is your offline information. It is primarily used for things like shipping and billing.</figure>

			<br>
			<br>
			<br>
			<br>

			<section class="flex">
				<Input label="Full Name" :text="fullname" v-on:changed="x => fullname = x" />
				<Input label="Date of birth" type="date" :text="identity.personal.birthdate" v-on:changed="x => identity.personal.birthdate = x" />
			</section>

			<br>
			<br>
			<figure class="line"></figure>
			<br>
			<br>

			<Input label="Address" :text="location.address" v-on:changed="x => location.address = x" />
			<section class="flex">
				<Input label="City" :text="location.city" v-on:changed="x => location.city = x" />
				<Input label="State" :text="location.state" v-on:changed="x => location.state = x" />
			</section>
			<section class="flex">
				<Select :label="'Country'"
				        :selected="location.country"
				        :options="[null].concat(countries)"
				        :parser="x => x ? x.name : 'None'"
				        v-on:selected="x => location.country = x" />

				<Input label="Postal Code" :text="location.zipcode" v-on:changed="x => location.zipcode = x" />
			</section>

			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
			<br>
		</section>
	</section>
</template>

<script>

	import {mapActions, mapState} from "vuex";
	import * as Actions from "@walletpack/core/store/constants";
	import IdentityService from "@walletpack/core/services/utility/IdentityService";
	import Countries from '../../data/Countries'
	import {LocationInformation} from "@walletpack/core/models/Identity";

	let saveTimeout, saveTimeout2;
	export default {
		data(){return {
			location:null,
			identity:null,
			fullname:'',
			loaded:false,
			countries:Countries,
		}},
		mounted(){
			this.location = (this.scatter.keychain.locations[0] || LocationInformation.placeholder()).clone();
			this.identity = this.scatter.keychain.identities[0].clone();
			this.fullname = [this.identity.personal.firstname, this.identity.personal.lastname].filter(x => x && x.length).join(' ');
			setTimeout(() => {
				this.loaded = true;
			}, 1000);
		},
		computed:{
			...mapState([
				'scatter'
			])
		},
		methods:{
			async save(isLocation = false){
				if(!this.loaded) return;
				if(this.saving) return;
				this.saving = true;

				if(isLocation) await IdentityService.updateLocation(this.location);
				else await IdentityService.updateIdentity(this.identity);
				this.saving = false;
			},
			somethingChanged(){
				const hasChanged = (a,b) => !Object.keys(a).every(key => {
					return a[key] === b[key];
				})
				if(hasChanged(this.scatter.keychain.locations[0], this.location)) return true;
				if(hasChanged(this.scatter.keychain.identities[0].personal, this.identity.personal)) return true;
				return false;
			},
		},
		watch:{
			['fullname'](){
				if(!this.loaded) return;
				if(!this.fullname.trim().length){
					this.identity.personal.firstname = '';
					this.identity.personal.lastname = '';
					return false;
				}
				const names = this.fullname.trim().split(' ');
				this.identity.personal.firstname = names.slice(0, names.length > 1 ? names.length-1 : 1).join(' ').trim();
				this.identity.personal.lastname = names.length > 1 ? names[names.length-1].trim() : '';
			},
			identity:{
				handler(a,b){
					if(!this.loaded) return;
					if(!this.somethingChanged()) return;
					clearTimeout(saveTimeout);
					saveTimeout = setTimeout(() => this.save(), 500);
				},
				deep:true,
			},
			location:{
				handler(a,b){
					if(!this.loaded) return;
					if(!this.somethingChanged()) return;
					clearTimeout(saveTimeout2);
					saveTimeout2 = setTimeout(() => this.save(true), 500);
				},
				deep:true,
			},
		}

	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.physical {

	}

</style>
