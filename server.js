require("dotenv").config();
const cors = require("cors");

const express = require("express");
const User = require("./models/User");
const database = require("./database");
const app = express();

const PORT = process.env.PORT;
const userRoutes = require("./routes/userRoutes");

app.use(express.json());
app.use(cors({ credentials: true, origin: [process.env.FRONTEND_URL] }));

async function registerTable() {
  await User.registerTable();
}

async function main() {
  await registerTable();

  app.use("/user", userRoutes);

  app.listen(PORT, () => console.log("Listen To Port: ", PORT));
}

main();
