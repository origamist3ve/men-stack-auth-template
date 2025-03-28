import dotenv from "dotenv";
dotenv.config();
import methodOverride from "method-override";
import morgan from "morgan";
import session from "express-session";
import express from "express";
import authController from "./controllers/auth.js";
import "./db/connection.js";

const app = express();
const port = process.env.PORT ? process.env.PORT : "3000";

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
// app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  res.render("index.ejs", {
    user: req.session.user,
  });
});

app.get("/vip-lounge", (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}.`);
  } else {
    res.send("Sorry, no guests allowed.");
  }
});

app.use("/auth", authController);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
