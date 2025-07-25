<script lang="ts">
	import { dev } from '$app/environment';
	import '../app.css';

	let { children } = $props();

	navigator.serviceWorker.register('/service-worker.js', {
		type: dev ? 'module' : 'classic'
	});
</script>

{@render children()}
