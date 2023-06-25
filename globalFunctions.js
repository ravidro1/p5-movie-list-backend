const jwt = require("jsonwebtoken");

export const isTokenVerify = (req, res, next) => {
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
