import { Timestamp, FieldValue } from "firebase-admin/firestore";
import { db } from "../firebase/index.mjs";

function getWeekAndYear(date) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const currentWeek = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  return { currentWeek, currentYear: d.getUTCFullYear() };
}

class TrendingService {
  songSummarize = async (req, res, next) => {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const oneWeekAgoTimestamp = Timestamp.fromDate(oneWeekAgo);

      const genreRef = db.collection("Genres").where("is_main", "==", true);

      const genreSnap = await genreRef.get();

      if (genreSnap.empty) return res.error(404, "No genre");

      const queriesRef = genreSnap.docs.map((doc) => {
        return db
          .collection("Songs")
          .where(`main_genre.id`, "==", doc.id)
          .where("last_active", ">=", oneWeekAgoTimestamp)
          .orderBy("week_play", "desc")
          .limit(10);
      });

      const trendingSongMap = {};
      const batch = db.batch();

      const snapshots = await Promise.all(queriesRef.map((q) => q.get()));

      snapshots.forEach((snapshot, i) => {
        const trendingSongs = [];

        snapshot.docs.forEach((doc, j) => {
          const songData = doc.data();

          batch.update(doc.ref, {
            week_play: 0,
            rank: j + 1,
          });

          trendingSongs.push({
            song_id: doc.id,
            last_week_rank: songData.rank || 0,
            rank: j + 1,
          });
        });

        trendingSongMap[genreSnap.docs[i].id] = trendingSongs;
      });

      const { currentWeek, currentYear } = getWeekAndYear(oneWeekAgo);

      const { week = currentWeek } = req.query;

      const weekDocId = `${currentYear}-W${String(week).padStart(2, "0")}`;

      await Promise.all[
        (db.collection("Trending_Songs").doc(weekDocId).set({
          trending_songs: trendingSongMap,
          created_at: FieldValue.serverTimestamp(),
        }),
        batch.commit())
      ];

      res.success(200, "Weekly summarize successful");
    } catch (error) {
      next(error);
    }
  };

  searchLogSummarize = async (_req, res, next) => {
    try {
      const keywordCount = {};

      const searchLogSnap = await db.collection("Search_Logs").get();

      if (searchLogSnap.empty) return res.success(200, "No new search log");

      const batch = db.batch();

      searchLogSnap.docs.forEach((doc) => {
        keywordCount[doc.data().keyword] =
          (keywordCount[doc.data().keyword] || 0) + 1;

        batch.delete(doc.ref);
      });

      for (const keyword in keywordCount) {
        const count = keywordCount[keyword];
        const trendingRef = db.collection("Trending_Keywords").doc(keyword);

        const trendingData = {
          today_count: FieldValue.increment(count),
          updated_at: FieldValue.serverTimestamp(),
        };

        batch.set(trendingRef, trendingData, { merge: true });
      }

      await batch.commit();

      res.success(200, "Summarize search logs successful");
    } catch (error) {
      next(error);
    }
  };

  keywordDailyCleanUp = async (_req, res, next) => {
    try {
      const keywordSnap = await db
        .collection("Trending_Keywords")
        .orderBy("today_count", "desc")
        .get();

      if (keywordSnap.empty) return res.success(200, "No new trending keyword");

      const batch = db.batch();

      keywordSnap.docs.forEach((doc, i) => {
        if (i < 3) {
          batch.update(doc.ref, { today_count: -i + 3 });
        } else {
          batch.delete(doc.ref);
        }
      });

      await batch.commit();

      res.success(200, "keywordDailyCleanUp successful");
    } catch (error) {
      next(error);
    }
  };

  resetSongRank = async (_req, res, next) => {
    try {
      const songSnapss = await db
        .collection("Songs")
        .orderBy("week_play", "desc")
        .get();

      const batch = db.batch();

      songSnapss.docs.forEach((doc) => {
        batch.update(doc.ref, { rank: 0 });
      });

      await batch.commit();

      res.success(200, "rest song rank successful");
    } catch (error) {
      next(error);
    }
  };
}

export default new TrendingService();
