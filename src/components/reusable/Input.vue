<template>
	<section class="input">
		<label v-if="label">{{label}}</label>
		<input :placeholder="placeholder"
		       @keyup.enter="enter"
		       @blur="blur"
		       :disabled="disabled || false"
		       :type="type || 'text'"
		       v-model="input" />
	</section>
</template>

<script>
	export default {
		data(){ return { input:this.text }},
		methods: {
			enter(){ this.$emit('enter') },
			emit(){ this.$emit('changed', this.input) },
			blur(){ this.$emit('blur') },
		},
		created(){

		},
		props:[
			'text',
			'placeholder',
			'label',
			'type',
			'disabled',
		],
		watch:{
			input:function(){ this.emit(); },
			text:function(){ this.input = this.text; },
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.input {
		text-align:left;
		position: relative;
		width:100%;
		margin-bottom:20px;

		label {
			display:block;
			width:100%;
			font-size: 11px;
			font-weight: bold;
			margin-bottom:7px;
		}

		input {
			outline:0;
			width:100%;
			height:34px;
			border-radius:4px;
			border:1px solid $borderlight;
			padding:0 10px;
		}
	}

	.blue-steel {
		.input {
			input {
				border:1px solid $borderdark;
			}
		}
	}

</style>