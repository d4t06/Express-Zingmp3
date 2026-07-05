import { Router } from "express";
import SongService from "../services/song_service.mjs";

const songRouter = Router();

songRouter.get("/", SongService.getSongs);

export default songRouter;
