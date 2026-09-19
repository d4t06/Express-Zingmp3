import { FieldPath } from "firebase-admin/firestore";
import { db } from "../firebase/index.mjs";

function mergeSortedArrays(arr1, arr2) {
	let mergedArray = [];
	let i = 0;
	let j = 0;

	while (i < arr1.length && j < arr2.length) {
		if (arr1[i].first_letter <= arr2[j].first_letter) {
			mergedArray.push(arr1[i]);
			i++;
		} else {
			mergedArray.push(arr2[j]);
			j++;
		}
	}

	while (i < arr1.length) {
		mergedArray.push(arr1[i]);
		i++;
	}

	while (j < arr2.length) {
		mergedArray.push(arr2[j]);
		j++;
	}

	return mergedArray;
}

function sortMultiSongLists(arrays) {
	if (arrays.length === 0) {
		return [];
	}
	let mergedResult = arrays[0];
	for (let i = 1; i < arrays.length; i++) {
		mergedResult = mergeSortedArrays(mergedResult, arrays[i]);
	}
	return mergedResult;
}

class SongService {
	async getSongs(req, res, next) {
		try {
			let songs = [];

			const playlistSnap = await db
				.collection("Playlists")
				.doc("rNSgjVwKRlQIR2O2qZ45")
				.get();

			if (playlistSnap.exists) {
				const playlist = playlistSnap.data();

				if (!playlist.song_ids) return [];

				const chunkSize = 20;
				const chunks = [];
				for (let i = 0; i < playlist.song_ids.length; i += chunkSize) {
					chunks.push(playlist.song_ids.slice(i, i + chunkSize));
				}

				const playlistSongs = [];

				for (const chunk of chunks) {
					if (chunk.length > 0) {
						const songsSnap = await db
							.collection("Songs")
							.where(FieldPath.documentId(), "in", chunk)
							.orderBy("first_letter")
							.get();

						if (!!songsSnap.docs.length) {
							const result = songsSnap.docs.map((doc) => {
								const song = { ...doc.data(), id: doc.id };
								return song;
							});

							playlistSongs.push(result);
						}
					}
				}

				if (playlistSongs.length === 1) return playlistSongs[0];

				songs = sortMultiSongLists(playlistSongs);
			}

			res.success(200, songs, "get songs ok");
		} catch (error) {
			next(error);
		}
	}
}

export default SongService;
