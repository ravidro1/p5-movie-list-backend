const express = require("express");
const {
  signUp,
  login,
  logout,
  refreshToken,
} = require("../controllers/userController");
const { isTokenVerify } = require("../globalFunctions");
const router = express.Router();

router.post("/sign-up", signUp);
router.post("/login", login);
router.delete("/logout", logout);

router.get("/refresh-token", refreshToken);
router.get("/is-token-verify", isTokenVerify, (req, res) =>
  res.status(200).json({ message: "token valid" })
);

module.exports = router;
