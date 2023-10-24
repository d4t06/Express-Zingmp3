const express = require("express");
const router = express.Router();
const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const ImageController = require("../controllers/ImageController")

router.post("/encode", express.raw({type: '*/*', limit: '1mb'}), ImageController.encodeBlurhash);

router.post("/optimize", upload.single("file"), ImageController.optimize);

module.exports = router;