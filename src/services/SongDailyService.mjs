import { Timestamp } from "firebase-admin/firestore";
import { db } from "../firebase/index.mjs";

const generateTimestamp = (times) => {
  const now = new Date();

  const date = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    ...times,
  );

  return Timestamp.fromDate(date);
};

class SongDailyService {
  summarize = async (req, res, next) => {
    try {
      // Convert to Firestore Timestamps
      const startTimestamp = generateTimestamp([0, 0, 0, 0]);
      const endTimestamp = generateTimestamp([23, 59, 59, 999]);

      // 2. Construct the query
      const queryRef = db
        .collection("SongDaily")
        .where("created_at", ">=", startTimestamp)
        .where("created_at", "<=", endTimestamp)
        .orderBy("play", "desc");

      const snapshot = await queryRef.get(); // Get all documents in the collection

      if (snapshot.empty) {
        return res.error(404, "No songs found.");
      }

      const songs = [];
      snapshot.forEach((doc) => {
        songs.push({ id: doc.id, ...doc.data() });
      });

      res.success(200, songs);
    } catch (error) {
      next(error);
    }
  };
}

export default new SongDailyService();
