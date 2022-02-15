import { Cache } from "../repos/Cache";
import { addArtworkToPlaylists } from "../utils/playlistUtils";

let _cache: Cache;

export function registerSubMenues(cache: Cache) {
	_cache = cache;

	const resetPlaylistCache = new Spicetify.Menu.Item("Refresh playlist artwork cache",
		// @ts-ignore
		undefined,
		(menuItem) => {
			refreshCache();
		});

	new Spicetify.Menu.SubMenu("Playlist-artwork", [resetPlaylistCache]).register();
}

async function refreshCache() {
	await _cache.clear();
	removeAlbumArt();
	setTimeout(() => addArtworkToPlaylists());
	Spicetify.showNotification("Refreshed playlist artwork cache");
}

function removeAlbumArt() {
	const playlists = document.getElementsByClassName("main-rootlist-rootlistItemLink");

	Array.from(playlists).forEach((playlist) => {
		const playlistTextElement = playlist.firstElementChild!;

		if (playlistTextElement?.firstElementChild?.nodeName === "IMG" || playlistTextElement?.firstElementChild?.nodeName === "svg")
			playlistTextElement.removeChild(playlistTextElement?.firstChild!);
	});
}
