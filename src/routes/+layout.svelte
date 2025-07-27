<script lang="ts">
	import { dev } from '$app/environment';
	import '../app.css';
	import { onMount } from 'svelte';

	let { children } = $props();
	let serviceWorkerRegistered = $state(false);

	navigator.serviceWorker.ready.then(() => {
		serviceWorkerRegistered = true;
		console.log('Service Worker is ready.');
	}).catch(error => {
		console.error('Service Worker registration failed:', error);
	});

	navigator.serviceWorker.register('/service-worker.js', {
		type: dev ? 'module' : 'classic'
	});
</script>

{#if serviceWorkerRegistered}
	{@render children()}
{:else}
	Loading...
{/if}

