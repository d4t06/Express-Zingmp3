import { Router } from "express";
import TrendingService from "../services/TrendingService.mjs";

const trendingRoute = Router();

trendingRoute.get("/song-weekly", TrendingService.songSummarize);
trendingRoute.get("/search-log", TrendingService.searchLogSummarize);
trendingRoute.get("/search-daily", TrendingService.keywordDailyCleanUp);

export default trendingRoute;
