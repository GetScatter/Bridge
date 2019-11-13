<template>
	<section class="pop-out-head">
		<section class="details">
			<figure class="logo scatter-logologo"></figure>
		</section>
		<section class="actions">

			<figure class="close icon-cancel" @click="$emit('closed')"></figure>
		</section>
	</section>
</template>

<script>
	import { mapActions, mapGetters, mapState } from 'vuex'

	export default {
		components:{

		},
		computed:{
			...mapGetters([
				'identities',
			])
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss">
	@import "../../styles/variables";

	.pop-out-head {
		-webkit-app-region: drag;
		position: relative;
		z-index: 2;
		flex:0 0 auto;
		height:40px;
		width:100%;
		display:flex;
		justify-content: space-between;
		align-items: center;
		padding:0 0 0 10px;
		border:1px solid $darkblue;
		border-bottom:0;
		background:$blue;

		.details {
			-webkit-app-region: drag;
			flex:2;

			.logo {
				font-family: 'Grand Hotel', sans-serif;
				font-size: 24px;
				color: white;
			}
		}

		.actions {
			-webkit-app-region: no-drag;
			display:flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;


			.close {
				cursor: pointer;
				text-align:right;
				padding:0 10px;
				font-size: 18px;
				color:rgba(255,255,255,0.4);
				line-height:90px;
				height:90px;

				&:hover {
					color:white;
				}
			}
		}


	}

</style>
