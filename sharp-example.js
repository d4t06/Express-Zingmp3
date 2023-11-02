const sharp = require("sharp");

sharp("./img-result.jpg")
   .resize({ width: 900, height: 700, fit: "cover", withoutEnlargement: false })
   .toFile("img-result-3.jpg")
   .then(console.log("finish"));
