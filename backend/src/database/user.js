import { Schema, model } from "mongoose"

const schema = new Schema({
    id: { type: String, unique: true, default: () => Math.floor(1e11 + Math.random() * 9e11) },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    username: { type: String, require: true },
    name: { type: String, require: true },
    birthday: { type: String, require: true },
    avatar: { type: String, default: ""},
    createdAt: { type: Date, default: Date.now }
})

export default model("users", schema)