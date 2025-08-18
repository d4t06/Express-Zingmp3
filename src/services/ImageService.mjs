import { encode } from "blurhash";
import sharp from "sharp";

const getEncode = async (input) => {
  const before = Date.now();

  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  });

  const encoded = encode(
    new Uint8ClampedArray(data),
    info.width,
    info.height,
    4,
    4,
  );
  const timeConsuming = (Date.now() - before) / 1000;
  return { encoded, timeConsuming };
};

class ImageController {
  async encodeBlurhash(req, res, next) {
    try {
      const imageBlob = req.body;
      if (!imageBlob) return res.error(400, "No have image blob");

      const { encoded, timeConsuming } = await getEncode(imageBlob);

      console.log("Encode finished after", timeConsuming);

      res.success(200, { encode: encoded }, "encode ok");
    } catch (error) {
      next(error);
    }
  }

  async optimize(req, res, next) {
    try {
      const file = req.file;
      if (!file) return res.error(400, "No have file");

      const { height, width } = req.query;

      const _height =
        height && !isNaN(+height) && +height > 100 ? +height : 500;

      const _width = width && !isNaN(+width) && +width > 100 ? +width : 500;

      const imageBuffer = file.buffer;
      if (!imageBuffer) return res.error(400, "No have image buffer");

      const start = Date.now();
      const newImageBuffer = await sharp(imageBuffer)
        .resize({ width: _width, height: _height, fit: "cover" })
        .toBuffer();
      const finish = Date.now();

      console.log("Optimize finished after", (finish - start) / 1000);

      res.send(newImageBuffer);
    } catch (error) {
      next(error);
    }
  }
}

export default new ImageController();
