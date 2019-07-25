<template>
	<button :disabled="disabled" :style="forcedStyles" @click="click && !disabled ? click() : ()=>{}">
		<span v-if="icon" class="icon" :class="icon"></span>
		<span v-if="text">{{text}}</span>
	</button>
</template>

<script>
	export default {
		props:['text','click', 'disabled', 'icon', 'forcedStyles']
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	button {
		cursor: pointer;
		outline:0;
		background:transparent;
		color:$blue;
		height:44px;
		padding:0 20px;
		display:flex;
		justify-content: center;
		align-items: center;
		font-size: 11px;
		font-weight: bold;
		border-radius:4px;

		border:1px solid $blue;
		text-transform: uppercase;

		.icon {
			padding-right:10px;
			font-size: 14px;
		}

		&:disabled {
			opacity:0.6;
			cursor: not-allowed;
		}
	}
</style>