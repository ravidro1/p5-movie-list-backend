require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();

const PORT = process.env.PORT;

const { User, MovieReview, OneRate } = require("./models");
const userRoutes = require("./routes/userRoutes");
const movieReviewRoutes = require("./routes/movieReviewRoutes");
const { main2 } = require("./models/statement");

app.use(express.json());
app.use(cors({ credentials: true, origin: [process.env.FRONTEND_URL] }));

async function registerTable() {
  await User.registerTable();
  await MovieReview.registerTable();
  await OneRate.registerTable();
  // MovieReview.update({ updateFields: { description: "432" } });
}

async function main() {
  await registerTable();

  // log the path before every request
  app.use((req, res, next) => {
    console.log(req.path);
    next();
  });
  // app.use((req, res, next) => {
  //   Object.keys(req.body).map((key) => {
  //     console.log(req.body[key], 32);
  //     if (!req.body[key]) req.body[key] = null;
  //   });

  //   next();
  // });

  app.use("/user", userRoutes);
  app.use("/movieReview", movieReviewRoutes);

  app.listen(PORT, () => console.log("Listen To Port: ", PORT));
}

main();
main2();
// console.log(cloudinary.config());
// cloudinary.
