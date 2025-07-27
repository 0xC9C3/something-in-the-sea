<script lang="ts">
	import PartWrapper from "$lib/components/part-wrapper.svelte";
	import PartLayout from '$lib/components/part-layout.svelte';


	const part: string = '2';
	let day = $state("1");
	let options = Array.from({ length: 123 }, (_, i) => {
		const d = i + 1;
		if (d === 122) return ['122_morning', '122_evening'];
		return d.toString();
	}).flat();
</script>

<PartLayout
	title="Part 2: The Office">

	<PartWrapper
		part={part}
		day={day}
		startKey="swf/preloader.swf"
		options={options}
		width="1024px"
		height="870px" />
</PartLayout>