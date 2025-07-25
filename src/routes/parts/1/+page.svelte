<script lang="ts">
	import Player from '$lib/components/player.svelte';

	const partNumber: string = '1';
	let day = $state("1");

	// on day change reload the player
	$effect(() => {
		console.log(day);
	});
</script>

<div class="flex items-center justify-center m-6">
	<label class="label">
		<span class="label-text">Select the day</span>
		<select class="select" bind:value={day}>
			<!-- day 1.9 then day10am and day10pm -->
			{#each ["1", "2", "3", "4", "5", "6", "7", "8", "9", '10am', '10pm'] as d (d)}
				<option value={d}>{d}</option>
			{/each}
		</select>
	</label>
</div>

<div class="flex flex-col items-center justify-center h-screen">
	<Player
		width="1100px"
		height="800px"
		url={`/swf/${partNumber}/${day}/somethinginthesea.swf`}
	/>
</div>
