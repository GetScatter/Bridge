<template>
	<section class="input" :class="{'big':big}">
		<label v-if="label">{{label}}</label>
		<figure @click="$emit('prefixed')" class="prefix" :class="{'vertical':prefix.length > 1}" v-if="prefix">{{prefix}}</figure>
		<input :placeholder="placeholder"
		       :class="{'date-holder':type === 'date' && (!input || !input.length), 'prefixed':prefix}"
		       :style="{'font-size':fontSize}"
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
		computed:{
			fontSize(){
				if(!this.text) return;
				const strlen = this.text.toString().length;
				if(!(this.type === 'number' && this.big)) return;
				if(strlen <= 5) return;
				let fsi = strlen < 5 ? null : 64 - (this.text.toString().length * 2.5);
				if(fsi < 40) fsi = 40;
				return `${fsi}px`;
			},
		},
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
			position:absolute;
			left:-2px;
			top:0;
			bottom:0;
			display:flex;
			align-items: center;
			justify-content: center;
			font-size: 28px;
			color:$grey;
			margin:0;
			padding:0;

			&:hover {
				color:$blue;
			}

			&.vertical {
				display:flex;
				flex-direction: column;
				justify-content: center;
				margin-left:7px;

				transform: rotate(90deg);
				transform-origin: center center;
				font-size: 13px;
				font-weight: bold;

				width:0;
			}

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
				padding-left:22px !important;
			}

			&.small-num {
				font-size: 48px !important;
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