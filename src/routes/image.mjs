import { Router, raw } from "express";
import multer, { memoryStorage } from "multer";
import ImageService from "../services/ImageService.mjs";

const imageRouter = Router();
const storage = memoryStorage();
const upload = multer({ storage: storage });

imageRouter.post(
	"/encode",
	raw({ type: "*/*", limit: "3mb" }),
	ImageService.encodeBlurhash,
);

imageRouter.post("/optimize", upload.single("file"), ImageService.optimize);

export default imageRouter;
