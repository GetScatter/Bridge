<template>
	<section class="view-app-ratings">

		<section class="popup-content">
			<section :class="{'logos':!!app.img}">
				<figure class="logo">
					<img v-if="app.img" :src="app.img" />
				</figure>
			</section>
			<figure class="title"><b>{{app.name}}</b></figure>

			<section v-if="state === STATES.VIEW">

				<figure class="sub-title">{{app.description}}</figure>

				<section class="ratings">
					<section class="stars" @mouseout="star = null" :class="{'active':star !== null}">
						<figure class="star fas fa-star" @click="clickStar(i)" @mouseover="hoverStar(i)" :class="{'active':star !== null ? star >= i : i <= rating}" v-for="i in [1,2,3,4,5]"></figure>
					</section>
					<span class="notice">Ratings aren't live yet, this is just a placeholder!</span>
					<span>Help keep Scatter users safe by adding your own rating to <b>{{app.name}}</b>, just tap a star to start.</span>
				</section>
			</section>

			<section v-if="state === STATES.RATE">
				<section class="ratings less-margin">
					<section class="stars active">
						<figure class="star fas fa-star" :class="{'active':star >= i}" v-for="i in [1,2,3,4,5]"></figure>
					</section>
					<br />
					<Input style="margin-bottom:0;" textarea="1" :placeholder="`Do you want to let the world know why you think ${app.name} deserves a ${star} star rating?`" />
				</section>
			</section>

			<section v-if="state === STATES.RATED">
				<figure class="sub-title">Your rating has been sent to the network!</figure>
				<section class="ratings">
					<section class="stars active">
						<figure class="star fas fa-star" :class="{'active':star >= i}" v-for="i in [1,2,3,4,5]"></figure>
					</section>
					<span>You have given {{app.name}} a {{star}} star rating. Thanks for your help!</span>
				</section>
			</section>


		</section>

		<section class="popup-buttons" v-if="state === STATES.VIEW">
			<Button @click.native="closer(null)" text="Close" />
			<Button primary="1" @click.native="open" text="Open App" icon="fas fa-star" />
		</section>

		<section class="popup-buttons" v-if="state === STATES.RATE">
			<Button :disabled="submittingRating" @click.native="clearRating" text="Back" />
			<Button :loading="submittingRating" primary="1" @click.native="submitRating" text="Submit Rating" icon="fas fa-external-link-square" />
		</section>

		<section class="popup-buttons" v-if="state === STATES.RATED">
			<Button @click.native="closer(null)" primary="1" text="Close" />
		</section>

	</section>
</template>

<script>
	import {mapGetters} from "vuex";

	const STATES = {
		VIEW:'view',
		RATE:'rate',
		RATED:'rated',
	}

	export default {
		props:['popin', 'closer'],
		data(){return {
			state:STATES.VIEW,
			STATES,

			star:null,
			rating:4,
			submittingRating:false,
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
			},
			hoverStar(i){
				this.star = i;
			},
			clickStar(i){
				this.star = i;
				this.state = STATES.RATE;
			},
			clearRating(){
				this.star = null;
				this.state = STATES.VIEW;
			},
			async submitRating(){
				this.submittingRating = true;
				await new Promise(r => setTimeout(() => {r(true)}, 2000));
				this.state = STATES.RATED;
				this.submittingRating = false;
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
			margin-top:-20px;
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
			width:calc(100% - 10px);
			max-height:calc(100% - 10px);
			object-fit: contain;
			overflow:hidden;
			border-radius:16px;
		}
	}

	.ratings {
		margin-top:50px;

		&.less-margin {
			margin-top:20px;
		}

		.stars {

			.star {
				color:$grey;
				font-size: 28px;
				padding:0 4px;
				cursor: pointer;

				&.active {
					color:$blue;
				}
			}

			&.active {
				.star {
					&.active {
						color:$red;
					}
				}
			}
		}

		span {
			cursor: pointer;
			margin:0 auto;
			display: table;
			padding:15px 35px 0;
			font-size: $font-size-tiny;

			&.notice {
				color:red;
			}
		}
	}

	.blue-steel {
		.ratings {
			.stars {
				&.active {
					.star {
						&.active {
							color:yellow;
						}
					}
				}
			}
		}
	}


</style>
