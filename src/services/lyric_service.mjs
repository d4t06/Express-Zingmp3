import { db } from "../firebase/index.mjs";
import ObjectNotFound from "../system/errors/ObjectNotFound.mjs";

class LyricService {
	async getLyric(req, res, next) {
		try {
			const id = req.params.id;
			if (!id) throw new Error();

			const lyricSnap = await db.collection("Lyrics").doc(id).get();

			if (lyricSnap.exists) {
				return res.success(200, lyricSnap.data(), "get lyric ok");
			}

			throw new ObjectNotFound('lyric not found');
		} catch (error) {
			next(error);
		}
	}
}

export default new LyricService();
