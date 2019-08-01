<template>
	<button :disabled="disabled" :style="forcedStyles" :class="{'secondary':secondary}" @click="click && !disabled ? click() : ()=>{}">
		<span v-if="icon" class="icon" :class="[icon, {'no-text':!text}]"></span>
		<span v-if="text">{{text}}</span>
	</button>
</template>

<script>
	export default {
		props:['text','click', 'disabled', 'icon', 'forcedStyles', 'secondary']
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	button {
		cursor: pointer;
		outline:0;
		background:transparent;
		height:44px;
		padding:0 20px;
		display:flex;
		justify-content: center;
		align-items: center;
		font-size: 11px;
		font-weight: bold;
		border-radius:4px;
		text-transform: uppercase;

		color:$blue;
		border:1px solid $blue;

		.icon {
			padding-right:10px;
			font-size: 14px;

			&.no-text {
				padding:0;
			}
		}

		&:disabled {
			opacity:0.6;
			cursor: not-allowed;
		}

		&.secondary {
			border:1px solid $borderlight;
			color:$borderlight;

			&:hover {
				border:1px solid $grey;
				color:$grey;
			}
		}
	}

	.blue-steel {
		button {
			&.secondary {
				border:1px solid $borderdark;
				color:$borderdark;

				&:hover {
					border:1px solid $grey;
					color:$grey;
				}
			}
		}
	}

</style>