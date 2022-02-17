const imgElemCache: Record<string, HTMLImageElement> = {};

export function createImageElement(src: string, playlistId: string) {
	if (imgElemCache[src + playlistId])
		return imgElemCache[src + playlistId];

	const img = document.createElement("img");

	img.setAttribute("style", "display: inline; margin-right: 10px;border-radius: 2px;");
	img.setAttribute("height", "21");
	img.setAttribute("width", "21");
	img.setAttribute("src", src);

	imgElemCache[src + playlistId] = img;

	return img;
}

let folderSvgElemCache: SVGSVGElement;

export function createFolderElement() {
	if (folderSvgElemCache)
		return folderSvgElemCache.cloneNode(true);

	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

	// @ts-ignore
	svg.innerHTML = Spicetify.SVGIcons["playlist-folder"];
	svg.setAttribute("height", "16");
	svg.setAttribute("width", "16");
	svg.setAttribute("viewBox", "0 0 16 16");
	svg.setAttribute("fill", "currentColor");
	svg.setAttribute("style", "margin-right: 12px;margin-bottom:3px;margin-left:2px;");

	folderSvgElemCache = svg;

	return svg;
}

let missingArtworkSvgElemCache: SVGSVGElement;

export function createMissingArtworkImg() {
	if (missingArtworkSvgElemCache)
		return missingArtworkSvgElemCache.cloneNode(true);

	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

	svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
	svg.setAttribute("viewBox", "0 0 80 81");
	svg.setAttribute("style", "margin-right: 15px;");
	svg.setAttribute("height", "25");
	svg.setAttribute("width", "20");

	path.setAttribute("d", "M25.6 11.565v45.38c-2.643-3.27-6.68-5.37-11.2-5.37-7.94 0-14.4 6.46-14.4 14.4s6.46 14.4 14.4 14.4 14.4-6.46 14.4-14.4v-51.82l48-10.205V47.2c-2.642-3.27-6.678-5.37-11.2-5.37-7.94 0-14.4 6.46-14.4 14.4s6.46 14.4 14.4 14.4S80 64.17 80 56.23V0L25.6 11.565zm-11.2 65.61c-6.176 0-11.2-5.025-11.2-11.2 0-6.177 5.024-11.2 11.2-11.2 6.176 0 11.2 5.023 11.2 11.2 0 6.174-5.026 11.2-11.2 11.2zm51.2-9.745c-6.176 0-11.2-5.024-11.2-11.2 0-6.174 5.024-11.2 11.2-11.2 6.176 0 11.2 5.026 11.2 11.2 0 6.178-5.026 11.2-11.2 11.2z");
	path.setAttribute("fill", "currentColor");
	path.setAttribute("fill-rule", "evenodd");

	svg.append(path);

	missingArtworkSvgElemCache = svg;

	return svg;
}

function getPlaylistPanel() {
	return document.getElementsByClassName("os-viewport os-viewport-native-scrollbars-invisible").item(0);
}

export async function waitForPlaylistPanel() {
	let playlistPanel = getPlaylistPanel();

	while (!playlistPanel) {
		playlistPanel = getPlaylistPanel();
		await new Promise((resolve) => setTimeout(resolve, 100));
	}

	return playlistPanel;
}