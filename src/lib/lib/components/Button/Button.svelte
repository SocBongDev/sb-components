<script lang="ts">
	export let variant: 'filled' | 'subtle' = 'filled'
	export let fullWidth = false
</script>

<button class="container {variant} {fullWidth ? 'fullWidth' : ''} {$$props.class}">
	<div class="contentContainer">
		<slot name="leftIcon" />
		<slot />
		<slot name="rightIcon" />
	</div>
</button>

<style>
	button.container {
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		padding-left: 1.25rem;
		padding-right: 1.25rem;
		border-radius: 0.125rem;
	}
	.filled {
		background-color: rgb(30, 27, 75);
	}
	.fullWidth {
		width: 100%;
	}
	.contentContainer {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.625rem;
	}
</style>
