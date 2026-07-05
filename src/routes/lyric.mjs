import { Router } from "express";
import LyricService from "../services/lyric_service.mjs";

const lyricRouter = Router();

lyricRouter.get("/:id", LyricService.getLyric);

export default lyricRouter;
