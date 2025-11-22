import passport from "passport";
import { decrypt } from "../util/encrypt.js";
import UserStrategy from "./UserStrategy.js";
import AdminStrategy from "./AdminStrategy.js";
import User from "../database/User.js";

/**
 * @param {passport} passport 
 */
export function initializePassport(passport) {
    passport.use(new UserStrategy())
    passport.use(new AdminStrategy())

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser(async (id, done) => {
        try {
            if(id == process.env.ADMIN_ID) return done(null, {
                username: process.env.ADMIN_USERNAME
            })

            const user = await User.findOne({ id });
            if(!user) return done(null, false);
            const decryptedUser = {
                id: user.id,
                email: decrypt(user.email),
                name: decrypt(user.name),
                username: decrypt(user.username),
                avatar: user.avatar
            }
            return done(null, decryptedUser)
        } catch(err) {
            done(err)
        }
    })
}