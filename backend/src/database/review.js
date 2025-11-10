import { model, Schema } from "mongoose";

const schema = new Schema({
    id: { type: String, default: () => Math.floor(1e17 + Math.random() * 9e20) },
    serviceId: { type: String, require: true },
    fromUser: { type: String, require: true },
    ratings: { type: String, require: true },
    message: { type: String, require: true }
})

export default model("review", schema);