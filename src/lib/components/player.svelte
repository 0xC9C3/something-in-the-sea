<script lang="ts">
	import { onMount } from 'svelte';
	import '@ruffle-rs/ruffle';

	let {
		url,
		width = '1100px',
	  height = '800px'
	}: {
		url: string,
		width?: string,
		height?: string,
	}
		= $props();

	let playerElement: HTMLDivElement;

	onMount(() => {
		const ruffle = window.RufflePlayer.newest();
		const player = ruffle.createPlayer();

		// eslint-disable-next-line svelte/no-dom-manipulating
		playerElement.appendChild(player);

		player.ruffle().load({
			url,
			allowScriptAccess: false,
		});

		// get the child element of the player and set its width and height
		const childElement = playerElement.firstChild as HTMLElement;
		if (childElement) {
			childElement.style.width = width;
			childElement.style.height = height;
		}

	});
</script>

<div
	bind:this={playerElement} class="ruffle-player"></div>
