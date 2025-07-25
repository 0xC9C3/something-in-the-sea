<script lang="ts">
	import Player from '$lib/components/player.svelte';

	const partNumber: string = '1';
	const day = 1;

</script>

<Player
	url={`/swf/${partNumber}/${day}/somethinginthesea.swf`}
	/>

