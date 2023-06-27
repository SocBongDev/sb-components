<script lang="ts">
	export let src: string
	export let alt = ''
	export let title: string
	export let content: string
</script>

<figure>
	<img class="image" {src} {alt} />
	<figcaption class="caption">
		<h4 class="captionTitle">
			{title}
		</h4>
		<p class="captionContent">
			{content}
		</p>
	</figcaption>
</figure>

<style>
	.image {
		max-width: 100%;
		height: auto;
	}
	.caption {
		display: flex;
		margin-top: 0.625rem;
		flex-direction: column;
		gap: 1rem;
	}
	.captionTitle {
		color: rgb(30, 27, 75);
		font-size: 1rem;
		line-height: 1.5rem;
		font-weight: 600;
		text-transform: uppercase;
	}
	.captionContent {
		color: rgb(64, 64, 64);
		font-size: 0.875rem;
		line-height: 1.25rem;
		font-weight: 500;
	}
</style>
