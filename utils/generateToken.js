const jwt = require("jsonwebtoken");

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // short expiry
  );

  const refreshToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" } // long expiry
  );

  return { accessToken, refreshToken };
};

module.exports = generateTokens;
