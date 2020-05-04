<template>
	<section class="get-input">

		<section class="popup-content">
			<figure class="title" v-html="title"></figure>
			<figure class="sub-title" style="margin-top:-20px;">{{subTitle}}</figure>

			<section class="input-container">
				<Input style="margin-bottom:0;" :placeholder="placeholder" :label="label" :text="text" v-on:changed="x => text = x"  />
			</section>
		</section>

		<section class="popup-buttons">
			<Button @click.native="closer(null)" text="Cancel" />
			<Button primary="1" @click.native="closer(text)" text="Done" />
		</section>

	</section>
</template>

<script>
	import Popups from "../../util/Popups";
	import PopupService from "../../services/utility/PopupService";

	export default {
		props:['popin', 'closer'],
		data(){return {
			text:'',
		}},
		computed:{
			title(){
				return this.popin.data.props.title;
			},
			subTitle(){
				return this.popin.data.props.subTitle;
			},
			placeholder(){
				return this.popin.data.props.placeholder || '';
			},
			label(){
				return this.popin.data.props.label || '';
			},
		},
		methods:{

		},
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.get-input {
		max-width:380px;
		width:calc(100% - 80px);
		margin:0 auto;

		.sub-title {
			font-size: $font-size-small;
		}

		.input-container {
			margin-top:40px;
		}
	}


</style>
