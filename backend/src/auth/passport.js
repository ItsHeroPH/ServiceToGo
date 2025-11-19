import passport from "passport";
import { Strategy } from "passport-local";
import User from "../database/user.js";
import { decrypt, encrypt } from "../util/encrypt.js";

/**
 * @param {passport} passport 
 */
export function initializePassport(passport) {
    passport.use(
        new Strategy(
            { usernameField: "user" },
            async (user, password, done) => {
                const hashedUser = encrypt(user)
                const existing = await User.findOne({ $or: [{ email: hashedUser }, { username: hashedUser }] });
                if(!existing) return done(null, false, { message: "User not found!" });
                
                const match = decrypt(existing.password) === password;
                if(!match) return done(null, false, { message: "Wrong password!" });

                return done(null, existing)
            }
        )
    )   

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findOne({ id });
            if(!user) return done(null, false);
            const decryptedUser = {
                id: user.id,
                email: decrypt(user.email),
                name: decrypt(user.name),
                username: decrypt(user.username),
                birthday: decrypt(user.birthday),
                avatar: user.avatar
            }
            return done(null, decryptedUser)
        } catch(err) {
            done(err)
        }
    })
}