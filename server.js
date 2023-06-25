require("dotenv").config();
const cors = require("cors");
const express = require("express");
// const database = require("./database");
const app = express();

const PORT = process.env.PORT;

const { User, MovieReview, OneRate } = require("./models");
const userRoutes = require("./routes/userRoutes");

app.use(express.json());
app.use(cors({ credentials: true, origin: [process.env.FRONTEND_URL] }));

async function registerTable() {
  await User.registerTable();
  await MovieReview.registerTable();
  await OneRate.registerTable();

  // MovieReview.update(
  //   { name: "movie1onerateonerateonerate" },
  //   { name: "movie2" }
  // );
  // console.log(await User.find({ id: 1 }));

  // console.log(await OneRate.findAll());
  // console.log(await OneRate.findAvg("rate"));
}

async function main() {
  await registerTable();

  app.use("/user", userRoutes);

  app.listen(PORT, () => console.log("Listen To Port: ", PORT));
}

main();
