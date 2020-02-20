<template>
	<section class="input" :class="{'big':big}">
		<label v-if="label" :class="{'red':redLabel}">{{label}}</label>
		<figure @click="$emit('prefixed')" class="prefix" :class="{'vertical':prefix.length > 1, 'smaller':prefix.length > 4}" v-if="prefix">{{prefix.substr(0,5)}}</figure>
		<input v-if="!textarea" :placeholder="placeholder" ref="focuser"
		       :class="{'date-holder':type === 'date' && (!input || !input.length), 'prefixed':prefix}"
		       :style="{'font-size':fontSize}"
		       @keyup.enter="enter"
		       @blur="blur"
		       :disabled="disabled || false"
		       :type="type || 'text'"
		       v-model="input" />

		<textarea v-if="textarea" ref="focuser"
		          :placeholder="placeholder"
		          v-model="input"
		          @keyup.enter="enter"
		          @blur="blur"></textarea>
	</section>
</template>

<script>
	export default {
		data(){ return { input:this.text }},
		methods: {
			enter(){ this.$emit('enter') },
			emit(){ this.$emit('changed', this.input) },
			blur(){ this.$emit('blur') },
			focusToggle() {
				this.$nextTick(() => {
					this.$refs.focuser.focus();
				})
			},
		},
		created(){
			if(this.value) this.input = this.value;
			if(this.focus) this.focusToggle();
		},
		props:[
			'text',
			'placeholder',
			'label',
			'redLabel',
			'type',
			'disabled',
			'big',
			'prefix',
			'textarea',
			'value',
			'focus'
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
			focus:function(){ this.focusToggle(); },
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
			font-size: $font-size-huge;
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

				transform: rotate(-90deg);
				transform-origin: center center;
				font-size: $font-size-medium;
				font-weight: bold;

				width:0;
			}

			&.smaller {
				font-size: $font-size-small;
			}

		}

		label {
			display:block;
			width:100%;
			font-size: $font-size-standard;
			font-family: 'Poppins', sans-serif;
			margin-bottom:7px;

			&.red {
				color:$red;
			}
		}

		input, textarea, input[type=date] {
			outline:0;
			width:100%;
			height:44px;
			border-radius:4px;
			border:1px solid darken($borderlight, 50%);
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
				font-size: $font-size-large !important;
			}
		}

		textarea {
			min-height:70px;
			height:auto;
			padding:15px;
			resize: none;
		}

		input[type=date]{
			background:rgba(0,0,0,0.01);
			border:1px solid $borderlight;
			padding:0 10px;
		}

		&.big {

			.prefixed {
				padding-left:25px !important;
			}

			input {
				height:64px;
				font-size: $font-size-large;
				padding:0 20px;
			}

			input[type=number]{
				font-size: 50px;
				background:transparent;
				border:0;

				&:focus {
					border:0;
				}

				&:disabled {
					background:transparent;
				}
			}
		}
	}

	.blue-steel {
		.input {
			input, textarea {
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

</style>
