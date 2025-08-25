import { Router } from "express";
import SpotifyService from "../services/SpotifyService.mjs";

const spotifyRouter = Router();

spotifyRouter.get("/token", SpotifyService.getToken);

export default spotifyRouter;
