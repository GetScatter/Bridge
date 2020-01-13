<template>
	<button :disabled="disabled || loading" :style="forcedStyles" :class="{'primary':primary}" @click="click && !disabled ? click() : ()=>{}">
		<span class="icon no-text" v-if="loading">
			<i class=" animate-spin fas fa-spinner"></i>
		</span>
		<span v-else>
			<span v-if="icon" class="icon" :class="[icon, {'no-text':!text}]"></span>
			<span v-if="text">{{text}}</span>
		</span>
	</button>
</template>

<script>
	export default {
		props:['text','click', 'disabled', 'icon', 'forcedStyles', 'primary', 'loading']
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	button {
		font-family: 'Poppins', sans-serif;
		cursor: pointer;
		outline:0;
		background:transparent;
		padding:8px 12px;
		display:flex;
		justify-content: center;
		align-items: center;
		font-size: $font-size-standard;
		border-radius:3px;
		word-break: break-word;
		font-weight: bold;
		border:0;
		height:44px;

		color:$blue;
		transition:all 0.12s ease-in-out;
		transition-property: background, color;

		&:hover {
			background:darken($softblue, 5%);
			color:$blue;
		}

		.icon {
			padding-right:10px;
			font-size: $font-size-big;

			&.no-text {
				padding:0;
			}
		}

		&:disabled {
			opacity:0.6;
			cursor: not-allowed;
		}

		&.primary {
			color:white;
			background:$blue;

			&:hover {
				background:darken($blue, 4%);
			}
		}

		span {

			display:flex;
			justify-content: center;
			align-items: center;
		}
	}

	.blue-steel {
		button {
			background:transparent;
			color:white;

			&:hover {
				background:darken($darkblue, 10%);
			}

			&.primary {
				background:$darkblue;
				color:white;

				&:hover {
					background:lighten($darkblue, 10%);
					color:white;
				}
			}
		}
	}

</style>
