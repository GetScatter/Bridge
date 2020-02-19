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

				<section class="ratings" v-if="ridlIsAvailable">
					<section class="stars" @mouseout="star = null" :class="{'active':star !== null}">
						<figure class="star fas fa-star" @click="clickStar(i)" @mouseover="hoverStar(i)" :class="{'active':star !== null ? star >= i : i <= rating}" v-for="i in stars"></figure>
					</section>
					<span class="notice" v-if="!overall">This app doesn't have any ratings yet!</span>
					<span v-if="usingIdentity">Help keep Scatter users safe by adding your own rating to <b>{{app.name}}</b>, just tap a star to start.</span>
					<span class="clickable" v-if="ridlIsAvailable && !usingIdentity" @click="goToIdentity"><u>You don't have a registered digital identity yet.</u></span>

				</section>

				<section class="ratings" v-if="ridlIsAvailable === null">
					<span class="">Loading ratings <i class="fa fa-spinner animate-spin"></i></span>
				</section>
			</section>

			<section v-if="state === STATES.RATE">
				<section class="ratings less-margin">
					<section class="stars active">
						<figure class="star fas fa-star" :class="{'active':star >= i}" v-for="i in stars"></figure>
					</section>
					<br />
					<Input style="margin-bottom:0;" textarea="1" :placeholder="`Do you want to let the world know why you think ${app.name} deserves a ${star} star rating?`" v-on:changed="x => details = x" />
				</section>
			</section>

			<section v-if="state === STATES.RATED">
				<figure class="sub-title">Your rating has been sent to the network!</figure>
				<section class="ratings">
					<section class="stars active">
						<figure class="star fas fa-star" :class="{'active':star >= i}" v-for="i in stars"></figure>
					</section>
					<span>You have given {{app.name}} a {{star}} star rating. Thanks for your help!</span>
				</section>
			</section>


		</section>

		<section class="popup-buttons" v-if="state === STATES.VIEW">
			<Button @click.native="closer(null)" text="Close" />
			<Button primary="1" @click.native="open" text="Open App" icon="fas fa-rocket" />
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
	import {mapGetters, mapState} from "vuex";
	import RidlService from "../../services/utility/RidlService";
	import PopupService from "../../services/utility/PopupService";
	import Popups from "../../util/Popups";

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
			stars:[1,2,3,4,5],

			star:null,
			rating:0,
			submittingRating:false,
			reputation:null,
			details:'',
			ridlIsAvailable:null,
		}},
		computed:{
			...mapState([
				'scatter',
			]),
			app(){
				return this.popin.data.props.app
			},
			overall(){
				return {value:20};
				if(!this.reputation || !this.reputation.fragments) return null;
				return this.reputation.fragments.find(x => x.type === 'overall');
			},
			identity(){
				return this.scatter.keychain.identities[0];
			},
			usingIdentity(){
				return this.identity.ridl.toString().indexOf('::') > -1;
			}
		},
		async mounted(){
			this.ridlIsAvailable = this.featureFlags.ridl ? await RidlService.isAvailable() : false;
			if(this.ridlIsAvailable) {
				this.reputation = await RidlService.getAppReputation(this.app);
				if (this.reputation) {
					if (this.overall) {
						this.rating = this.overall.value / 5;
					} else this.rating = null;
					this.$forceUpdate();
				}
			}
		},
		methods:{
			goToIdentity(){
				this.$router.push({name:this.RouteNames.Identity, query:{type:'digital'}});
				this.closer(true);
			},
			open(){
				this.openInBrowser(this.app.url);
				this.closer(true);
			},
			hoverStar(i){
				this.star = i;
			},
			clickStar(i){
				if(!this.usingIdentity) return;
				this.star = i;
				this.state = STATES.RATE;
			},
			clearRating(){
				this.star = null;
				this.state = STATES.VIEW;
			},
			async submitRating(){
				let tokens = 0.2;
				let value = 0;

				switch(this.star){
					case 1: tokens = 1; break;
					case 2: tokens = 0.5; break;
					case 3: tokens = 0.2; break;
					case 4: tokens = 0.5; break;
					case 5: tokens = 1; break;
				}

				tokens = `${parseFloat(tokens).toFixed(4)} RIDL`;

				switch(this.star){
					case 1:
					case 2:
						value = -1;
						break;
					case 3:
					case 4:
					case 5:
						value = 1;
						break;
				}

				const entity = `app::${this.app.applink}`;
				const fragments = [{type:'overall', value}];

				this.submittingRating = true;
				const ridlId = await RidlService.findIdentity(this.identity.name);
				if(!ridlId) {
					console.error(ridlId);
					return PopupService.push(Popups.snackbar('Could not find identity!'));
				}
				const result = await RidlService.repute(ridlId.id, entity, fragments, tokens, ridlId.chain, this.details, this.identity.publicKey);
				if(result){
					this.state = STATES.RATED;
				}

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
			margin:0 auto;
			display: table;
			padding:15px 35px 0;
			font-size: $font-size-tiny;

			&.notice {
				color:$blue;
			}

			&.clickable {
				text-decoration: underline;
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
