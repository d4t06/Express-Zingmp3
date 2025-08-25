import imageRouter from "./image.mjs";
import trendingSummary from "./treding-summary.mjs";
import storageRouter from "./storage.mjs";
import spotifyRouter from "./spotify.mjs";

export default function appRoute(app) {
  app.use("/api/image", imageRouter);
  app.use("/api/storage", storageRouter);
  app.use("/api/trending-summary", trendingSummary);
  app.use("/api/spotify", spotifyRouter);

  app.get("/api/greeting", (_req, res) => {
    res.success(200, null, "Gretting");
  });

  app.get("/api", (_req, res) => {
    res.success(200, null, "OK");
  });

  app.use("*", (_req, res) => {
    res.error(404, "endpoint not found");
  });
}
