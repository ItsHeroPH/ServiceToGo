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
import { sendEmail } from "./util/mailer.js";
import { encrypt, decrypt } from "./util/encrypt.js";
import User from "./database/user.js";
import OTP from "./database/otp.js";
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
app.set("trust proxy", 1);
app.use(cookieParser())
app.use(cors({ 
    origin: [process.env.FRONTEND_URL], 
    methods: ['GET','POST','PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(session({
    store: ConnectMongo.create({ mongoUrl: process.env.MONGODB_URL, autoRemove: "disabled" }),
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000 * 60 * 24
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    if(req.headers.origin !== process.env.FRONTEND_URL) return res.status(401).send("Unauthorized Access!");

    next()
})

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
    const { email, password, name, address } = req.body;

    const encryptedEmail = encrypt(email)
    const existing = await User.findOne({ email: encryptedEmail });
    if(existing) return res.json({ status: 409, message: "Email already exists!" });

    const encryptedPassword = encrypt(password)
    const encryptedName = encrypt(name);
    const encryptedAddress = {
        region: encrypt(address.region),
        city: encrypt(address.city),
        barangay: encrypt(address.barangay),
        address: encrypt(address.address)
    }
    const user = new User({ email: encryptedEmail, name: encryptedName, password: encryptedPassword, address: encryptedAddress });
    await user.save();

    logger.info("AUTHENTICATOR", "A new user registered: " + user.id);
    res.json({ status: 201, message: "User registered successfully!" });
})

app.post("/register/check-email", async(req, res) => {
    const { email } = req.body;
    const existing = await User.findOne({ email: encrypt(email) });
    if(existing) return res.json({ status: 409, message: "Email already exists!" });

    return res.json({ status: 200, message: "Email is not exists!" })
})

app.post("/register/send-code", async (req, res) => {
    const { email } = req.body;

    const encryptedEmail = encrypt(email);
    const existing = await OTP.findOne({ email: encryptedEmail });
    if(existing) await OTP.deleteOne({ email: encryptedEmail });

    const otp = new OTP({ email: encryptedEmail });
    await otp.save();

    await sendEmail(
        email, 
        "Verification Code",
        `
        <!DOCTYPE html>
        <html>
        <head>
        <meta name="color-scheme" content="light">
        <meta name="supported-color-schemes" content="light">
        </head>
        <body>
            <div style="width:100%; text-align:center;">
                <img src="cid:logo" width="200" alt="ServiceToGo">
                <table>
                    <tr>
                        <td style="text-align:left; position:relative;">
                            <h1 style="font-family: Arial, sans-serif; color:#F45E8E !important;">Verification Code</h1>
                            <h3>Please confirm your registration request</h3>
                            <p>To verify your account, please use the following code to confirm your registration request. This code will expire in 5 minutes.</p>
                            <div style="background-color:#E7E6F0 !important; padding:15px 0; width: 100%; border-radius:5px; text-align: center;">
                                <h2 style="font-family: Arial, sans-serif; color:#F58C22 !important; letter-spacing:5px; margin:0;">${decrypt(otp.code)}</h2>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </body>
        </html>
        `,
        `Verification Code: ${decrypt(otp.code)}`
        );
    
    return res.json({ status: 200 })
})

app.post("/register/verify", async (req, res) => {
    const { email, code } = req.body;

    const encryptedEmail = encrypt(email);
    const encryptedCode = encrypt(code);
    const existing = await OTP.findOne({ email: encryptedEmail, code: encryptedCode });
    if(!existing) return res.json({ status: 400, message: "Invalid OTP!" });

    if(existing.expiresAt < new Date()) return res.json({ stats: 400, message: "OTP expired!"});
    await OTP.deleteOne({ email: encryptedEmail, code: encryptedCode });

    return res.json({ status: 200, message: "OTP verified successfully" });
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
        name: req.user.name
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

    return res.json({ status: 200, users: users.filter((user) => user.id != req.user.id).map((user) => { return { id: user.id, name: decrypt(user.name) } })})
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
        { return { id: msg.id, from: msg.fromUser, to: msg.toUser, message: decrypt(msg.message), createdAt: msg.createdAt }}
    ) })
})

io.on("connection", (socket) => {
    socket.on("join_message", (userId) => socket.join(userId))

    socket.on("send_message", async (data) => {
        const { from, to, message } = data;
        const msg = new Message({ fromUser: from, toUser: to, message: encrypt(message) });
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