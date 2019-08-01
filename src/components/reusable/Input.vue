<template>
	<section class="input" :class="{'big':big}">
		<label v-if="label">{{label}}</label>
		<figure @click="$emit('prefixed')" class="prefix" v-if="prefix">{{prefix}}</figure>
		<input :placeholder="placeholder"
		       :class="{'date-holder':type === 'date' && (!input || !input.length), 'prefixed':prefix}"
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
			'big',
			'prefix'
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

		.prefix {
			cursor: pointer;
			padding:10px 0;
			position:absolute;
			left:0;
			top:0;
			bottom:2px;
			display:flex;
			align-items: center;
			font-size: 28px;
			color:$grey;

		}

		label {
			display:block;
			width:100%;
			font-size: 11px;
			font-weight: bold;
			margin-bottom:7px;
		}

		input, input[type=date] {
			outline:0;
			width:100%;
			height:44px;
			border-radius:4px;
			border:1px solid $borderlight;
			padding:0 15px;

			transition:all 0.2s ease;
			transition-property: color, border, background;

			&:focus {
				border:1px solid $blue;
			}

			&:disabled {
				background:rgba(0,0,0,0.04);
				padding:0 12px;
				border:1px dashed $borderlight;
			}

			&.date-holder:before {
				content: attr(placeholder) ' ';
			}

			&.date-holder:after {
				content: '';
			}

			&:focus:before, &:active:before {
				content: '';
			}

			&.prefixed {
				padding-left:20px !important;
			}
		}

		input[type=date]{
			background:rgba(0,0,0,0.01);
			border:1px solid $borderlight;
			padding:0 10px;
		}

		::-webkit-datetime-edit { color: transparent; }
		:focus::-webkit-datetime-edit { color: #000; }

		&.big {
			input {
				height:64px;
				font-size: 24px;
				padding:0 20px;
			}

			input[type=number]{
				font-size: 64px;
			}
		}
	}

	.blue-steel {
		.input {
			input {
				border:1px solid $borderdark;

				&:focus {
					border:1px solid $blue;
				}

				&:disabled {
					background:rgba(0,0,0,0.12);
				}
			}

			input[type=date]{
				border:1px solid $borderdark;
				background:rgba(0,0,0,0.08);
			}
		}
	}

	.input {
		input[type=number]{
			border:0;

			&:focus {
				border:0;
			}
		}
	}

</style>