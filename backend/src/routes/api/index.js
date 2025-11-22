import { Router } from "express";
import checkUserIfAuthenticated from "../../middlewares/checkUserIfAuthenticated.js";
import passport from "passport";
import axios from "axios";
import logger from "../../util/logger.js";

import user from "./user.js";
import verify from "./verify.js";
import { decrypt, encrypt } from "../../util/encrypt.js";
import User from "../../database/user.js";

const router = new Router();

router.post("/login", checkUserIfAuthenticated({ 
    success: { status: 409, message: "Already Authenticated" }
}), async(req, res, next) => {
    passport.authenticate("user", async(err, user, info) => {
        if(err) return next(err);
        if(!user) return res.json({ status: 401, message: "Invalid credentials" });

        if(!req.body.code) {
            await axios.post(`${process.env.BACKEND_URL}/api/verify/send-code`, { email: decrypt(user.email)}, { headers: {
                "Origin": req.headers.origin
            }});
            return res.json({ status: 402, email: decrypt(user.email), message: "Verification needed!" });
        }

        req.login(user, { session: true }, async(err) => {
            if(err) return next(err);

            logger.info("AUTHENTICATOR", `User ${user.id} logged in.`);
            return res.json({ status: 200, message: "Login successfully!" });
        })
    })(req, res, next)
})

router.get("/logout", checkUserIfAuthenticated({
    error: { status: 401, message: "Not Authenticated" }
}), (req, res) => {
    const user = req.user;
    req.logout((err) => {
        if(err) return next(err);

        logger.info("AUTHENTICATOR", "User " + user.id + " logged out.");
        res.json({ status: 200, message: "Logging out successfully!" });
    })
})

router.post("/register", checkUserIfAuthenticated({
    success: { status: 409, message: "Already Authenticated" }
}), async(req, res) => {
    const { email, password, username, name, gender } = req.body;

    if(!email || !password || !username || !name || !gender) return res.json({ status: 422, message: "Fields must be filled." });
    const encryptedEmail = encrypt(email);
    const encryptedPassword = encrypt(password);
    const encryptedUsername = encrypt(username);
    const encryptedName = encrypt(name);
    const encryptedGender = encrypt(gender);

    const existing = await User.findOne({ $or: [{ email: encryptedEmail }, { username: encryptedUsername }]});
    if(existing) return res.json({ status: 409, message: "User already exist!" });
    const user = new User({ 
        email: encryptedEmail,
        username: encryptedUsername, 
        name: encryptedName, 
        password: encryptedPassword, 
        gender: encryptedGender
    });

    await user.save();

    logger.info("AUTHENTICATOR", `A new registered user: ${user.id}`);
    return res.json({ status: 201, message: "Successfully registered!" });
})

router.use("/user", user);
router.use("/verify", verify);

export default router;