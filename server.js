import dotenv from "dotenv";
dotenv.config();
import methodOverride from "method-override";
import morgan from "morgan";
import session from "express-session";
import express from "express";

import authController from "./controllers/auth.js";
import applicationsController from "./controllers/applications.js";
import { isSignedIn } from "./middleware/isSignedIn.js";
import { passUserToView } from "./middleware/passToView.js";

import "./db/connection.js";

const app = express();
const port = process.env.PORT ? process.env.PORT : "3000";

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

// http:localhost:3000/
app.get("/", (req, res) => {
    if (req.session.user) {
        res.redirect(`users/${req.session.user._id}/applications`);
    } else {
        res.render("index.ejs", {
            user: req.session.user,
        });
    }
});

app.use("/auth", authController);
// This middleware will redirect a user who isn't signed in, to the /auth/sing-in route
app.use(isSignedIn);
app.use("/users/:userId/applications", applicationsController);

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
});
