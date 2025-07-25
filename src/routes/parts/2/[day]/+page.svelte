<script lang="ts">
	import Player from '$lib/components/player.svelte';
	import { page } from '$app/state';

	const partNumber: string = '2';
	const day = page.params.day;

</script>

<div >
	<Player
		width="1100px"
		height="800px"
		url={`/swf/${partNumber}/${day}/swf/preloader.swf`}
		/>
</div>

