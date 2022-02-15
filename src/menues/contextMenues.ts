import { Cache } from "../repos/Cache";
import { addArtworkToPlaylist } from "../utils/playlistUtils";

let _cache: Cache;

export function registerContextMenues(cache: Cache) {
	_cache = cache;

	const cntxMenu = new Spicetify.ContextMenu.Item(
		"Refresh playlist artwork",
		async (uris) => {
			await removeFromCache(uris[0]);
			Spicetify.showNotification("Refreshed playlist artwork");
		},
		// @ts-ignore
		(uris) => {
			return uris[0] && uris[0].includes("spotify:playlist");
		},
		"playlist-folder"
	);

	cntxMenu.register();
}

async function removeFromCache(uri: string) {
	const playlistId = uri.replace("spotify:playlist:", "");

	await _cache.deleteUri(playlistId);

	const playlists = document.getElementsByClassName("main-rootlist-rootlistItemLink");
	const playlistToRefetch = Array.from(playlists).find(playlist => playlist.attributes.getNamedItem("href")!.value);

	if (playlistToRefetch) {
		const playlistTextElement = playlistToRefetch.firstElementChild;

		if (playlistTextElement?.firstElementChild?.nodeName === "IMG" || playlistTextElement?.firstElementChild?.nodeName === "svg")
			playlistTextElement?.removeChild(playlistTextElement?.firstChild!);

		setTimeout(() => addArtworkToPlaylist(playlistToRefetch));
	}
}