require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const AppErr = require("./utils/appErr");
const ErrHandller = require("./controllers/errorC");

// Database
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Database Connection Successful!"));

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}
const limiter = rateLimit({
  max: 5,
  windowMs: 01 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/", limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.all("*", (req, res, next) => {
  next(new AppErr(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(ErrHandller);

module.exports = app;
