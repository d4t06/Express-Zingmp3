
const imageRouter = require('./image')

const route = function (app) {

   app.use("/api/image", imageRouter)

   app.use("/",(req, res) => {
      res.status(404).json("404") //not found
   });

};

module.exports = route;
