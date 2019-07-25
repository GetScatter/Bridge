<template>
	<section class="top-actions" :style="{'color':topActionsColor}">
		<section class="balance">$8,000.00</section>
		<section>
			<figure class="icon" @click="changeTheme"><i class="fas fa-cog"></i></figure>
			<figure class="icon"><i class="far fa-bell"></i></figure>
		</section>
	</section>
</template>

<script>
	import { mapState, mapActions } from 'vuex'
	import * as UIActions from "../store/ui_actions";

	export default {
		computed:{
			...mapState([
				'topActionsColor'
			])
		},
		mounted(){
			console.log(this.topActionsColor);
		},
		methods:{

			changeTheme(){
				const theme = this.theme === this.THEMES.DARK
					? this.THEMES.LIGHT
					: this.THEMES.DARK
				this[UIActions.SET_THEME](theme);
			},

			...mapActions([
				UIActions.SET_THEME
			])
		}
	}
</script>

<style scoped lang="scss">
	@import "../styles/variables";

	.top-actions {
		height:$topactions;
		padding:30px;
		display:flex;
		max-width:$maxwidth;
		margin:0 auto;
		position: relative;
		z-index:2;

		section {
			width:50%;

			&:last-child {
				text-align:right;
			}
		}

		.balance {
			font-size: 28px;
			font-weight: bold;
		}

		.icon {
			cursor: pointer;
			float:right;
			margin-left:30px;
			font-size: 22px;

			&:hover {
				color:$blue;
			}
		}
	}


</style>
