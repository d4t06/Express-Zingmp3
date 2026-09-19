import { Router } from "express";
import SongService from "../services/SongService.mjs";

const songRouter = Router();

const songService = new SongService()

songRouter.get("/", songService.getSongs);

export default songRouter;
