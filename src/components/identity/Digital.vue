<template>
	<section class="digital panel-pad limiter">
		<section class="panel-head">
			<figure class="icon"><i class="fas fa-fingerprint"></i></figure>
			<figure class="title">Digital Identity</figure>
			<figure class="description">Your digital identity is your online presence.</figure>
		</section>

		<br>
		<br>
		<br>
		<Input big="1" label="Online Username" />
		<section class="claim-username">
			<figure class="description">This username is available</figure>
			<Button text="Claim Username" />
		</section>

		<br>
		<br>
		<br>
		<figure class="line"></figure>
		<br>
		<br>
		<br>



		<section class="avatar">
			<section class="details">
				<figure class="title">Avatar</figure>
				<figure class="description">Applications you're interacting with can choose to display this image.</figure>
				<Button text="Choose File" />
			</section>
			<figure class="image"><i class="fas fa-camera-retro"></i></figure>
		</section>

		<br>
		<br>
		<br>
		<br>
		<br>
		<br>
	</section>
</template>

<script>

	export default {
		components:{

		}

	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.digital {


		.claim-username {
			margin-top:-10px;
			display:flex;
			justify-content: space-between;
			align-items: center;

			.description {
				font-size: 11px;
				font-weight: bold;
				color:$grey;
			}

			button {
				margin:0;
			}
		}

		.avatar {
			display:grid;
			grid-template-columns:auto 150px;

			@media (max-width:$breakpoint-tablet){
				display:flex;
				flex-direction:column;
			}

			.image {
				flex:0 0 auto;
				width:150px;
				height:100px;
				border-radius:4px;
				display:flex;
				justify-content: center;
				align-items: center;
				font-size: 24px;
				background-color:$blue;
				color:#fff;

				@media (max-width:$breakpoint-tablet){
					width:100%;
					margin-top:20px;
				}
			}

			.details {
				text-align:left;

				.title {
					font-size: 16px;
					font-weight: bold;
				}

				.description {
					margin-top:5px;
					font-size: 11px;
					color:$grey;
				}

				button {
					margin-top:10px;
				}
			}
		}
	}

</style>