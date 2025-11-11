import { model, Schema } from "mongoose";
import { v4 as uuid } from "uuid";

const schema = new Schema({
    id: { type: String, require: true, unique: true, default: () => uuid() },
    owner: { type: String, require: true },
    type: { type: String, require: true },
    fileType: { type: String, require: true },
    data: { type: String, reuqire: true }
});

export default model("files", schema);