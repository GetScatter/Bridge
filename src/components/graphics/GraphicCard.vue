<template>
	<section class="card">
		<!--<figure class="plus" v-if="plus">+</figure>-->

		<figure class="cc">CC</figure>
		<figure class="number"><div>****</div> <div>****</div> <div>****</div> <div>1234</div></figure>
		<figure class="expiry">12/24</figure>
		<figure class="name">John Doe</figure>
	</section>
</template>

<script>
	export default {
		props:['plus']
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.card {
		text-align:left !important;
		width:250px;
		height:140px;
		background:$light;
		border-radius:10px;
		position: relative;
		float:left;
		margin-right:50px;
		padding:22px 24px 20px;
		box-shadow: 0 8px 0 #f8f8f8;

		.plus {
			position: absolute;
			width:30px;
			height:30px;
			border-radius: 50%;
			border:2px solid $light;
			font-size: 20px;
			right:-15px;
			top:30px;
			background:$blue;
			display:flex;
			justify-content: center;
			align-items: center;
			color:#fff;

			transition:$themetransition;
			transition-property: border;
		}

		.cc {
			font-size: 24px;
			font-weight: bold;
			color:$blue;
		}

		$card-text-shadow:0 1px 1px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1), 0 -1px 2px rgba(255,255,255,0.1);

		.number {
			color:$black;
			margin-top:25px;
			width:100%;
			text-shadow: $card-text-shadow;
			overflow: hidden;
			margin-bottom:15px;

			div {
				width:25%;
				float:left;
			}
		}

		.expiry {
			color:$black;
			width:50%;
			float:left;
			text-shadow: $card-text-shadow;
			font-size: 11px;
		}

		.name {
			color:$black;
			width:50%;
			float:right;
			text-align: right;
			text-shadow: $card-text-shadow;
			font-size: 11px;
		}
	}
</style>
