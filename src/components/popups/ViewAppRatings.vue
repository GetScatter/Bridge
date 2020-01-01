<template>
	<section class="view-app-ratings">

		<section class="popup-content">

			<section :class="{'logos':!!app.img}">
				<figure class="logo">
					<img v-if="app.img" :src="app.img" />
				</figure>
			</section>
			<figure class="title"><b>{{app.name}}</b></figure>
			<figure class="app-type">{{app.type}}</figure>
			<figure class="sub-title">{{app.description}}</figure>

			<!--<section class="ratings">-->
				<!--<section class="stars">-->
					<!--<figure class="star fas fa-star" :class="{'active':i < 5}" v-for="i in [1,2,3,4,5]"></figure>-->
				<!--</section>-->
				<!--<span>Give <b>{{app.name}}</b> a rating</span>-->
			<!--</section>-->
		</section>

		<section class="popup-buttons">
			<Button @click.native="() => closer(null)" text="Close" />
			<Button primary="1" @click.native="open" text="Open App" icon="fas fa-external-link-square" />
		</section>

	</section>
</template>

<script>


	import {mapGetters} from "vuex";

	export default {
		props:['popin', 'closer'],
		data(){return {

		}},
		computed:{
			app(){
				return this.popin.data.props.app
			},
		},
		methods:{
			open(){
				this.openInBrowser(this.app.url);
				this.closer(true);
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.view-app-ratings {
		max-width:400px;

		width:calc(100% - 80px);
		margin:0 auto;

		.app-type {
			margin-top:-20px;
			font-size: $font-size-small;
		}

		.sub-title {
			margin-top:10px;
			font-size: $font-size-standard;
		}

	}

	.logos {
		display:flex;
		justify-content: space-evenly;
		align-items: center;
		position: relative;
		width:100%;
		margin-bottom:20px;

		&:after {
			content:'';
			position: absolute;
			display:block;
			top:50%;
			left:-40px;
			right:-40px;
			height:1px;
			background:$borderlight;
			z-index:-1;
		}
	}

	.logo {
		background:$light;
		position: relative;
		width:100px;
		height:100px;
		display:flex;
		justify-content: center;
		align-items: center;
		border-radius:20px;
		font-weight: bold;

		img {
			width:100px;
			height:100px;
			overflow: hidden;
			border-radius:20px;
		}
	}

	.ratings {
		margin-top:50px;

		.stars {

			.star {
				color:$grey;
				font-size: 28px;
				padding:0 4px;

				&.active {
					color:$blue;
				}
			}
		}

		span {
			cursor: pointer;
			margin:0 auto;
			display: table;
			padding:15px 15px 0 15px;
			font-size: $font-size-small;

			&:hover {
				color:$blue;
			}
		}
	}


</style>
