export function getPlaylistId(href: string) {
	return href.split("/").pop() as string;
}

export async function waitForSpicetify() {
	while (!(Spicetify.CosmosAsync && Spicetify.Queue && Spicetify.ContextMenu && Spicetify.URI)) {
		await new Promise((resolve) => setTimeout(resolve, 100));
	}
}