<script lang="ts">
</script>

<section id="hero" class="container">
	<div class="left">
		<figure>
			<img
				class="leftImage"
				src="https://ilo.edu.vn/themes/ilo/assets/landingpage/05aug/imgs/imagecompressor/banner-mobile.webp"
				alt=""
			/>
		</figure>
	</div>
	<div class="right">
		<div class="mx-auto w-full lg:absolute lg:bottom-0 lg:right-0 lg:mx-0 lg:max-w-[490px]" />
	</div>
</section>

<style lang="postcss">
	.container {
		display: flex;
		flex-direction: column;
		width: 100%;
		background: #f9f9f9;
	}
	.left {
		width: 100%;
	}
	.leftImage {
		max-width: 100%;
	}
	.right {
		position: relative;
		padding-top: 1rem;
		padding-bottom: 1rem;
		background-color: #ffffff;
		width: 100%;
	}
	@media (min-width: 1024px) {
		.container {
			flex-direction: row;
		}
	}
</style>
