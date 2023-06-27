<script context="module" lang="ts">
	export type SubTitleProps = { props?: { class: string }; content: string }
</script>

<script lang="ts">
	export let title: string
	export let subTitles: SubTitleProps[]
</script>

<div class="sectionTitle">
	<h2 class="title">
		{title}
	</h2>
	{#each subTitles as { content, props: somethingElse }, i (i)}
		<p {...somethingElse} class="subTitle {somethingElse?.class}">
			{content}
		</p>
	{/each}
</div>

<style>
	.sectionTitle {
		color: rgb(64, 64, 64);
		display: flex;
		font-size: 0.75rem;
		line-height: 1rem;
		text-align: center;
		flex-direction: column;
		gap: 0.625rem;
	}
	.title {
		color: rgb(30, 27, 75);
		font-size: 1.125rem;
		line-height: 1.75rem;
		font-weight: 800;
	}
	.subTitle {
		font-size: 0.75rem;
		line-height: 1rem;
	}
	@media (min-width: 1024px) {
		.sectionTitle {
			margin-left: auto;
			margin-right: auto;
			max-width: 64rem;
		}
		.title {
			font-size: 42px;
			line-height: 76px;
		}
		.subTitle {
			font-size: 1rem;
			line-height: 1.5rem;
		}
	}
</style>
