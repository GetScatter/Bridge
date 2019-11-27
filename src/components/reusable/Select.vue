<template>
	<section class="select" :class="{'open':open, 'disabled':disabled}">
		<input ref="terms" placeholder="Search..." v-model="optionsTerms" />
		<label v-if="label">{{label}}</label>
		<section class="selected" @click="toggle">
			<figure class="text">
				{{parse(selectedOption)}}
			</figure>
			<figure class="chevron fas fa-chevron-down"></figure>
		</section>
		<section class="options">
			<figure class="option" :class="{'hovered':hovered === index}" @click="select(item)" @mouseover="hovered = index" v-for="(item, index) in filteredOptions">
				{{parse(item)}}
			</figure>
			<figure class="option" v-if="!filteredOptions.length">
				No results
			</figure>
		</section>
	</section>
</template>

<script>
	export default {
		props:['selected', 'placeholder', 'disabled', 'options', 'parser', 'label'],
		data(){return {
			open:false,
			optionsTerms:'',
			hovered:0,
		}},
		mounted(){
			document.addEventListener('click', this.handleDocumentClick);
			document.addEventListener('keyup', this.handleKeyPress);
		},
		destroyed(){
			document.removeEventListener('click', this.handleDocumentClick);
			document.removeEventListener('keyup', this.handleKeyPress);
		},
		computed:{
			filteredOptions(){
				return this.options.filter(x => {
					const parsed = this.parse(x);
					return !parsed || parsed.toLowerCase().indexOf(this.optionsTerms.toLowerCase()) > -1
				});
			},
			selectedOption(){
				return this.selected || this.placeholder || this.options[0];
			}
		},
		methods:{
			handleDocumentClick(e){
				if(this.open) this.open = false;
			},
			handleKeyPress(e){
				if(this.open){
					switch(e.which){
						case 40: this.hovered++; break;
						case 38: this.hovered--; break;
						case 13: return this.select(this.filteredOptions[this.hovered])
					}
				}
				if(this.hovered < 0){
					this.hovered = this.filteredOptions.length-1;
				}
				if(this.hovered > this.filteredOptions.length-1){
					this.hovered = 0;
				}
			},
			toggle(){
				if(this.open) return;
				setTimeout(() => {
					if(this.disabled) return false;
					this.open = !this.open;

					if(this.open){
						this.optionsTerms = '';
						setTimeout(() => {
							this.$refs.terms.focus()
						}, 50);
					}
				},1)
			},
			parse(item){
				if(typeof item === 'string' && (!this.parser || !this.parser(item))) return item;
				if(typeof this.parser !== 'function') return item;
				return this.parser(item);
			},
			select(item){
				this.open = false;
				this.$emit('selected', item);
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	label {
		display:block;
		width:100%;
		font-size: $font-size-standard;
		font-family: 'Poppins', sans-serif;
		margin-bottom:7px;
	}

	.select {
		position: relative;
		z-index: 10;
		width:100%;
		display:inline-block;
		text-align:left;

		input {
			position: absolute;
			top:-100px;
			width:0;
			height:0;
			opacity:0;
		}

		.selected {
			cursor: pointer;
			width:100%;
			z-index:1;
			background:#fff;
			opacity:1;
			display:inline-block;
			position: relative;
			border:1px solid darken($borderlight, 50%);
			height:44px;
			line-height:40px;
			padding:0 30px 0 15px;
			border-radius:4px;

			transition: all 0.2s ease;
			transition-property: opacity;

			.text {
				color:$black;
				font-size: $font-size-standard;
				font-weight: bold;
				display:inline-block;
			}

			.chevron {
				display:flex;
				align-items: center;
				position: absolute;
				right:10px;
				top:0;
				bottom:0;
				color:$blue;
				font-size: 14px;

				transition: transform 0.2s ease;
			}
		}


		&.disabled {
			opacity:0.3;
			cursor: not-allowed;

			.selected {
				cursor: not-allowed;
			}
		}

		.options {
			left:0;
			position: absolute;
			border-radius:4px;
			top:66px;
			width:100%;
			max-height:150px;
			min-height:25px;
			min-width:100px;
			background: #fff;
			right:0;
			z-index:2;
			overflow: hidden;
			border:1px solid $lightgrey;
			box-shadow:0 0 1px rgba(0,0,0,0);
			opacity:0;
			visibility: hidden;

			transition: all 0.1s ease;
			transition-property: opacity, visibility, box-shadow;

			.option {
				cursor: pointer;
				padding:8px 12px;
				color:$grey;
				font-size: $font-size-standard;
				font-weight: bold;
				position: relative;

				.item-icon {
					position:absolute;
					right:10px;
					top:0;
					bottom:0;
					display:flex;
					align-items: center;

					&.red {
						color:$red;
					}
				}

				&.hovered {
					background:rgba(0,0,0,0.02);
					color:$black;
				}
			}
		}

		&.open {
			z-index:11;

			.options {
				overflow-y: auto;
				box-shadow:0 0 20px $shadow-low;
				opacity:1;
				visibility: visible;
			}

			.selected {
				opacity:0.5;

				.chevron {
					transform:rotateZ(180deg) translateY(-1px);
				}
			}
		}


	}


</style>
