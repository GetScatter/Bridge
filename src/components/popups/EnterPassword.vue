<template>
	<section class="enter-password transfer">


		<section class="popup-content" v-if="!confirm">
			<figure class="title">Enter your <span>password</span></figure>
			<Input big="1" :text="password" v-on:changed="x => password = x" type="password" />
		</section>

		<section class="popup-content" v-if="confirm">
			<figure class="title" style="margin-bottom:10px;">Enter a <span>password</span></figure>
			<figure class="sub-title">Your personal information never leaves your device, and this password helps keep it safe.</figure>

			<br>
			<br>

			<Input big="1" label="Password" :text="password" v-on:changed="x => password = x" type="password" />
			<Input label="Confirm your Password" :text="confirmPassword" v-on:changed="x => confirmPassword = x" type="password" />
		</section>




		<section class="popup-buttons">
			<Button secondary="1" @click.native="closer" text="Cancel" />
			<Button @click.native="checkAndReturn" text="Okay" />
		</section>

	</section>
</template>

<script>
	import "../../styles/transfers.scss";

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
				if(!this.password.length) return;
				if(this.confirm && this.confirmPassword !== this.password) return; // TODO: Add err msg
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