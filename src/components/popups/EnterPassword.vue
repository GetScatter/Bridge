<template>
	<section class="enter-password transfer">


		<section class="popup-content" v-if="!confirm">
			<figure class="title">Enter your <span>password</span></figure>
			<figure class="sub-title">Your password is used to keep your data safe. Only you can access it.</figure>

			<br><br>
			<figure class="line"></figure>
			<br><br>

			<Input style="margin-bottom:0;" big="1" :text="password" v-on:changed="x => password = x" type="password" />
		</section>

		<section class="popup-content" v-if="confirm">
			<figure class="title" style="margin-bottom:10px;">Enter a <span>password</span></figure>
			<figure class="sub-title">Your personal information never leaves your device, and this password helps keep it safe.</figure>

			<br><br>
			<figure class="line"></figure>
			<br><br>

			<Input big="1" label="Password" :text="password" v-on:changed="x => password = x" type="password" />
			<Input style="margin-bottom:0;" label="Confirm your Password" :text="confirmPassword" v-on:changed="x => confirmPassword = x" type="password" />
		</section>




		<section class="popup-buttons">
			<Button @click.native="() => closer(null)" text="Cancel" />
			<Button primary="1" @click.native="checkAndReturn" text="Continue" />
		</section>

	</section>
</template>

<script>
	import "../../styles/transfers.scss";
	import Popups from "../../util/Popups";
	import PopupService from "../../services/utility/PopupService";

	export default {
		props:['popin', 'closer'],
		data(){return {
			password:'',
			confirmPassword:''
		}},
		created(){

		},
		computed:{
			confirm(){
				return this.popin.data.props.confirm
			}
		},
		methods:{
			checkAndReturn(){
				if(!this.password.trim().length) return;
				if(this.confirm && this.confirmPassword !== this.password) return PopupService.push(Popups.snackbar("Password confirmation does not match."));
				return this.closer(this.password);
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.enter-password {
		max-width:400px;
		width:calc(100% - 80px);
		margin:0 auto;

		.sub-title {
			margin-top:10px;
		}
	}


</style>
