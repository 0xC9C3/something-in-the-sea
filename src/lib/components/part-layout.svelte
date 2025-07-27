<script lang="ts">

	let {
		title,
		children
	}: {
		title: string,
		children: unknown
	}
		= $props();


</script>

<div class="container mx-auto p-4">
	<h1 class="text-2xl">{title}</h1>

	<a href="/" class="btn btn-primary m-6">Back to parts</a>

	{@render children()}
</div>