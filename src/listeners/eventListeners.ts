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

	/** When clicking cover art to go to a playlist */
	document.getElementsByClassName("main-coverSlotCollapsed-container").item(0)?.addEventListener("click", () => setTimeout(() => addArtworkToPlaylists(), 50));
	document.getElementsByClassName("main-coverSlotExpanded-container").item(0)?.addEventListener("click", () => setTimeout(() => addArtworkToPlaylists(), 50));
}