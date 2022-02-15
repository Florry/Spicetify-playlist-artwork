export class CosmosClient {

	private constructor() { }

	static async getPlaylistArtwork(playlistId: string) {
		const uri = Spicetify.URI.fromString(`spotify:playlist:${playlistId}`);
		const res = await Spicetify.CosmosAsync.get(
			`sp://core-playlist/v1/playlist/${uri}/metadata`,
			{ policy: { picture: true } }
		);

		return res.metadata.picture;
	}

}