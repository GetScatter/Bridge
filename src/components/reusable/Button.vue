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
		background:transparent;
		height:44px;
		padding:0 20px;
		display:flex;
		justify-content: center;
		align-items: center;
		font-size: $font-size-small;
		font-weight: bold;
		border-radius:3px;
		text-transform: uppercase;

		color:$blue;
		border:1px solid rgba($blue, .44);
		transition:all 0.12s ease-in-out;

		&:hover {
			background:$blue;
			color:#fff;
		}

		.icon {
			padding-right:10px;
			font-size: 18px;

			&.no-text {
				padding:0;
			}
		}

		&:disabled {
			opacity:0.6;
			cursor: not-allowed;
		}

		&.primary {
			border:1px solid darken($blue, 10%);
			color:white;
			background-color:$blue;
		}

		&.secondary {
			border:1px solid rgba($blue, .1);
			color:$blue;

			&:hover {
				background:transparent;
				border:1px solid $blue;
				color:$blue;
			}
		}
	}

	.blue-steel {
		button {

		}
	}

</style>