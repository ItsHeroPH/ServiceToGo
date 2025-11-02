import passport from "passport";
import { Strategy } from "passport-local";
import bcrypt from "bcryptjs";
import User from "../database/user.js";

/**
 * @param {passport} passport 
 */
export function initializePassport(passport) {
    passport.use(
        new Strategy(
            { usernameField: "email" },
            async (email, password, done) => {
                const user = await User.findOne({ email });
                if(!user) return done(null, false, { message: "User not found!" });
                
                const match = await bcrypt.compare(password, user.password);
                if(!match) return done(null, false, { message: "Wrong password!" });

                return done(null, user)
            }
        )
    )   

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findOne({ id });
            done(null, user)
        } catch(err) {
            done(err)
        }
    })
}