import { model, Schema } from "mongoose";
import { encrypt } from "../util/encrypt.js";

const schema = new Schema({
    email: { type: String, require: true, unique: true },
    code: { type: String, default: () => encrypt(Math.floor(100000 + Math.random() * 900000).toString())},
    expiresAt: { type: Date, default: () => new Date(Date.now() + 5 * 60 * 1000)}
})

export default model("otp", schema);