const express = require("express");
const app = express();
const cors = require("cors")

const port = process.env.PORT || 3000;
const route = require('./src/routes')
app.use(cors({credentials: true, origin: "http://localhost:5173"}));

route(app)

app.listen(port, () => {
   console.log(`Example app listening on port ${port}`);
});
