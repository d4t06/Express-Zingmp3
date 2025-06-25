// import cors config and config dotenv
import corsOptions from "./src/config/corsOption.mjs";

// init firebase app
import "./src/firebase/index.mjs";

import cors from "cors";
import express from "express";
import appRoute from "./src/routes/index.mjs";
import customResponse from "./src/system/customResponse.mjs";
import errorHandler from "./src/middlewares/errorHandler.mjs";

const port = process.env.PORT || 4000;

const app = express();

// exteand app.response
customResponse(app);

// enable cors
app.use(cors(corsOptions));

// index route
appRoute(app);

// global error middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(
    `App listening on port ${port}, WHITE_LIST: ${process.env.WHITE_LIST || ""}`,
  );
});
