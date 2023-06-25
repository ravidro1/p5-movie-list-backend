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

  // await OneRate.create({ user_id: 1, movie_id: 1, rate: 80 });

  // MovieReview.update(
  //   { name: "movie1onerateonerateonerate" },
  //   { name: "movie2" }
  // );
  // console.log(await User.find({ id: 1 }));

  // console.log(await OneRate.findAll());
  // console.log(await OneRate.findAvg("rate"));
  // console.log(
  //   await database.execute(
  //     `SELECT IF (EXISTS (SELECT * FROM moviereview where id=7), 1, 2);`.replaceAll(
  //       "\n",
  //       ""
  //     )
  //   )
  // );
  // console.log(
  //   await database.execute(
  //     `IF EXISTS (SELECT * FROM moviereview WHERE id=1) SELECT * FROM moviereview WHERE id=1 else SELECT * FROM moviereview WHERE id=3;`
  //   )
  // );

  // console.log(
  //   await database.query(
  //     User._statementTypes.ifExists({
  //       condition: `SELECT * FROM moviereview WHERE name='movie7'`,
  //       action: `SELECT * FROM moviereview`,
  //       elseAction: `SELECT * FROM moviereview`,
  //       // action: `update moviereview set name=movie11`,
  //       // elseAction: `insert into moviereview(name,rate) values('movie7',9)`,
  //     })
  //   )
  // );

  // console.log(
  //   await database.execute(
  //     `INSERT INTO moviereview (name)
  //     VALUES ('q')
  //     ON DUPLICATE KEY UPDATE moviereview set name = 'q'
  //     WHERE name = 'we';`.replaceAll("\n", "")
  //   )
  // );
  // console.log(
  //   await database.execute(
  //     `GO IF EXISTS (SELECT * FROM moviereview WHERE name='movie7') select 1 else select 2`
  //   )
  // );

  // console.log(
  //   await database.execute(
  //     `IF EXISTS (SELECT * FROM moviereview WHERE name='movie7')
  //     BEGIN
  //        SELECT 1
  //     END
  //     ELSE
  //     BEGIN
  //         SELECT 2
  //     END;`.replaceAll("\n", "")
  //   )
  // );
  // console.log("good_luck_buddy".split("_").slice(1).join("_"));
}

async function main() {
  await registerTable();

  app.use("/user", userRoutes);

  app.listen(PORT, () => console.log("Listen To Port: ", PORT));
}

main();
