<template>
	<section class="allow-popups">

		<section class="popup-content">

			<figure class="title">You need to allow popups</figure>
			<figure class="sub-title">In order for Scatter to work from external applications, you will need to allow popups.</figure>

			<figure class="line"></figure>

			<p v-if="isMobile">
				<b>
					A popup was just blocked by your browser.
					Click the allow button below to enable this on mobile.
				</b>
			</p>

			<p v-else>
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
		</section>

	</section>
</template>

<script>

	import {mapState} from "vuex";
	import WindowService from "../../services/utility/WindowService";

	export default {
		props:['popin', 'closer'],
		data(){return {
			interval:null,
		}},
		computed:{
			...mapState([
				'isMobile',
			])
		},
		mounted(){
			setTimeout(() => {
				this.testPopup()
			}, 5000);
		},
		destroyed(){
			clearInterval(this.interval);
		},
		methods:{
			testPopup(){
				if(!WindowService.arePopupsBlocked()) return this.closer(true);
				this.interval = setInterval(() => {
					if(!WindowService.arePopupsBlocked()) return this.closer(true);
				}, 5000);
			}
		},
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.allow-popups {
		max-width:400px;

		width:calc(100% - 80px);
		margin:0 auto;
		
		.sub-title {
			margin-top:-20px;
		}

		.line {
			margin-top:40px;
			margin-bottom:40px;
		}

		.click-me {
			width:100%;
		}
	}


</style>