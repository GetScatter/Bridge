<template>
	<section class="no-account">

		<section class="popup-content">

			<figure class="title">No <span>{{network.name}}</span> account</figure>
			<figure class="sub-title">
				The application you are trying to use requires an account for the {{network.name}}.
				You must create one first.
			</figure>

		</section>

		<section class="popup-buttons">
			<Button @click.native="() => closer(null)" text="Later" />
			<Button primary="1" @click.native="create" text="Create Account" />
		</section>

	</section>
</template>

<script>
	import Popups from "../../util/Popups";
	import PopupService from "../../services/utility/PopupService";

	export default {
		props:['popin', 'closer'],
		data(){return {

		}},
		computed:{
			network(){
				return this.popin.data.props.network;
			},
		},
		methods:{
			create(){
				PopupService.push(Popups.createEosAccount(this.network, x => this.closer(x)));
			},
		},
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.no-account {
		max-width:400px;

		width:calc(100% - 80px);
		margin:0 auto;
	}


</style>
