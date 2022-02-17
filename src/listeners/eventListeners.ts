import { waitForPlaylistPanel } from "../utils/htmlUtils";
import { addArtworkToPlaylists } from "../utils/playlistUtils";

export async function registerEventListeners() {
	const playlistPanel = await waitForPlaylistPanel();
	const observer = new MutationObserver(() => setImmediate(() => addArtworkToPlaylists()));

	observer.observe(playlistPanel!, { childList: true, subtree: true });
}
