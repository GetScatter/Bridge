<template>
	<section class="delete-keypair">

		<section class="popup-content">

			<figure class="title">Are you sure you want to <span>delete your history</span>?</figure>
			<figure class="sub-title">
				This action is not reversible, and you will lose your locally stored history. This will not actually remove the transactions though.
			</figure>

		</section>

		<section class="popup-buttons">
			<Button primary="1" @click.native="closer(null)" text="Cancel" />
			<Button @click.native="closer(true)" icon="fas fa-exclamation-triangle" text="Delete" />
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

	.delete-keypair {
		max-width:400px;

		width:calc(100% - 80px);
		margin:0 auto;
	}


</style>
