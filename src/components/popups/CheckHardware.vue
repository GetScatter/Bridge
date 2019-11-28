<template>
	<section class="check-hardware">

		<section class="popup-content">

			<figure class="title">Check your <span>Hardware Wallet</span></figure>
			<figure class="sub-title">
				You need to approve a transaction on your hardware wallet.
			</figure>

		</section>

		<section class="popup-buttons">
			<Button @click.native="() => closer(null)" text="Cancel" />
		</section>

	</section>
</template>

<script>
	export default {
		props:['popin', 'closer'],
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.check-hardware {
		max-width:400px;

		width:calc(100% - 80px);
		margin:0 auto;
	}


</style>
