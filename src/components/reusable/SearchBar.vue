<template>
	<section class="search-bar">
		<input placeholder="SEARCH" v-model="terms" />
		<select v-model="selected" v-if="options && options.length">
			<option :value="option.value" v-for="option in options">{{option.text}}</option>
		</select>
	</section>
</template>

<script>
	export default {
		props:['options'],
		data(){return {
			terms:'',
			selected:null,
		}},
		watch:{
			['terms'](){
				return this.$emit('terms', this.terms.toLowerCase());
			},
			['selected'](){
				return this.$emit('selected', this.selected)
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.search-bar {
		display:flex;
		margin:20px 0;

		input {
			border-radius:4px;
			flex:1;
			outline:0;
			border:none;
			background:#f1f8fe;
			padding:0 10px;
			height:34px;

			transition: $themetransition;
			transition-property: border, background, color;
		}

		select {
			cursor: pointer;
			outline:0;
			border-radius:4px;
			flex:0 0 auto;
			height:34px;
			padding:0 20px 0 10px;
			margin-left:10px;
			background:transparent;
			border:1px solid $borderlight;
			text-transform: uppercase;
			color:$grey;

			transition: $themetransition;
			transition-property: border, background, color;

		}
	}

	.blue-steel {
		input {
			background:$borderdark;
			color:#fff;
		}

		select {
			border:1px solid $borderdark;
			color:#fff;
		}
	}

</style>