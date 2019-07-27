<template>
	<section class="credit-card panel-pad limiter">
		<figure class="icon"><i class="fas fa-money-bill-wave-alt"></i></figure>
		<figure class="title">Credit Card</figure>
		<figure class="description">Your card is saved locally on your machine and never exposed to third party applications.</figure>
		<GraphicCard />
		<Button text="Remove Card"/>

		<br>
		<br>
		<br>
	</section>
</template>

<script>
	import GraphicCard from '../graphics/GraphicCard'

	export default {
		components:{
			GraphicCard,
		}

	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.credit-card {
		text-align:center;

		.icon {
			width:68px;
			height:68px;
			background:$blue;
			border-radius:50%;
			margin:0 auto;
			color:#fff;
			display:flex;
			justify-content: center;
			align-items: center;
		}

		.title {
			margin-top:20px;
			font-size: 24px;
			font-weight: bold;
		}

		.description {
			margin-top:5px;
			font-size: 13px;
			font-weight: bold;
			color:$grey;
		}

		.card {
			display:inline-block;
			margin:0 auto;
			margin-top:30px;
			float:none;
		}

		button {
			margin:0 auto;
			margin-top:30px;

		}
	}

</style>