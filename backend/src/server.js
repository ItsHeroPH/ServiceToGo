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
import Files from "./database/files.js";
import Address from "./database/address.js";
import message from "./database/message.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [process.env.FRONTEND_URL],
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
app.use(cors({ 
    origin: [process.env.FRONTEND_URL], 
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
    if(req.headers.origin !== process.env.FRONTEND_URL) return res.status(401).send("Unauthorized Access!");

    next()
})

app.post("/login", async (req, res, next) => {
    if(req.isAuthenticated()) return res.json({ status: 409, message: "Already Authenticated!"});

    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.json({ status: 401, message: "Invalid credentials" });

        if(!req.body.code) return res.json({ status: 200, message: "Verification needed!" });

        req.login(user, (err) => {
            if (err) return next(err);
            logger.info("AUTHENTICATOR", "User " + user.id + " logged in.");
            res.json({ status: 200,  message: "Login successful!" });
        });
    })(req, res, next)
})

app.post("/register", async (req, res) => {
    const { email, password, username, name, gender, birthday } = req.body;

    const encryptedEmail = encrypt(email)
    const existing = await User.findOne({ email: encryptedEmail });
    if(existing) return res.json({ status: 409, message: "Email already exists!" });

    if(!password && !username && !name && !gender && !birthday) return res.json({ status: 422, message: "Fields is not complete" });

    const encryptedPassword = encrypt(password)
    const encryptedUsername = encrypt(username);
    const encryptedName = encrypt(name);
    const encryptedGender = encrypt(gender);
    const encryptedBirthday = encrypt(birthday);
    const user = new User({ 
        email: encryptedEmail,
        username: encryptedUsername, 
        name: encryptedName, 
        password: encryptedPassword, 
        gender: encryptedGender,
        birthday: encryptedBirthday
    });
    await user.save();

    logger.info("AUTHENTICATOR", "A new user registered: " + user.id);
    res.json({ status: 201, message: "User registered successfully!" });
})

app.post("/send-code", async (req, res) => {
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
                    <img src="https://servicetogo.store/assets/img/logo2.png" width="200" alt="ServiceToGo">
                    <table style="justify-self: center;">
                        <tr>
                            <td style="text-align:left; position:relative;">
                                <h1 style="font-family: Arial, sans-serif; color:#F45E8E !important;">Verification Code</h1>
                                <h3>Please confirm your request</h3>
                                <p>For verification of your request, please use the following code below. This code will expire in 5 minutes.</p>
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

app.post("/verify", async (req, res) => {
    const { email, code, remove } = req.body;

    const encryptedEmail = encrypt(email);
    const encryptedCode = encrypt(code);
    const existing = await OTP.findOne({ email: encryptedEmail, code: encryptedCode });
    if(!existing) return res.json({ status: 400, message: "Invalid OTP!" });
    
    if(existing.expiresAt < new Date()) return res.json({ status: 400, message: "OTP expired!"});
    if(remove) {
        await OTP.deleteOne({ email: encryptedEmail, code: encryptedCode });
    }

    return res.json({ status: 200 });
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

app.post("/reset-password", async (req, res) => {
    const { email, code, password } = req.body;
    if(!email && !code && !password) return res.json({ status: 422, message: "Fields incomplete" });
    const encryptedEmail = encrypt(email);
    const encryptedCode = encrypt(code);
    const encryptedPassword = encrypt(password);
    const user = await User.findOne({ email: encryptedEmail });
    if(!user) return res.json({ status: 400, message: "User invalid!" });
    const existing = await OTP.findOne({ email: encryptedEmail, code: encryptedCode });
    if(!existing) return res.json({ status: 400, message: "Invalid OTP!" });
    user.password = encryptedPassword;
    await user.save();
    await OTP.deleteOne({ email: encryptedEmail, code: encryptedCode });

    logger.info("AUTHENTICATOR", `User ${user.id} resets password`);

    return res.json({ status: 200 });
})

app.get("/user", async (req, res) => {
    if(!req.isAuthenticated()) return res.json({ status: 409, message: "Not authenticated "});

    res.json({ status: 200, user: {
        id: req.user.id,
        email: req.user.email,
        username: req.user.username,
        name: req.user.name,
        birthday: req.user.birthday,
        avatar: req.user.avatar
    } })
})

app.post("/user/edit", async (req, res) => {
    if(!req.isAuthenticated()) return res.json({ status: 409, message: "Not authenticated "});

    const { name } = req.body;
    const user = await User.findOne({ id: req.user.id });

    if(!user) return res.json({ status: 409, message: "User invalid" });

    if(name) user.name = encrypt(name);

    await user.save();

    return res.json({ status: 200 });
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
        await Files.deleteMany({ owner: user.id })
        await Address.deleteMany({ owner: user.id })

        logger.info("AUTHENTICATOR", "User " + user.id + " deleted.");
        res.json({ status: 200, message: "Data deleted" });
    })
})

app.get("/users", async (req, res) => {
    if(!req.isAuthenticated()) return res.json({ status: 409, message: "Not authenticated "});

    const users = await User.find({});

    return res.json({ status: 200, users: users.filter((user) => user.id != req.user.id).map((user) => { return { id: user.id, name: decrypt(user.name), username: decrypt(user.username), avatar: user.avatar } })})
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

app.get("/images/:id", async (req, res) => {
    if(!req.isAuthenticated()) return res.json({ status: 409, message: "Not authenticated" });
    const { id } = req.params;

    if(!id) return res.json({ status: 422, message: "Fields incomplete" });
    const existing = await Files.findOne({ id });
    if(!existing) return res.json({ status: 404, message: "Image not found" });

    res.set("Content-Type", existing.fileType)
    return res.send(Buffer.from(decrypt(existing.data), "base64"));
});

app.post("/upload", async (req, res) => {
    const { data, fileType, type } = req.body;
    if(!req.isAuthenticated()) return res.json({ status: 409, message: "Not authenticated" });
    if(!data && !fileType && !type) return res.json({ status: 422, message: "Fields incomplete" });

    if(type === "avatar") {
        const existing = await Files.findOne({ owner: req.user.id, type: "avatar" });
        if(existing) await Files.deleteOne({ id: existing.id });
    }

    const file = new Files({ owner: req.user.id, fileType, type, data: encrypt(data) });
    await file.save();

    if(type === "avatar") {
        const user = await User.findOne({ id: req.user.id });
        user.avatar = file.id;
        await user.save();
    }

    logger.info("FILES", `User ${user.id} upload image: ${file.id}`);

    return res.json({ status: 200, id: file.id })
});

app.get("/address", async (req, res) => {
    if(!req.isAuthenticated()) return res.json({ status: 409, message: "Not authenticated" });

    const addresses = (await Address.find({ owner: req.user.id })).map((address) => ({
        id: address.id,
        region: decrypt(address.region),
        province: address.province ? decrypt(address.province) : "",
        city: decrypt(address.city),
        barangay: decrypt(address.barangay),
        address: decrypt(address.address)
    }));

    return res.json({ status: 200, addresses })
});

app.post("/address/add", async (req, res) => {
    if(!req.isAuthenticated()) return res.json({ status: 409, message: "Not authenticated" });
    
    const { region, province, city, barangay, address } = req.body;

    const newAddress = new Address({
        owner: req.user.id,
        region: encrypt(region),
        province: province ? encrypt(province) : "",
        city: encrypt(city),
        barangay: encrypt(barangay),
        address: encrypt(address)
    });

    await newAddress.save();
    logger.info("ADDRESS", `User ${user.id} added address ${newAddress.id}`);

    return res.json({ status: 200 });
});

app.post("/address/delete", async (req, res) => {
    if(!req.isAuthenticated()) return res.json({ status: 409, message: "Not authenticated" });
    
    const { id } = req.body;
    const existing = await Address.findOne({ id, owner: req.user.id });
    if(!existing) return res.json({ status: 404, message: "Address Not Found!"});
    
    logger.info("ADDRESS", `User ${user.id} deleted address ${existing.id}`);

    await Address.deleteOne({ id, owner: req.user.id });
    return res.json({ status: 200 });
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