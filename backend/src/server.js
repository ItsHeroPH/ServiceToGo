import express from "express"
import session from "express-session"
import http from "http"
import passport from "passport"
import logger from "./util/logger.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import cors from "cors";
import bodyParser from "body-parser";

import { initializePassport } from "./auth/passport.js";
import User from "./database/user.js"

const app = express();
const server = http.createServer(app);

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => logger.info("MongoDB", "Connected successfully!"))
  .catch(err => logger.error("MongoDB", err));

initializePassport(passport)
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/login", async (req, res, next) => {
    if(req.isAuthenticated()) return res.json({ status: 409, message: "Already Authenticated!"});

    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.json({ status: 401, message: "Invalid credentials" });

        req.login(user, (err) => {
            if (err) return next(err);
            logger.info("AUTHENTICATOR", "User " + user.id + " logged in.");
            res.json({ status: 200,  message: "Login successful!" });
        });
    })(req, res, next)
})

app.post("/register", async (req, res) => {
    const { email, password, username } = req.body;

    const existing = await User.findOne({ email });
    if(existing) return res.json({ status: 409, message: "Email already exists!" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, username, password: hashed });
    await user.save();

    logger.info("AUTHENTICATOR", "A new user registered: " + user.id);
    res.json({ status: 201, message: "User registered successfully!" });
})

app.get("/logout", async (req, res, next) => {
    if(!req.isAuthenticated()) return res.json({ status: 401, message: "Not Authenticated!" });

    const user = req.user;
    req.logout((err) => {
        if(err) return next(err);

        logger.info("AUTHENTICATOR", "User " + user.id + " logged out.");
        res.json({ status: 200, message: "Logging out successfully!" });
    })
})

app.get("/user", async (req, res) => {
    if(!req.isAuthenticated()) return res.json({ status: 409, message: "Not authenticated "});

    res.json({ status: 200, user: {
        id: req.user.id,
        email: req.user.email,
        username: req.user.username
    } })
})

app.get("/user/delete", async (req, res, next) => {
    if(!req.isAuthenticated()) return res.json({ status: 409, message: "Not authenticated "});

    const user = req.user;
    req.logout(async (err) => {
        if(err) return next(err);

        logger.info("AUTHENTICATOR", "User " + user.id + " logged out.");

        await User.findOneAndDelete({ id: user.id })

        logger.info("AUTHENTICATOR", "User " + user.id + " deleted.");
        res.json({ status: 200, message: "Data deleted" });
    })
})

server.listen(3000, "localhost", () => {
    logger.info("SERVER", "Backend is now online!")
})

server.addListener("close", () => {
    logger.warn("SERVER", "Backend is now offline!")
})