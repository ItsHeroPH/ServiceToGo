import { model, Schema } from "mongoose";

const schema = new Schema({
   fromUser: { type: String, require: true },
   region: { type: String, require: true },
   province: { type: String, require: true },
   city: { type: String, require: true },
   barangay: { type: String, require: true },
   address: { type: String, require: true },
   isDefault: { type: Boolean, default: false }
})

export default model("address", schema);