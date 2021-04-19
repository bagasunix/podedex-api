// Import Models
const User = require("../models/userM");
// Lib Validator
const validator = require("fastest-validator");
const v = new validator();
// Lib Token
const jwt = require("jsonwebtoken");
// Lib Error
const catchAsync = require("../utils/catchAsync");
const AppErr = require("../utils/appErr");

const APIFeatures = require("../utils/apiFeature");

const {
  JWT_SECRET,
  JWT_ACCESS_EXPIRED,
  JWT_COOKIES_EXPIRED,
  NODE_ENV,
} = process.env;

const signToken = (id, name, email, role, active) => {
  return jwt.sign(
    {
      id,
      name,
      email,
      role,
      active,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_ACCESS_EXPIRED,
    }
  );
};

module.exports = {
  getAllUsers: catchAsync(async (req, res, next) => {
    const features = new APIFeatures(User.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const users = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  }),
  addUser: catchAsync(async (req, res) => {
    const { name, email, password, passwordConfirm, role, active } = req.body;

    const schema = {
      name: "string|empty:false",
      email: "email|empty:false|min:5",
      password: "string|empty:false|min:8",
      passwordConfirm: { type: "equal", field: "password" },
      role: {
        type: "enum",
        values: ["user", "admin", "lead-guides", "guides"],
        default: ["user"],
      },
      active: { type: "boolean", default: false },
    };

    const validate = v.validate(req.body, schema);

    if (validate.length) {
      return res.status(400).json({
        status: "error",
        message: validate,
      });
    }

    const CheckDup = await User.findOne({
      where: { email: email },
    });

    if (CheckDup) {
      return res.status(409).json({
        status: "error",
        message: "Email is already exist",
      });
    }

    const data = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      role,
      active,
    });

    res.status(200).json({
      status: "success",
      message: `Success Add User`,
      data: {
        name: data.name,
        email: data.email,
        avatar: data.avatar,
      },
    });
  }),

  login: catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // Check If Email and Password Exist
    const valid = {
      email: "email|empty:false|min:5",
      password: "string|empty:false|min:8",
    };

    const validate = v.validate(req.body, valid);

    if (validate.length) {
      return res.status(400).json({
        status: "error",
        message: validate,
      });
    }
    // Check If User Exist && Password is Correct
    const user = await User.findOne({ email }).select("+password");

    const correct = await user.correctPassword(password, user.password);

    if (!user || !correct) {
      return next(new AppErr("Incorrect Email or Password", 401));
    }

    // If Everything Ok, Send token To Client
    const token = signToken(
      user._id,
      user.name,
      user.email,
      user.role,
      user.avatar,
      user.active
    );

    const cookieOptions = {
      expires: new Date(
        Date.now() + JWT_COOKIES_EXPIRED * 24 * 60 * 60 * 1000 // Time Expired * Hours * Minute * Second * MilliSecond
      ),
      httpOnly: true,
    };

    if (NODE_ENV === "production") cookieOptions.Secure = true;

    res.cookie("jwt", token, cookieOptions);

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      message: `Success Login`,
      data: {
        token: token,
      },
    });
  }),

  logout: catchAsync(async (req, res, next) => {
    const searchToken = await RefreshToken.deleteMany({
      user_id: req.user.id,
    });

    if (!searchToken) {
      return next(new AppErr(`No user found with that ID ${userId}`, 404));
    }

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      message: `Success Logout`,
    });
  }),
};
