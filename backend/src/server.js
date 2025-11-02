import express from "express"
import session from "express-session"
import http from "http"
import passport from "passport"
import logger from "./util/logger.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { initializePassport } from "./auth/passport.js";
import User from "./database/user.js"
import user from "./database/user.js";

const app = express();
const server = http.createServer(app);

mongoose.connect("mongodb+srv://hewokwun:RmsRJ7MtzSV0xKzw@cluster0.iflmwna.mongodb.net/servicetogo", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => logger.info("MongoDB", "Connected successfully!"))
  .catch(err => logger.error("MongoDB", err));

initializePassport(passport)
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.post("/login", async (req, res, next) => {
    if(req.isAuthenticated()) return res.status(401).json({ message: "Already Authenticated!"});

    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        req.login(user, (err) => {
            if (err) return next(err);
            logger.info("AUTHENTICATOR", "User " + user.id + " logged in.");
            res.json({ message: "Login successful!" });
        });
    })(req, res, next)
})

app.post("/register", async (req, res) => {
    const { email, password, username } = req.body;

    const existing = await User.findOne({ email });
    if(existing) return res.status(400).json({ message: "Email already exists!" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, username, password: hashed });
    await user.save();

    logger.info("AUTHENTICATOR", "A new user registered: " + user.id);
    res.status(201).json({ message: "User registered successfully!" });
})

app.get("/logout", async (req, res, next) => {
    if(!req.isAuthenticated()) return res.status(400).json({ message: "Not Authenticated!" });

    const user = req.user;
    req.logout((err) => {
        if(err) return next(err);

        logger.info("AUTHENTICATOR", "User " + user.id + " logged out.");
        res.status(200).json({ message: "Logging out successfully!" });
    })
})

app.get("/user", async (req, res) => {
    if(!req.isAuthenticated()) return res.status(400).json({ message: "Not authenticated "});

    res.status(200).json({ user: {
        id: req.user.id,
        email: req.user.email,
        username: req.user.username
    } })
})

app.get("/user/delete", async (req, res, next) => {
    if(!req.isAuthenticated()) return res.status(400).json({ message: "Not authenticated "});

    const user = req.user;
    req.logout(async (err) => {
        if(err) return next(err);

        logger.info("AUTHENTICATOR", "User " + user.id + " logged out.");

        await User.findOneAndDelete({ id: user.id })

        logger.info("AUTHENTICATOR", "User " + user.id + " deleted.");
        res.status(200).json({ message: "Data deleted" });
    })
})

server.listen(3000, "localhost", () => {
    logger.info("SERVER", "Backend is now online!")
})

server.addListener("close", () => {
    logger.warn("SERVER", "Backend is now offline!")
})