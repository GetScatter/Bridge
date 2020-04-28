<template>
	<section class="select-list">

		<section class="popup-content">
			<figure class="title" v-html="title"></figure>
			<figure class="sub-title" style="margin-top:-20px;">{{subTitle}}</figure>

			<section class="list-container">
				<section class="list-item" v-for="item in list" @click="closer(item)">
					<figure class="item-name">{{listParser(item)}}</figure>
				</section>
			</section>
		</section>

		<section class="popup-buttons">
			<Button @click.native="closer(null)" text="Cancel" />
		</section>

	</section>
</template>

<script>
	import Popups from "../../util/Popups";
	import PopupService from "../../services/utility/PopupService";

	export default {
		props:['popin', 'closer'],
		data(){return {

		}},
		computed:{
			title(){
				return this.popin.data.props.title;
			},
			subTitle(){
				return this.popin.data.props.subTitle;
			},
			list(){
				return this.popin.data.props.list;
			},
			listParser(){
				return this.popin.data.props.listParser;
			},
		},
		methods:{

		},
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.select-list {
		max-width:380px;
		width:calc(100% - 80px);
		margin:0 auto;

		.sub-title {
			font-size: $font-size-small;
		}

		.list-container {
			width:calc(100% + 40px);
			max-height:250px;
			overflow-y: auto;
			margin:30px -20px 0;
			padding:0 20px;

			.list-item {
				display:flex;
				align-items: center;
				width:100%;
				justify-content: space-between;
				padding:10px;
				border-radius:4px;
				border:1px solid $blue;
				cursor: pointer;
				font-size: $font-size-small;
				font-weight: bold;

				transition:all 0.1s ease;
				transition-property: background, color;

				&:not(:last-child){
					margin-bottom:5px;
				}

				&:hover {
					background:$blue;
					color:white;
				}
			}
		}
	}


</style>
