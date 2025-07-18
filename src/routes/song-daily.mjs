import { Router } from "express";
import SongDailyService from "../services/SongDailyService.mjs";

const songDailyRoute = Router();


songDailyRoute.get("/summary", SongDailyService.summarize);

export default songDailyRoute;
