<template>
	<section class="physical panel-head panel-pad limiter">
		<figure class="icon"><i class="fas fa-id-badge"></i></figure>
		<figure class="title">Physical Identity</figure>
		<figure class="description">Your physical identity is your real life information.</figure>

		<br>
		<br>
		<br>

		<section class="flex">
			<Input label="Full Name" />
			<Input label="Date of birth" type="date" />
		</section>
		<Input label="Email Address" disabled="1" />

		<br>
		<br>
		<figure class="line"></figure>
		<br>
		<br>

		<Input label="Address" />
		<section class="flex">
			<Input label="City" />
			<Input label="State" />
		</section>
		<section class="flex">
			<Input label="Country" />
			<Input label="Postal Code" />
		</section>

		<br>
		<br>
		<br>
	</section>
</template>

<script>

	export default {
		components:{

		}

	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.physical {

	}

</style>