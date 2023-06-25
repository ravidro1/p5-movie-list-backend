const express = require("express");
const jwt = require("jsonwebtoken");
const {
  signUp,
  login,
  logout,
  refreshToken,
} = require("../controllers/userController");
const router = express.Router();

const isTokenVerify = (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];

    console.error(token, 1);
    if (!token) return res.status(401).json({ message: "Token Required" });
    else {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          res.status(401).json({ message: "Token Wrong" });
        } else {
          req.userID = decoded.user_id;
          next();
        }
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

router.post("/sign-up", signUp);
router.post("/login", login);
router.delete("/logout", logout);

router.get("/refresh-token", refreshToken);
router.get("/is-token-verify", isTokenVerify, (req, res) =>
  res.status(200).json({ message: "token valid" })
);

module.exports = router;
