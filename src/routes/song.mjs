import { Router } from "express";
import SongService from "../services/SongService.mjs";

const songDailyRoute = Router();


songDailyRoute.get("/summary", SongService.weeklySummarize);
songDailyRoute.get("/test", SongService.test);

export default songDailyRoute;
