<template>
	<section class="show-terms">

		<section class="popup-content">

			<figure class="title">You need to allow popups</figure>
			<figure class="sub-title">In order for Scatter to work from external applications, you will need to allow popups.</figure>

			<figure class="line"></figure>


			<p>
				<b>
					A popup was just blocked by your browser. Click the notification in your browser and allow popups from Scatter.
				</b>
				<br>
				<br>
				The notification is usually in the top right of the screen, in the <b>link bar</b>.
			</p>

		</section>

		<section class="popup-buttons">
			<Button @click.native="() => closer(null)" text="Cancel" />
			<Button @click.native="() => closer(true)" text="Accept Terms" />
		</section>

	</section>
</template>

<script>

	import {mapState} from "vuex";


	export default {
		props:['popin', 'closer'],
		data(){return {

		}},
		computed:{
			...mapState([
				'isMobile',
			])
		},
		mounted(){

		},
		destroyed(){

		},
		methods:{

		},
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.show-terms {
		max-width:400px;

		width:calc(100% - 80px);
		margin:0 auto;


	}


</style>
