/// <reference types="@sveltejs/kit" />

let playerContext: {
	part: string;
	day: string;
}  = {
	part: '1',
	day: '1'
};

self.addEventListener('activate', (event) =>  {

	event.waitUntil(self.clients.claim());
})

self.addEventListener('message', (event) => {
	console.log('Service Worker received message:', event.data);
	playerContext = event.data;
})

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

		if (referrer.includes('/parts/') && (
			event.request.url.includes('.swf') ||
			event.request.url.includes('.xml') ||
			event.request.url.includes('.mp3') ||
			event.request.url.includes('.jpg') ||
			event.request.url.includes('.png')
		)) {
			const url = new URL(event.request.url);
			console.log('Rewriting URL:', url.href);


			// take everything from the pathname after "/parts/" or if there is no "/parts/" then the whole pathname
			const file = url.pathname.split('/')
				.filter(part => part !== 'parts' && part !== '')
				.join('/');

			// replace the last part of the pathname with "swf"
			if (!url.pathname.startsWith('/_swf/')) {
				url.pathname = `/_swf/${playerContext.part}/${playerContext.day}/${file}`;
			}
			// url remove referer
			console.log('Modified URL:', event.request.url, referrer, url.pathname );

			// create a new request with the modified URL
			const modifiedRequest = new Request(url, {
				method: event.request.method,
				headers: event.request.headers,
				mode: event.request.mode,
				credentials: event.request.credentials,
				redirect: event.request.redirect
			});

			const response = await fetch(modifiedRequest);

			//console.log(response);

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
