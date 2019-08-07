<template>
	<button :disabled="disabled || loading" :style="forcedStyles" :class="{'secondary':secondary, 'primary':primary}" @click="click && !disabled ? click() : ()=>{}">
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
		props:['text','click', 'disabled', 'icon', 'forcedStyles', 'secondary', 'primary', 'loading']
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	button {
		font-family: 'Poppins', sans-serif;
		cursor: pointer;
		outline:0;
		background:$softblue;
		height:44px;
		padding:0 20px;
		display:flex;
		justify-content: center;
		align-items: center;
		font-size: $font-size-standard;
		font-weight: bold;
		border-radius:3px;
		text-transform: uppercase;

		color:$blue;
		border:0;
		transition:all 0.12s ease-in-out;

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
			background-color:$blue;

			&:hover {
				background:darken($blue, 10%);
			}
		}

		&.secondary {
			background:white;
			color:$blue;

			&:hover {
				background:darken(white, 10%);
				color:$blue;
			}
		}
	}

	.blue-steel {
		button {
			background:$darkblue;
			color:white;

			&:hover {
				background:darken($darkblue, 10%);
			}

			&.secondary {
				background:transparent;
				color:white;

				&:hover {
					background:rgba(0,0,0,0.12);
					color:white;
				}
			}
		}
	}

</style>