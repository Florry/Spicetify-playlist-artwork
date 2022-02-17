import { registerEventListeners } from "./listeners/eventListeners";
import { registerContextMenues } from "./menues/contextMenues";
import { registerSubMenues } from "./menues/subMenues";
import { Cache } from "./repos/Cache";
import { waitForPlaylistPanel } from "./utils/htmlUtils";
import { registerPlaylistUtilsCache } from "./utils/playlistUtils";
import { waitForSpicetify } from "./utils/utils";

async function main() {
  const cache = await Cache.connect();

  await waitForPlaylistPanel();

  registerEventListeners();

  await waitForSpicetify();

  registerPlaylistUtilsCache(cache);
  registerContextMenues(cache);
  registerSubMenues(cache);

  Spicetify.showNotification("Playlist artwork loaded");
}

export default main;
