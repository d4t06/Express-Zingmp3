import { Router } from "express";
import StorageService from "../services/StorageService.mjs";
import authMiddleWare from "../middlewares/auth.mjs";

const storageRouter = Router();

storageRouter.use(authMiddleWare);

const storageService = new StorageService();

storageRouter.get("/auth", storageService.auth.bind(storageService));
storageRouter.delete("/:fileId", storageService.delete.bind(storageService));

export default storageRouter;
