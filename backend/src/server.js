import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import http from "http";
import passport from "passport";
import logger from "./util/logger.js";
import mongoose from "mongoose";
import ConnectMongo from "connect-mongo";
import cors from "cors";
import bodyParser from "body-parser";
import { Server } from "socket.io";

import { initializePassport } from "./auth/passport.js";
import router from "./routes/index.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL.split(","),
        methods: ["GET", "POST"],
        credentials: true
    }
})

mongoose.connect(process.env.MONGODB_URL)
    .then(() => logger.info("MongoDB", "Connected successfully!"))
    .catch(err => logger.error("MongoDB", err));



initializePassport(passport)
app.set("trust proxy", 1);
app.use(cookieParser())
// Main Frontend Cors
app.use("/api", cors({ 
    origin: [process.env.FRONTEND_URL.split(",")], 
    methods: ['GET','POST','PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
// Admin Frontend Cors
app.use("/admin", cors({ 
    origin: [process.env.ADMIN_URL.split(",")], 
    methods: ['GET','POST','PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(session({
    store: ConnectMongo.create({ mongoUrl: process.env.MONGODB_URL, autoRemove: "disabled", ttl: 60 * 60 * 24 * 30  }),
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        secure: "auto"
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    if(!process.env.FRONTEND_URL.split(",").includes(req.headers.origin)) return res.status(401).send("Unauthorized Access!");

    next()
})


app.use("/", router);

server.listen(3000, "0.0.0.0", () => {
    logger.info("SERVER", "Backend is now online!")
})

server.addListener("close", () => {
    logger.warn("SERVER", "Backend is now offline!")
})