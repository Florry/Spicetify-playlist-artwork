import { getPlaylistPanel } from "../utils/htmlUtils";
import { addArtworkToPlaylists } from "../utils/playlistUtils";

export async function registerEventListeners() {
	let playlistPanel = getPlaylistPanel();

	while (!playlistPanel) {
		playlistPanel = getPlaylistPanel();
		await new Promise(resolve => setTimeout(resolve, 200));
	}

	/** Scrolling playlist panel */
	playlistPanel?.addEventListener("scroll", () => addArtworkToPlaylists());

	/** Clicking on folders in playlist panel. setImmediate so that addArtworkToPlaylists runs after spotify's internal click events in the event loop */
	playlistPanel?.addEventListener("click", () => {
		setImmediate(() => addArtworkToPlaylists());

		// Edge case when closing folder so that the playlist panel scrolls up
		setTimeout(() => addArtworkToPlaylists(), 100);
	});

	/** When closing a folder so that the panel scrolls up and new playlists come into view */
	playlistPanel?.addEventListener("mouseup", () => setTimeout(() => addArtworkToPlaylists(), 25));

}