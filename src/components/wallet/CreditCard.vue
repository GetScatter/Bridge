<template>
	<section class="credit-card panel-head panel-pad limiter">

		<GraphicCard />
		<section class="details">
			<figure class="title">Credit Card</figure>
			<figure class="description">Your card is saved locally on your machine and never exposed to third party applications.</figure>
			<Button text="Remove Card"/>
		</section>

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
		text-align:left;
		display:flex;
		align-items: center;

		.card {
			display:inline-block;
			margin:0 auto;
			margin-top:30px;
			float:none;
		}

		button {
			margin-top:20px;

		}

		.details {
			padding-left:20px;

			.title {
				font-family: 'Poppins', sans-serif;
			}
		}
	}

</style>