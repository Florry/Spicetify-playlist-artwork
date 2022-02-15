import { registerEventListeners } from "./listeners/eventListeners";
import { registerContextMenues } from "./menues/contextMenues";
import { registerSubMenues } from "./menues/subMenues";
import { Cache } from "./repos/Cache";
import { getPlaylistPanel } from "./utils/htmlUtils";
import { addArtworkToPlaylists, registerPlaylistUtilsCache } from "./utils/playlistUtils";

async function main() {
	const cache = await Cache.connect();

	let playlistPanel = getPlaylistPanel();

	while (!playlistPanel) {
		playlistPanel = getPlaylistPanel();
		await new Promise(resolve => setTimeout(resolve, 100));
	}

	registerEventListeners();
	registerPlaylistUtilsCache(cache);
	registerContextMenues(cache);
	registerSubMenues(cache);

	addArtworkToPlaylists();

	Spicetify.showNotification("Playlist artwork loaded");
}

export default main;
