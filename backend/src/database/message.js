import { model, Schema } from "mongoose";

const schema = new Schema({
    id: { type: String, unique: true, default: () => Math.floor(1e17 + Math.random() * 9e20) },
    fromUser: { type: String, required: true },
    toUser: { type: String, required: true },
    message: { type: String },
    createdAt: { type: Date, default: Date.now }
})

export default model("messages", schema)