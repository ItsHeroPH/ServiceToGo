import { model, Schema } from "mongoose";

const schema = new Schema({
   id: { type: String, default: () => Math.floor(1e11 + Math.random() * 9e11)},
   owner: { type: String, require: true },
   region: { type: String, require: true },
   province: { type: String, require: true },
   city: { type: String, require: true },
   barangay: { type: String, require: true },
   address: { type: String, require: true },
   isDefault: { type: Boolean, default: false }
})

export default model("address", schema);