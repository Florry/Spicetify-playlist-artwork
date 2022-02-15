import { createFolderElement, createImageElement, createMissingArtworkImg } from "./htmlUtils";
import { getPlaylistId } from "./utils";
import { Cache } from "../repos/Cache";

let _cache: Cache;

export function registerPlaylistUtilsCache(cache: Cache) {
	_cache = cache;
}

export function addArtworkToPlaylists() {
	const playlists = document.getElementsByClassName("main-rootlist-rootlistItemLink");

	Array.from(playlists).forEach(async (playlist) => addArtworkToPlaylist(playlist));
}

// Quick hack to limit number of requests and speed up performance
const requestsInProgress: Record<string, boolean> = {};

export async function addArtworkToPlaylist(playlist: Element) {
	const playlistTextElement = playlist.firstElementChild!;
	const playlistHref = playlist.attributes.getNamedItem("href")!.value;
	const playlistId = getPlaylistId(playlistHref);

	if (requestsInProgress[playlistId])
		return;

	if (playlistHref.includes("/playlist/") && playlistTextElement?.firstChild?.nodeName !== "IMG") {
		const playlistId = getPlaylistId(playlistHref);

		// Quick hack to limit number of requests and speed up performance
		requestsInProgress[playlistId] = true;

		const artworkUrl = await _cache.getArtworkUrl(playlistId);

		// Quick hack to limit number of requests and speed up performance
		requestsInProgress[playlistId] = false;

		if (playlistTextElement?.firstChild?.nodeName === "IMG")
			return;

		playlistTextElement.setAttribute("style", "display: flex;align-items: center;");

		let imgElement;

		if (artworkUrl)
			imgElement = createImageElement(artworkUrl, playlistId);
		else {
			if (playlistTextElement?.firstChild?.nodeName === "svg")
				return;

			imgElement = createMissingArtworkImg();
		}

		playlistTextElement.prepend(imgElement);
	} else if (!playlistHref.includes("/playlist/") && playlistTextElement?.firstChild?.nodeName !== "svg") {
		playlistTextElement.setAttribute("style", "display: flex;align-items: center;");

		const folderElement = createFolderElement();

		playlistTextElement.prepend(folderElement);
	}
}