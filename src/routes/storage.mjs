import { Router } from "express";
import StorageService from "../services/StorageService.mjs";
import authMiddleWare from "../middlewares/auth.mjs";

const storageRouter = Router();

storageRouter.use(authMiddleWare);

storageRouter.get("/auth", StorageService.auth);
storageRouter.delete("/:fileId", StorageService.delete);

export default storageRouter;
