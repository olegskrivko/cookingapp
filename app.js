// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const engine = require("ejs-mate");
const methodOverride = require("method-override");
const AppError = require("./utils/appError");
// const globalErrorHandler = require("./controllers/errorController");
const { handleErrors, handleUnhandledErrors } = require("./controllers/errorController");
// Define routes
const recipeRoute = require("./routes/recipeRoutes");
const userRoute = require("./routes/userRoutes");
// const flash = require("connect-flash");
// const session = require("express-session");

const app = express();

// Middleware
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(express.json());
// app.use(
//   session({
//     secret: "my-secret-key",
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// app.use(flash());

// Database connection - Connect to MongoDB
const DB = process.env.MONGODB_URI;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.get("/about", (req, res) => {
  //console.log(req.headers["accept-language"]);
  res.render("about");
});
app.get("/glossary", (req, res) => {
  const alphabet = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];

  res.render("glossary", { alphabet });
});
app.use("/api/recipes", recipeRoute);
app.use("/api/users", userRoute);

app.get("/", (req, res) => {
  res.render("home");
});

// Error handling
// app.use((req, res, next) => {
//   const error = new Error("Not Found");
//   error.status = 404;
//   next(error);
// });

// app.use((error, req, res, next) => {
//   res.status(error.status || 500).json({
//     error: {
//       message: error.message,
//     },
//   });
// });

// all the http methods
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error handling middleware
app.use(handleErrors);

// Catch-all error handler
app.use(handleUnhandledErrors);

// app.use(globalErrorHandler);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
