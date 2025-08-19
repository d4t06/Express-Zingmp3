import { Router } from "express";
import TrendingService from "../services/TrendingService.mjs";
import cronCheckSecret from "../middlewares/cronCheckSecret.mjs";

const trendingRoute = Router();

trendingRoute.use(cronCheckSecret);

trendingRoute.get("/song-weekly", TrendingService.songSummarize);
trendingRoute.get("/search-log", TrendingService.searchLogSummarize);
trendingRoute.get("/search-daily", TrendingService.keywordDailyCleanUp);
trendingRoute.get("/reset", TrendingService.resetSongRank);

export default trendingRoute;
