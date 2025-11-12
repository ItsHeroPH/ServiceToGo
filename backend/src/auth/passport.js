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
            { usernameField: "email" },
            async (email, password, done) => {
                const hashedEmail = encrypt(email)
                const user = await User.findOne({ email: hashedEmail });
                if(!user) return done(null, false, { message: "User not found!" });
                
                const match = decrypt(user.password) === password;
                if(!match) return done(null, false, { message: "Wrong password!" });

                return done(null, user)
            }
        )
    )   

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findOne({ id });
            if(!user) done("User not found", false);
            const decryptedUser = {
                id: user.id,
                email: decrypt(user.email),
                name: decrypt(user.name),
                username: decrypt(user.username),
                birthday: decrypt(user.birthday),
                avatar: user.avatar
            }
            done(null, decryptedUser)
        } catch(err) {
            done(err)
        }
    })
}