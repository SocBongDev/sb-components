<script context="module" lang="ts">
	export type ScheduleData = { timeRange: string; activities: string[] }
</script>

<script lang="ts">
	export let title: string
	export let data: ScheduleData[]
</script>

<div class="schedule">
	<header class="scheduleHeader">
		<slot name="headerIcon" />
		<h3 class="headerTitle">
			{title}
		</h3>
	</header>
	<div class="scheduleBody">
		{#each data as { activities, timeRange } (timeRange)}
			<div class="scheduleTime">{timeRange}</div>
			<div class="scheduleActivities">
				{#each activities as activity}
					<div class="mb-[5px]">
						{activity}
					</div>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	.schedule {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
	.scheduleHeader {
		display: flex;
		padding-left: 1.25rem;
		color: #ffffff;
		font-size: 1.25rem;
		line-height: 1.75rem;
		font-weight: 600;
		align-items: center;
		gap: 1.25rem;
		background: #06074d;
	}
	.headerTitle {
		text-transform: uppercase;
	}
	.scheduleBody {
		display: grid;
		background-color: #dbeafe;
		font-size: 0.875rem;
		line-height: 1.25rem;
		font-weight: 300;
		flex: 1 1 0%;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	.scheduleTime {
		padding-left: 1.75rem;
		padding-right: 1.75rem;
		padding-bottom: 0.5rem;
		padding-top: 0.625rem;
		border-right-width: 1px;
		border-color: rgb(212, 212, 212);
		grid-column: span 1 / span 1;
	}
	.scheduleActivities {
		display: flex;
		padding-left: 1.75rem;
		padding-right: 1.75rem;
		padding-bottom: 0.5rem;
		padding-top: 0.625rem;
		flex-direction: column;
		grid-column: span 2 / span 2;
	}
</style>
