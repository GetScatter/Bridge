<template>
	<section>
		<section v-if="!loading && trending" class="dash-action-template dash-article">

			<section class="dash-action-template-header">
				<figure class="everipedia">
					<img src="@/assets/everipedia.svg" alt="">
				</figure>
				<figure class="above-title">
					Trending on Everipedia
				</figure>
			</section>

			<section class="dash-action-template-content">
				<figure class="bg">
					<img :src="image" />
				</figure>
				<section>
					<figure class="title">{{trending.page_title}}</figure>
					<figure class="text">{{text.substr(0, 150)}}</figure>
				</section>
			</section>

			<section class="dash-action-template-footer">
				<Button @click.native="viewArticle" primary="1" text="Read More"/>
				<Button @click.native="randomize" primary="1" text="Next article"/>
			</section>

		</section>

		<section v-if="loading" class="dash-article dash-action-template loading">
			<section class="dash-action-template-header">
				<figure class="everipedia">
					<img src="@/assets/everipedia.svg" alt="">
				</figure>
				<figure class="above-title">
					Trending on Everipedia
				</figure>
			</section>
			<section class="dash-action-template-content">
				<i class="fa fa-spinner animate-spin"></i>
			</section>
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

	.dash-article {
		background-image: linear-gradient(180deg, rgba($blue,0.00) 0%, rgba(white,1));

		.bg {
			position:absolute;
			width:100%;
			height:auto;
			z-index:-1;
			opacity:0.25;
			margin:-2rem;

			img {
				object-fit: cover;
				width:100%;
				height:100%;
			}
		}

		border-radius: 20px;

		.details {
			line-height: 1rem;
			overflow-y: auto;
		}

		.dash-action-template-content i, .title, .text {

		}

	}

	.blue-steel {
		.dash-article {
			background-image: linear-gradient(180deg, rgba(0,0,0,0) 0% 12%, #021b2ecc 95%);
		}
	}



</style>
