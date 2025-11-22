import { Router } from "express";
import checkUserIfAuthenticated from "../../middlewares/checkUserIfAuthenticated.js";

import User from "../../database/User.js";
import { encrypt } from "../../util/encrypt.js";

const router = new Router();

router.get("/", checkUserIfAuthenticated({ error: {
    status: 401, message: "Not authenticated"
} }), (req, res) => {
    return res.json({ 
        status: 200,
        user: req.user
    })
})

router.get("/:user", async (req, res) => {
    const { user } = req.params;

    if(!user) return res.json({ status: 422, message: "Fields must be filled." });

    const encryptedUser = encrypt(user);
    const existing = await User.findOne({ $or: [{ email: encryptedUser }, { username: encryptedUser }]});

    if(existing) return res.json({ status: 409, message: "User exist" });
    return res.json({ status: 404, message: "User not exist" });
})

export default router;