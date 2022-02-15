import { CACHE_DB_NAME, CACHE_DB_KEY, DB_VERSION } from "../constants/dbConstants";
import { CosmosClient } from "../data/CosmosClient";
interface CacheItem {
	uri: string;
	artworkUrl: string;
};

export class Cache {

	private inMemoryCache: Record<string, string> = {};

	private constructor(private db: IDBDatabase) { }

	static async connect(): Promise<Cache> {
		return new Promise((resolve, reject) => {
			const openRequest = indexedDB.open(CACHE_DB_NAME, DB_VERSION);

			openRequest.onupgradeneeded = () => {
				const db = openRequest.result;

				if (!db.objectStoreNames.contains(CACHE_DB_KEY))
					db.createObjectStore(CACHE_DB_KEY, { keyPath: "uri" });
			};

			openRequest.onsuccess = () => {
				const db = openRequest.result;
				const transaction = db.transaction(CACHE_DB_KEY, "readonly");
				const store = transaction.objectStore(CACHE_DB_KEY);
				const request = store.getAll();

				request.onsuccess = () => {
					const repo = new Cache(db);

					request.result.forEach((item: CacheItem) => repo.inMemoryCache[item.uri] = item.artworkUrl);

					resolve(repo);
				};
			};

			openRequest.onerror = () => reject(openRequest.error);
		})
	}

	addUri(uri: string, artworkUrl: string): Promise<string> {
		return new Promise((resolve, reject) => {
			const transaction = this.db.transaction(CACHE_DB_KEY, "readwrite");
			const store = transaction.objectStore(CACHE_DB_KEY);
			const request = store.add({
				uri,
				artworkUrl,
			});

			request.onsuccess = () => {
				this.inMemoryCache[uri] = artworkUrl;
				resolve(this.inMemoryCache[uri]);
			};
			request.onerror = () => reject(request.error);
		});
	}

	/** Gets artwork from cache if it exists, fetches it from api if not already cached */
	async getArtworkUrl(uriString: string): Promise<string | undefined> {
		if (uriString in this.inMemoryCache)
			return this.inMemoryCache[uriString];

		const dbContents = await this.get(uriString);

		if (dbContents)
			return dbContents;

		const picture = await CosmosClient.getPlaylistArtwork(uriString);

		this.addUri(uriString, picture);

		return picture;
	};

	private get(uri: string): Promise<string | undefined> {
		return new Promise((resolve, reject) => {
			const transaction = this.db.transaction(CACHE_DB_KEY, "readwrite");
			const store = transaction.objectStore(CACHE_DB_KEY);
			const request = store.get(uri);

			request.onsuccess = () => {
				this.inMemoryCache[uri] = request.result;
				resolve(this.inMemoryCache[uri]);
			};
			request.onerror = () => reject(request.error);
		});
	}

	deleteUri(uri: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const transaction = this.db.transaction(CACHE_DB_KEY, "readwrite");
			const store = transaction.objectStore(CACHE_DB_KEY);
			const request = store.delete(uri);

			request.onsuccess = () => {
				delete this.inMemoryCache[uri];
				resolve(undefined);
			};

			request.onerror = () => reject(request.error);
		});
	}

	clear() {
		return new Promise((resolve, reject) => {
			const transaction = this.db.transaction(CACHE_DB_KEY, "readwrite");
			const store = transaction.objectStore(CACHE_DB_KEY);
			const request = store.clear();

			request.onsuccess = () => {
				Object.keys(this.inMemoryCache).forEach((uri) => {
					delete this.inMemoryCache[uri];
				});
				resolve(undefined);
			};

			request.onerror = () => reject(request.error);
		});
	}
}

