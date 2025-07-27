<script lang="ts">
	import PartLayout from '$lib/components/part-layout.svelte';
import PartWrapper from '$lib/components/part-wrapper.svelte';

	const part: string = '1';
	let day = $state("1");

</script>

<PartLayout
	title="Part 1: The Map">

	<PartWrapper
		part={part}
		day={day}
		startKey="somethinginthesea.swf"
		options={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10am', '10pm']}
		width="1100px"
		height="800px" />
</PartLayout>