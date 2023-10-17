const express = require("express");
const router = express.Router();

const ImageController = require("../controllers/ImageController")

router.post("/encode", express.raw({type: '*/*'}), ImageController.encodeBlurhash);

module.exports = router;