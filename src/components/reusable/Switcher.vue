<template>
	<section class="switch" :class="{'disabled':disabled, 'off':!state, 'small':small}" @click="toggle">
		<figure class="dot"></figure>
	</section>
</template>

<script>
	export default {
		props:['state', 'disabled', 'small'],
		methods: {
			toggle(){
				if(this.disabled) return;
				this.$emit('switched', !this.state);
			}
		},
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	$switchheight:28px;

	.switch {
		width:calc(#{$switchheight} * 1.8);
		height:28px;
		border:1px solid rgba(0,0,0,0.1);
		border-radius:50px;
		padding:2px;
		cursor: pointer;
		opacity:1;
		transition: all 0.3s ease;
		transition-property: opacity;
		background:$blue;

		&.disabled {
			opacity:0.2;
			cursor: not-allowed;
		}

		.dot {
			width:calc(#{$switchheight} - 6px);
			height:calc(#{$switchheight} - 6px);
			margin-left:calc(#{$switchheight} - 7px);
			border-radius:50%;
			background:#fff;

			transition: all 0.3s ease;
			transition-property: margin-left, background;
		}

		&.off {
			background:rgba(0,0,0,0.03);

			.dot {
				margin-left:1px;
				background: $grey;
			}
		}

		&.small {
			height:16px;
			width:calc(16px * 1.8);

			.dot {
				width:10px;
				height:10px;
				margin-left:13px;
			}

			&.off {
				.dot {
					margin-left:1px;
				}
			}
		}
	}

	.blue-steel {

		.switch {
			border:1px solid $borderdark;
			background:$borderdark;

			.dot {
				background:#fff;
			}

			&.off {
				background:rgba(255,255,255,0.03);

				.dot {
					background: $grey;
					opacity:0.3;
				}
			}
		}
	}

</style>
