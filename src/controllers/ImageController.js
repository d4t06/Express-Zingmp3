const { encode } = require("blurhash");
const sharp = require("sharp");

const getEncode = async (input) => {
   const before = Date.now();

   const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({
      resolveWithObject: true,
   });

   const encoded = encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4);
   const timeConsuming = (Date.now() - before) / 1000;
   return { encoded, timeConsuming };
};

class ImageController {
   async encodeBlurhash(req, res) {
      try {
         const imageBlob = req.body;
         const { encoded, timeConsuming } = await getEncode(imageBlob);

         console.log("encode finished after", timeConsuming);

         res.json({ encode: encoded });
      } catch (error) {
         console.log(error);
         res.status(500).json({ error: error.message });
      }
   }

   async optimize(req, res) {
      try {
         const imageBuffer = req.file.buffer;

         const start = Date.now();
         const newImageBuffer = await sharp(imageBuffer)
            .resize({ width: 500, height: 500, fit: "cover" })
            .toBuffer();
         const finish = Date.now();

         console.log("optimize finished after", (finish - start) / 1000);
         res.send(newImageBuffer);

      } catch (error) {
         console.log(error);
         res.status(500).json({ error: error.message });
      }
   }
}

module.exports = new ImageController();
