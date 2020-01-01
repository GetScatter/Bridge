<template>
	<section>
		<section v-if="!loading && trending" class="dash-action-template">
			<figure class="bg">
				<img :src="image" />
			</figure>
			<section class="image">
				<svg viewBox="0 0 130 130" width="130" height="130">

					<defs>
						<clipPath id="shape">
							<path fill="none" d="m63.854452,5.883277c0,0 -30.116707,7.257
							-49.361404,41.09565c-19.244696,33.838649 1.448157,81.612484
							35.749687,76.981981c34.301529,-4.630488 89.021735,-22.281858 69.692005,
							-67.142173c-19.329731,-44.860314 -47.731769,-49.970762 -50.635598,
							-50.35664c-2.903829,-0.385878 -5.444689,-0.578817 -5.444689,-0.578817z"/>
						</clipPath>
					</defs>

					<image clip-path="url(#shape)"  :xlink:href="image" x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />

				</svg>
			</section>

			<section class="details">
				<figure class="above-title">
					<!--<img class="icon" src="assets/everipedia.png" />-->
					Trending on Everipedia
				</figure>
				<figure class="title">{{trending.page_title}}</figure>
				<figure class="text">{{text.substr(0, 150)}}</figure>
				<Button @click.native="viewArticle" primary="1" text="Read More"/>
				<Button @click.native="randomize" icon="fa fa-sync-alt" />
			</section>
		</section>

		<section v-if="loading" class="dash-action-template loading">
			<i class="fa fa-spinner animate-spin"></i>
		</section>
	</section>

</template>

<script>
	import { mapState } from 'vuex'

	import GraphicCard from '../graphics/GraphicCard';
	import EveripediaAPI from "../../services/special/EveripediaAPI";

	export default {
		data(){return {
			trending:null,
			loading:true,
		}},
		computed:{
			text(){
				if(!this.trending) return;
				let text = this.trending.page_body;
				text = text.replace(/\*\*/g, '');
				text = text.replace(/__/g, '');
				return text.split('[[')[0] + text.split('[[').map(x => {
					let s = '';
					if(x.indexOf(']]') > -1){
						const m = x.split(']]');
						if(m[0].indexOf('|http') === -1){
							const pipes = m[0].split('|');
							s = pipes[pipes.length-1] + m[1];
						}
					}

					return s;
				}).join('');
			},
			slug(){
				if(!this.trending) return;
				return this.trending.slug;
			},
			image(){
				if(!this.trending) return;
				return this.trending.main_photo;
			}
		},
		mounted(){
			this.randomize();
		},
		methods:{
			viewArticle(){
				this.openInBrowser(`https://everipedia.org/${this.slug}`)
			},
			randomize(){
				this.loading = true;
				EveripediaAPI.getTrending().then(res => {
					this.loading = false;
					if(!res) return console.error('No everipedia trending?');
					this.trending = res;
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.dash-action-template {
		border:0;
	}

	.bg {
		position:absolute;
		top:-100px;
		bottom:-100px;
		left:-100px;
		right:-100px;
		z-index:-1;
		opacity:0.05;
		transform:rotateZ(-30deg);

		img {
			object-fit: cover;
			width:130%;
			height:130%;
		}

	}

	.above-title {
		display:flex;
		align-items: center;
	}

	.icon {
		$x:18px;
		width:$x;
		height:$x;
		margin-right:5px;
	}


</style>
