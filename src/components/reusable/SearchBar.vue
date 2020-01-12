<template>
	<section class="search-bar">
		<input :placeholder="placeholder ? placeholder : 'SEARCH'" v-model="terms" />
		<select v-model="selected" v-if="options && options.length">
			<option :value="option.value" v-for="option in options">{{option.text}}</option>
		</select>
	</section>
</template>

<script>
	export default {
		props:['options', 'placeholder'],
		data(){return {
			terms:'',
			selected:null,
		}},
		watch:{
			['terms'](){
				return this.$emit('terms', this.terms.toLowerCase().trim());
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
			border-radius:6px;
			flex:1;
			outline:0;
			border:none;
			background:#f1f8fe;
			padding:10px;
			font-family: 'Poppins', sans-serif;

			transition: $themetransition;
			transition-property: border, background, color;
		}

		select {
			margin-left:10px;
		}
	}

	.blue-steel {
		input {
			background:$borderdark;
			color:#fff;
		}
	}

	.mobile {
		.search-bar {
			display:block;

			input, select {
				width:100%;
				margin:0;
				margin-bottom:10px;
			}
		}
	}

	.mobile {
		.search-bar {
			flex-direction:column;

			input {
				padding:15px;
			}

			select {
				margin:10px 0 0 0;
			}
		}
	}

</style>
