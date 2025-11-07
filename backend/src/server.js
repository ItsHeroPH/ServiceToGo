import express from "express"
import session from "express-session"
import http from "http"
import passport from "passport"
import logger from "./util/logger.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import cors from "cors";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import Crypto from "crypto-js";

import { initializePassport } from "./auth/passport.js";
import User from "./database/user.js"
import Message from "./database/message.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [process.env.FRONTEND_URL],
        methods: ["GET", "POST"],
        credentials: true
    }
})

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => logger.info("MongoDB", "Connected successfully!"))
  .catch(err => logger.error("MongoDB", err));

initializePassport(passport)
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: process.env.SESSION_SECRET_KEY, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ 
    origin: [process.env.FRONTEND_URL], 
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: false
 }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const origin = req.get('origin') || req.get('referer');
  if (origin && !origin.startsWith(`${process.env.FRONTEND_URL}`)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
});

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
        await Message.deleteMany({
            $or: [
                { fromUser: user.id },
                { toUser: user.id }
            ]
        });

        logger.info("AUTHENTICATOR", "User " + user.id + " deleted.");
        res.json({ status: 200, message: "Data deleted" });
    })
})

app.get("/users", async (req, res) => {
    if(!req.isAuthenticated()) return res.json({ status: 409, message: "Not authenticated "});

    const users = await User.find({});

    return res.json({ status: 200, users: users.filter((user) => user.id != req.user.id).map((user) => { return { id: user.id, username: user.username } })})
})

app.get("/message/:userId", async (req, res) => {
    if(!req.isAuthenticated()) return res.json({ status: 409, message: "Not authenticated "});

    const { userId } = req.params;
    if(!userId || req.user.id == userId) return res.json({ status: 403, message: "Access denied" });

    const messages = await Message.find({
        $or: [
            { fromUser: req.user.id, toUser: userId },
            { fromUser: userId, toUser: req.user.id }
        ]
    });

    return res.json({ status: 200, messages: messages.map((msg) => 
        { return { id: msg.id, from: msg.fromUser, to: msg.toUser, message: Crypto.AES.decrypt(msg.message, process.env.SECRET_KEY).toString(Crypto.enc.Utf8), createdAt: msg.createdAt }}
    ) })
})

io.on("connection", (socket) => {
    socket.on("join_message", (userId) => socket.join(userId))

    socket.on("send_message", async (data) => {
        const { from, to, message } = data;
        const msg = new Message({ fromUser: from, toUser: to, message: Crypto.AES.encrypt(message, process.env.SECRET_KEY).toString() });
        await msg.save();

        logger.info("MESSENGER", `User ${from} sent a message to ${to}.`);

        const msgData = { id: msg.id, from: msg.fromUser, to: msg.toUser, message: message, createdAt: msg.createdAt }
        io.to(from).emit("receive_message", msgData)
        io.to(to).emit("receive_message", msgData)
    })
})

server.listen(3000, "0.0.0.0", () => {
    logger.info("SERVER", "Backend is now online!")
})

server.addListener("close", () => {
    logger.warn("SERVER", "Backend is now offline!")
})