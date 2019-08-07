<template>
	<section>
		<section class="physical panel-head panel-pad limiter" v-if="identity && location">
			<figure class="icon"><i class="fal fa-fingerprint"></i></figure>
			<figure class="title">Physical Identity</figure>
			<figure class="description">Your physical identity is your real life information.</figure>

			<br>
			<br>
			<br>

			<section class="flex">
				<Input label="Full Name" :text="fullname" v-on:changed="x => fullname = x" />
				<Input label="Date of birth" type="date" :text="identity.personal.birthdate" v-on:changed="x => identity.personal.birthdate = x" />
			</section>
			<Input label="Email Address" disabled="1" :text="identity.personal.email" v-on:changed="x => identity.personal.email = x" />

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
				<Input label="Country" :text="location.country" v-on:changed="x => location.country = x" />
				<Input label="Postal Code" :text="location.zipcode" v-on:changed="x => location.zipcode = x" />
			</section>

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

	let saveTimeout, saveTimeout2;
	export default {
		data(){return {
			location:null,
			identity:null,
			fullname:'',
		}},
		mounted(){
			this.location = this.scatter.keychain.locations[0].clone();
			this.identity = this.scatter.keychain.identities[0].clone();
			this.fullname = [this.identity.personal.firstname, this.identity.personal.lastname].filter(x => x && x.length).join(' ');

			console.log(this.identity)
		},
		computed:{
			...mapState([
				'scatter'
			])
		},
		methods:{
			save(isLocation = false){
				if(isLocation) IdentityService.updateLocation(this.location);
				else IdentityService.updateIdentity(this.identity);
			},
		},
		watch:{
			['fullname'](){
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
				handler(){
					clearTimeout(saveTimeout);
					saveTimeout = setTimeout(() => this.save(), 500);
				},
				deep:true,
			},
			location:{
				handler(){
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