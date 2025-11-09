import { model, Schema } from "mongoose";

const schema = new Schema({
    email: { type: String, require: true, unique: true },
    code: { type: String, default: () => Math.floor(100000 + Math.random() * 900000)},
    expiresAt: { type: Date, default: () => new Date(Date.now() + 5 * 60 * 1000)}
})

export default model("otp", schema);