const express = require("express");
const app = express();
const cors = require("cors")
require('dotenv').config({ path: `.env.local`, override: true })

const corsOption = require("./src/config/corsOption")
app.use(cors(corsOption));

const port = process.env.PORT || 3000;
const route = require('./src/routes')

route(app)

app.listen(port, () => {
   console.log(`App listening on port ${port}, WHITE_LIST: ${process.env.WHITE_LIST || ''}`);
});
