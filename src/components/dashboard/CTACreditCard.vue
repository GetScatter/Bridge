<template>
	<section class="cta-cc">
		<section class="card">
			<figure class="plus">+</figure>

			<figure class="cc">CC</figure>
			<figure class="number"><div>****</div> <div>****</div> <div>****</div> <div>1234</div></figure>
			<figure class="expiry">12/24</figure>
			<figure class="name">John Doe</figure>
		</section>

		<section class="details">
			<figure class="title">Easier <b>Blockchain</b></figure>
			<figure class="text">
				Add a credit card to Scatter and open up direct token purchases as well as other awesome functionality.
			</figure>
			<Button text="Add a Credit Card"/>
		</section>
	</section>
</template>

<script>
	import { mapState } from 'vuex'

	export default {
		computed:{

		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.cta-cc {
		overflow: hidden;

		.card {
			width:250px;
			height:140px;
			background:$blue-gradient;
			border-radius:10px;
			position: relative;
			float:left;
			margin-right:50px;
			padding:22px 24px 20px;

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

				transition:all 1s ease;
				transition-property: border;
			}

			.cc {
				font-size: 24px;
				font-weight: bold;
				color:#fff;
			}

			$card-text-shadow:0 2px 2px rgba(0,0,0,0.3);

			.number {
				color:#fff;
				margin-top:30px;
				width:100%;
				text-shadow: $card-text-shadow;
				overflow: hidden;
				margin-bottom:10px;

				div {
					width:25%;
					float:left;
				}
			}

			.expiry {
				color:#fff;
				width:50%;
				float:left;
				text-shadow: $card-text-shadow;
				font-size: 11px;
			}

			.name {
				color:#fff;
				width:50%;
				float:right;
				text-align: right;
				text-shadow: $card-text-shadow;
				font-size: 11px;
			}
		}

		.title {
			font-size: 28px;
			font-weight: bold;

			b {
				color:$blue;
				font-weight: 800;
			}
		}

		.text {
			color:$grey;
			font-size: 13px;
			margin-top:10px;
			margin-bottom:20px;
		}
	}

	.blue-steel {
		.cta-cc {
			.card {
				.plus {
					border:2px solid $dark;
				}
			}
		}
	}

	.mobile {
		.cta-cc {
			overflow: hidden;
			text-align:center;

			.card {
				text-align:left;
				float:none;
				margin:0 auto;
			}

			.title {
				display:inline-block;
				width:100%;
				margin-top:20px;
			}

			.text {
				display:inline-block;
				width:100%;
			}

			button {
				display:inline-block;
			}
		}
	}


</style>
