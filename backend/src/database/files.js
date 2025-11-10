import { Schema } from "mongoose";

const schema = new Schema({
    id: { type: String, require: true, unique: true, default: () => Math.floor(1e17 + Math.random() * 9e20) },
    owner: { type: String, require: true },
    type: { type: String, require: true }
});

export default model("files", schema);