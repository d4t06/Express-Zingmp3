const whiteList =
   typeof process.env.WHITE_LIST.split(", ") === "object"
      ? process.env.WHITE_LIST.split(", ")
      : [];

const corsOptions = {
   // Credential: true,
   // cb(error, options) params
   origin: (origin, cb) => {
      if (whiteList.indexOf(origin) !== -1 || !origin) cb(null, true);
      else cb("[error]: Not allowed by cors");
   },
   optionsSuccessStatus: 200,
};

module.exports = corsOptions;
