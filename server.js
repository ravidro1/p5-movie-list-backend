require("dotenv").config();
const cors = require("cors");

const express = require("express");
const User = require("./models/User");
const database = require("./database");
const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

async function registerTable() {
  await User.registerTable();
}

async function main() {
  await registerTable();

  //   User.findAll().then((res) => console.log(res));
  // console.log(User.getName());

  // User.deleteOne({ username: "null1" });
  // User.create({ username: "1", password: "1" });
  // User.updateOne({ username: "321" }, { username: "3221323" });
  User.updateOne({ username: "321'" }, { username: "3221323" });
  // User.create({});3213
  // User.create({ otherUserID: 7 });

  //   const user = await User.findById(2);
  //   const user = await User.deleteById(2);
  //   const user = await User.findOne({ id: 2 });
  //   console.log(user);

  app.listen(PORT, () => console.log("Listen To Port: ", PORT));
}

main();
