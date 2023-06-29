const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const validatePassword = (password, verifyPassword, maxLength, minLength) => {
  if (password.length > maxLength && maxLength != null) return false;
  if (password.length < minLength && minLength != null) return false;
  return password === verifyPassword;
};

const createTokens = (id) => {
  const accessToken = jwt.sign(
    { user_id: id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "6h",
    }
  );
  const refreshToken = jwt.sign(
    { user_id: id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "80d",
    }
  );

  return { accessToken, refreshToken };
};

exports.signUp = async (req, res) => {
  try {
    const { username, password, verifyPassword } = req.body;

    if (!validatePassword(password, verifyPassword, 20, 8))
      return res.status(400).json({
        message:
          "password And verifyPassword Must Be Same And password Length Need To Be Between 8-20",
      });

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ username, password: hashPassword });

    console.log(user);

    if (!user) return res.status(400).json({ message: "User Creation Fail" });

    const { accessToken, refreshToken } = createTokens(user.id);
    res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        maxAge: 900000,
        expires: new Date(Date.now() + 900000),
        httpOnly: true,
      })
      .json({ message: "success", accessToken: accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ conditionObj: { username } });
    if (!user) return res.status(400).json({ message: "User Not Found" });

    const isPasswordValid = await bcrypt.compare(
      password.toString(),
      user.password
    );

    if (!isPasswordValid)
      return res.status(400).json({ message: "Password Invalid" });
    const { accessToken, refreshToken } = createTokens(user.id);
    res
      .status(200)
      .cookie("refreshToken", refreshToken)
      .json({ message: "success", accessToken: accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  res
    .status(200)
    .clearCookie("refreshToken")
    .json({ message: "cookie deleted" });
};

exports.refreshToken = async (req, res) => {
  try {
    const cookiesArray = req.headers.cookie.split(";");
    let refreshToken = null;
    for (i in cookiesArray) {
      const currentCookie = cookiesArray[i].split("=");
      if (currentCookie[0] == "refreshToken") refreshToken = currentCookie[1];
    }

    const isRefreshTokenValid = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    if (!isRefreshTokenValid) {
      return res.status(400).json({ message: "Invalid Token" });
    }
    const { user_id } = jwt.decode(refreshToken);

    const { accessToken } = createTokens(user_id);
    res.status(200).json({ message: "success", accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
