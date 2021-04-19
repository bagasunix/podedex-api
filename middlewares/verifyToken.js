// Import Models
const User = require("../models/userM");
// Lib Util
const { promisify } = require("util");
// Lib Token
const jwt = require("jsonwebtoken");
// Lib Error
const catchAsync = require("../utils/catchAsync");
const AppErr = require("../utils/appErr");

module.exports = catchAsync(async (req, res, next) => {
  const { JWT_SECRET } = process.env;
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("BagasUnix")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppErr("You are not logged in! Please log in to get access.", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppErr("The user belonging to this token does no longer exist.", 401)
    );
  }

  req.user = currentUser;
  next();
});
