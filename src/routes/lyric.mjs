import { Router } from "express";
import LyricService from "../services/LyricService.mjs";

const lyricRouter = Router();

lyricRouter.get("/:id", LyricService.getLyric);

export default lyricRouter;
