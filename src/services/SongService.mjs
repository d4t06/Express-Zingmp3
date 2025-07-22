import { Timestamp, FieldValue } from "firebase-admin/firestore";
import { db } from "../firebase/index.mjs";

function getWeekAndYear(date) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  return { week: weekNo, year: d.getUTCFullYear() };
}

class SongService {
  weeklySummarize = async (req, res, next) => {
    try {
      // Calculate the timestamp for one week ago
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
          .limit(5);
      });

      const trendingSongMap = {};
      const batch = db.batch();

      const snapshots = await Promise.all(queriesRef.map((q) => q.get()));

      snapshots.forEach((snapshot, i) => {
        const trendingSongs = [];

        snapshot.docs.forEach((doc) => {
          const songRef = doc.ref;  

          const songData = doc.data();

          const currentWeekPlays = songData.week_play || 0;
          const lastWeekPlays = songData.last_week_play || 0;

          let trendingScore = 0;
          if (lastWeekPlays > 0) {
            trendingScore =
              (currentWeekPlays - lastWeekPlays) / (lastWeekPlays + 1);
          } else if (currentWeekPlays > 0) {
            // For new songs or songs that had 0 plays last week but plays this week
            trendingScore = currentWeekPlays;
          }

          batch.update(songRef, {
            last_week_play: currentWeekPlays,
            // week_play: 0, // Reset for the new week
            trending_score: trendingScore,
          });

          trendingSongs.push({
            song_id: doc.id,
            week_play: currentWeekPlays,
            trending_score: trendingScore,
          });
        });

        trendingSongMap[genreSnap.docs[i].id] = [...trendingSongs];
      });

      const { week: weekNumber, year } = getWeekAndYear(oneWeekAgo);
      const weekDocId = `${year}-W${String(weekNumber).padStart(2, "0")}`;

      await db.collection("Trending_Metrics").doc(weekDocId).set({
        trending_songs: trendingSongMap,
        created_at: FieldValue.serverTimestamp(),
      });

      res.success(200, "Weekly summarize successful");
    } catch (error) {
      next(error);
    }
  };

  test = async (req, res, next) => {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const oneWeekAgoTimestamp = Timestamp.fromDate(oneWeekAgo);

      const q = db
        .collection("Songs")
        .where(`main_genre.id`, "==", "HYXwjZuEG8NXDGZ3C9gf")
        .where("last_active", ">=", oneWeekAgoTimestamp)
        .orderBy("week_play", "desc")
        .limit(5);

      const snap = await q.get();

      res.success(
        200,
        snap.docs.map((d) => d.data()),
      );
    } catch (error) {
      next(error);
    }
  };
}

export default new SongService();
