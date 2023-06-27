<script lang="ts">
	import Collapse from '../Collapse/Collapse.svelte'
	console.log({ Collapse })

	$: if (!$$slots.default) {
		throw Error('Default slot (children) is required')
	} else if (!$$slots.answer) {
		throw Error('Answer slot is required')
	}

	let opened = false

	function click() {
		opened = !opened
	}
</script>

<div class="qa">
	<slot {click} />

	<Collapse {opened}>
		<slot name="answer" />
	</Collapse>
</div>

<style>
	.qa {
		padding-bottom: 1.25rem;
		border-bottom-width: 1px;
		border-color: #afb2b4;
	}
</style>
