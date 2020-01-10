<template>
	<section class="add-contact">

		<section class="popup-content">

			<figure class="title">Adding a new <span>Contact</span></figure>
			<figure class="sub-title" style="margin-top:-20px;">Adding contact information for <u>{{recipient}}</u></figure>
			<br>

			<Input label="Give this contact a name" :text="name" v-on:changed="x => name = x" />
			<Input style="flex:1;"  textarea="1" label="Add a note about this contact" :text="note" v-on:changed="x => note = x" />

		</section>

		<section class="popup-buttons">
			<Button @click.native="() => closer(null)" text="Cancel" />
			<Button primary="1" @click.native="add" text="Add Contact" />
		</section>

	</section>
</template>

<script>

	import ContactService from "@walletpack/core/services/utility/ContactService";
	import Contact from "@walletpack/core/models/Contact";
	import PopupService from "../../services/utility/PopupService";
	import Popups from "../../util/Popups";

	export default {
		props:['popin', 'closer'],
		data(){return {
			name:'',
			note:'',
		}},
		computed:{
			blockchain(){
				return this.popin.data.props.blockchain
			},
			chainId(){
				return this.popin.data.props.chainId
			},
			recipient(){
				return this.popin.data.props.recipient
			}
		},
		mounted(){
			this.name = this.recipient;
		},
		methods:{
			async add(){
				this.name = this.name.trim();
				this.note = this.note.trim();

				if(!this.name.length) return PopupService.push(Popups.snackbar("You must give this contact a name."));

				const contact = Contact.fromJson({
					name:this.name,
					recipient:this.recipient,
					blockchain:this.blockchain,
					chainId:this.chainId,
					note:this.note
				});
				const err = await ContactService.addOrUpdate(contact);

				if(err && err.hasOwnProperty('error')){
					PopupService.push(Popups.snackbar(err));
					return;
				}

				this.closer(contact);
			}
		},
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.add-contact {
		max-width:400px;

		width:calc(100% - 80px);
		margin:0 auto;
	}


</style>
