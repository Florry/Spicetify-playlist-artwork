export function getPlaylistId(href: string) {
	return href.split("/").pop() as string;
}