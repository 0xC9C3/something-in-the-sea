<script lang="ts">
	import PartWrapper from "$lib/components/part-wrapper.svelte";
	import PartLayout from '$lib/components/part-layout.svelte';

	const part: string = '3';
	let day = $state("124");

	let options = Array.from({ length: 56 }, (_, i) => {
		return (124 + i).toString();
	}).flat();

</script>

<PartLayout
	title="Part 3: The Ship">

	<PartWrapper
		part={part}
		day={day}
		startKey="swf/preloader_ship.swf"
		options={options}
		width="1024px"
		height="870px" />
</PartLayout>