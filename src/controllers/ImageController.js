const {encode} = require("blurhash");
const sharp = require("sharp");

class ImageController {
   async encodeBlurhash(req, res) {
      try {
         const imageBlob = req.body;
         const before = Date.now();

         const { data, info } = await sharp(imageBlob).ensureAlpha().raw().toBuffer({
            resolveWithObject: true,
         });

         const encoded = encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4);
         const after = Date.now();

         console.log("finished after", (after - before) / 1000);
         res.json({ encode: encoded });
      } catch (error) {
         console.log(error);
         res.status(500).json({ error: error.message });
      }
   }
}

module.exports = new ImageController();
