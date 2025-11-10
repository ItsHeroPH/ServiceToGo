import { model, Schema } from "mongoose";

const schema = new Schema({
    id: { type: String, unique: true, default: () => Math.floor(1e17 + Math.random() * 9e20) },
    name: { type: String, require: true },
    icon: { type: String, require: true },
    description: { type: String, require: true }
});

export default model("service", schema);