require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();

const PORT = process.env.PORT;

const { User, MovieReview, OneRate, MovieComment } = require("./models");
const userRoutes = require("./routes/userRoutes");
const movieReviewRoutes = require("./routes/movieReviewRoutes");
const oneRateRoutes = require("./routes/oneRateRoutes");
const movieCommentRoutes = require("./routes/movieCommentRoutes");
const { Select } = require("./models/statements");
const database = require("./database");

app.use(express.json());
app.use(cors({ credentials: true, origin: [process.env.FRONTEND_URL] }));

async function registerTable() {
  await User.registerTable();
  await MovieReview.registerTable();
  await OneRate.registerTable();
  await MovieComment.registerTable();
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
  app.use("/oneRate", oneRateRoutes);
  app.use("/movieCommentRoutes", movieCommentRoutes);

  app.listen(PORT, () => console.log("Listen To Port: ", PORT));

  const convertCharsToSafeChars = (array) => {
    const tempArray = array?.map((item) => {
      return String(item).replaceAll("'", "\\'").replaceAll('"', '\\"');
    });

    return tempArray;
  };
  const value = "3)); -- OR 1=1";

  const [safeStatement, second, third] = convertCharsToSafeChars([
    value,
    null,
    "hey",
  ]);
  console.log(safeStatement, second, third);

  const statement = Select.table("User")
    .condition_equalString({ column: "id", value: safeStatement })
    .selectEnd();

  console.log(statement);

  console.log((await database.execute(statement))[0]);
}

main();
// let test = JSON.stringify(false);
// console.log(test);
// console.log(typeof test);

// let test = JSON.parse("'");
// console.log(test);
// console.log(typeof test);
