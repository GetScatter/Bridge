<template>
	<section>

		<section class="snackbar" @click="close">
			<figure class="message">{{item.message}}</figure>
		</section>

	</section>
</template>

<script>
	import { mapActions, mapGetters, mapState } from 'vuex'
	import * as Actions from '../../store/ui_actions';

	export default {
		computed:{
			item(){
				return this.popup.data.props;
			}
		},
		methods:{
			close(){
				this[Actions.RELEASE_POPUP](this.popup)
			},
			...mapActions([
				Actions.RELEASE_POPUP
			])
		},
		props:['popup']
	}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
	@import "../../styles/variables";

	.snackbar {
		cursor: pointer;
		pointer-events:auto;
		display:inline-block;
		margin-top:10px;
		color:white;
		padding:10px 0;
		border-radius:4px;
		text-align:left;

		background:$blue-gradient;
		border:1px solid $darkblue;

		animation: wiggle-snackbar 3s ease infinite;

		.message {
			vertical-align: middle;
			display:inline-block;
			color:white;
			font-size:13px;
			font-weight: bold;
			padding:0 20px;

		}

		@keyframes wiggle-snackbar {
			0%, 18%, 30%, 100% { transform:rotateZ(0deg); }
			20% { transform:rotateZ(2deg); }
			22% { transform:rotateZ(-2deg); }
			25% { transform:rotateZ(2deg); }
			28% { transform:rotateZ(-2deg); }
		}
	}

	.telos .snackbar {
		background:$purple-gradient;
		border:1px solid $purple;
	}

</style>