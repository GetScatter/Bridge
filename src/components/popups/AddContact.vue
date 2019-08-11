<template>
	<section class="add-contact">

		<section class="popup-content">

			<figure class="title">Adding a new <span>contact</span></figure>

			<Input big="1" label="Give this contact a name" :text="name" v-on:changed="x => name = x" />
			<Input style="flex:1;"  textarea="1" label="Add a note about this contact" :text="note" v-on:changed="x => note = x" />

			<br>
			<figure class="line"></figure>

			<Input style="margin-top:30px; margin-bottom:0;" label="This is the contact's address / account name" :text="recipient" disabled="1" />
		</section>

		<section class="popup-buttons">
			<Button secondary="1" @click.native="() => closer(null)" text="Cancel" />
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
			recipient(){
				return this.popin.data.props.recipient
			}
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
					note:this.note
				});
				const err = await ContactService.addOrUpdate(contact);

				if(err && err.hasOwnProperty('error')){
					// TODO: How are we handling errors in popups?
					console.log('error', err, contact);
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