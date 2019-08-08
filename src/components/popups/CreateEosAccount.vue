<template>
	<section class="create-eos-account transfer">

		<section class="popup-content">
			<figure class="title"><span>Creating</span> an account for {{network.name}}</figure>
			<figure class="sub-title">
				{{network.name}} accounts require various resources in order to use.
				Because of this, you will have to pay a small fee to create your account.
				<br>
				<br>
				<figure class="line"></figure>
				<br>
				<br>
				<b>Creation will cost 0.5 {{network.systemToken().symbol}}</b>
			</figure>
		</section>

		<section class="popup-buttons">
			<Button secondary="1" @click.native="() => closer(null)" text="Cancel" />
			<Button primary="1" @click.native="buyAccount" text="Pay with Card" />
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
			buyAccount(){
				PopupService.push(Popups.buyTokens(this.network.systemToken(), 0.5));
			}
		},

	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.create-eos-account {
		max-width:400px;
		width:100%;
	}

</style>