const express = require("express");
const router = express.Router();

const ImageController = require("../controllers/ImageController")

router.post("/encode", express.raw({type: '*/*', limit: '1mb'}), ImageController.encodeBlurhash);

module.exports = router;