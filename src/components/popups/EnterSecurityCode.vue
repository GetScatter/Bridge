<template>
	<section class="enter-security-code transfer">

		<section class="popup-content">
			<figure class="title" style="margin-bottom:10px;">Enter a security code</figure>
			<figure class="sub-title">{{text}}</figure>

			<br>
			<br>

			<Input big="1" label="Security Code" :text="code" v-on:changed="x => code = x" />
		</section>


		<section class="popup-buttons">
			<Button @click.native="() => closer(null)" text="Cancel" />
			<Button @click.native="closer(code)" text="Okay" />
		</section>

	</section>
</template>

<script>
	import "../../styles/transfers.scss";

	export default {
		props:['popin', 'closer'],
		data(){return {
			code:'',
		}},
		created(){

		},
		computed:{
			text(){
				return this.popin.data.props.text
			}
		},
		methods:{

		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.enter-security-code {
		max-width:400px;
		width:calc(100% - 80px);
		margin:0 auto;

		.sub-title {
			margin-top:10px;
		}
	}


</style>