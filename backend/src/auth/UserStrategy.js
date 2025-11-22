import { Strategy } from "passport-strategy";
import User from "../database/user.js";
import logger from "../util/logger.js";
import { decrypt, encrypt } from "../util/encrypt.js";

export default class UserStrategy extends Strategy {
    constructor() {
        super();
        this.name = "user";
    }

    async authenticate(req, options) {
        try {
            const { user, password } = req.body;

            if(!user || !password) return this.fail({ message: "Fields must be filled" }, 422);
            const hashedUser = encrypt(user)
            const existing = await User.findOne({ $or: [{ email: hashedUser }, { username: hashedUser }] });
            if(!existing) return this.fail({ message: "Invalid credentials" }, 401);
                            
            const match = decrypt(existing.password) === password;
            if(!match) return this.fail({ message: "Invalid credentials"}, 401);

            return this.success(existing);
        } catch(err) {
            logger.error("PASSPORT", err);
        }
    }
}