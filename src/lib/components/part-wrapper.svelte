<script lang="ts">
	import Player from '$lib/components/player.svelte';
	import { mount, onMount } from 'svelte';

	let {
		part,
		day,
		startKey,
		options,
		width = '1100px',
		height = '800px'
	}: {
		part: string,
		day: string | number,
		options: (string | number)[],
		startKey: string,
		width: string,
		height: string,
	}
		= $props();

	let parentDiv: HTMLDivElement;

	// on day change reload the player
	$effect(() => {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.getRegistrations().then(registrations => {
				console.log('Service Workers:', registrations);
				registrations.forEach(registration => {
					console.log('Sending message to service worker:', registration);
					registration.active?.postMessage({
						type: 'UPDATE_PLAYER',
						part,
						day
					});
				});
			});
		}

		// eslint-disable-next-line svelte/no-dom-manipulating
		parentDiv.innerHTML = '';
		mount(Player, {
			target: parentDiv,
			props: {
				url: `/_swf/${part}/${day}/${startKey}`,
				width,
				height
			}
		});
	});

</script>

<div class="flex items-center justify-center m-6">
	<label class="label">
		<span class="label-text">Select the day</span>
		<select class="select" bind:value={day}>
			{#each options as d (d)}
				<option value={d}>
					Day {d}
				</option>
			{/each}
		</select>
	</label>
</div>

<div bind:this={parentDiv} class="flex flex-col items-center justify-center h-screen">
</div>
