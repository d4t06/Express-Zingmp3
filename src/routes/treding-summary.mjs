import { Router } from "express";
import TrendingService from "../services/TrendingService.mjs";

const trendingRoute = Router();


trendingRoute.get("/song", TrendingService.songSummarize);
trendingRoute.get("/search-log", TrendingService.searchLogSummarize);
trendingRoute.get("/test", TrendingService.test);

export default trendingRoute;
