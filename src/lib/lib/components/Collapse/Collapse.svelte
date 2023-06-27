<script lang="ts">
	export let opened: boolean
</script>

{#if opened}
	<slot />
{/if}
