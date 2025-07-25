/// <reference types="@sveltejs/kit" />

self.addEventListener('fetch', (event) => {
	// ignore POST requests etc
	if (event.request.method !== 'GET') return;

	async function respond() {
		// get the url from which the request was made
		const referrer = event.request.referrer || event.request.referrerPolicy;

		// if request contains .ruffle, rewrite to top level i.e. http://localhost:5173/parts/core.ruffle.a4f599f8ad3e6112762b.js should be http://localhost:5173/core.ruffle.a4f599f8ad3e6112762b.js
		if ((
			event.request.url.includes('.ruffle') || event.request.url.includes('.wasm')
		) && event.request.url.includes('/parts/')) {
			const url = new URL(event.request.url);
			// only take the last part of the pathname
			url.pathname = url.pathname.split('/').pop() || '';

			// create a new request with the modified URL
			const modifiedRequest = new Request(url, {
				method: event.request.method,
				headers: event.request.headers,
				mode: event.request.mode,
				credentials: event.request.credentials,
				redirect: event.request.redirect
			});

			return await fetch(modifiedRequest);
		}

		// if the request referer is i.e. "/parts/1/1" we need to rewrite it to "/swf/1/1/.."
		if (referrer.includes('/parts/') && (
			event.request.url.includes('.swf') ||
			event.request.url.includes('.xml') ||
			event.request.url.includes('.mp3') ||
			event.request.url.includes('.jpg') ||
			event.request.url.includes('.png')
		)) {
			const url = new URL(event.request.url);
			console.log('Rewriting URL:', url.href);
			const file = url.pathname.split('/').pop();

			const refererPathname = new URL(referrer).pathname;

			// replace the last part of the pathname with "swf"
			url.pathname = refererPathname.replace('/parts', '/swf') + '/' + file;

			// create a new request with the modified URL
			const modifiedRequest = new Request(url, {
				method: event.request.method,
				headers: event.request.headers,
				mode: event.request.mode,
				credentials: event.request.credentials,
				redirect: event.request.redirect
			});

			const response = await fetch(modifiedRequest);

			// if the response is a 404, we need to return a 200 response, this seems to fix some issues
			// with some textures
			if (response.status === 404) {
				return new Response('Not Found', { status: 200 });
			}
			return response;
		}

		const response = await fetch(event.request);

		// if we're offline, fetch can return a value that is not a Response
		// instead of throwing - and we can't pass this non-Response to respondWith
		if (!(response instanceof Response)) {
			throw new Error('invalid response from fetch');
		}

		return response;
	}

	event.respondWith(respond());
});
