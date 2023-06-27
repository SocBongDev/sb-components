<script lang="ts">
	export let opened: boolean
	export let onClick: any
</script>

<button class="burgerButton" on:click={onClick}>
	<div class="icon">
		{#each Array(3) as _, i}
			{@const line = `line${i + 1}`}
			<div class="line {line}" class:opened />
		{/each}
	</div>
</button>

<style>
	.burgerButton {
		padding-top: 0.125rem;
		padding-bottom: 0.125rem;
	}
	.icon {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}
	.line {
		position: relative;
		background-color: #000000;
		transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow,
			transform;
		transition-duration: 300ms;
		width: 1.5rem;
		height: 0.125rem;
	}
	.line1.opened {
		transform: translateY(0.5rem) rotate(45deg);
	}
	.line2.opened {
		opacity: 0;
	}
	.line3.opened {
		transform: translateY(-0.5rem) rotate(-45deg);
	}
</style>
