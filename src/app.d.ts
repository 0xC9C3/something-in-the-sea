// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
// types to extend the global window object with Ruffle player
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	interface Window {
		RufflePlayer: {
			newest: () => {
				createPlayer: () => {
					ruffle: () => {
						load: ({
										 allowScriptAccess: boolean,
										 url: string
									 }) => void;
					};
				} & Node;
			};
		};
	}
}

export {};
