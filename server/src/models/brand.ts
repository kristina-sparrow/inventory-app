import { Schema, model } from "mongoose";

const BrandSchema = new Schema({
  name: { type: String, required: true, unique: true },
});

BrandSchema.virtual("url").get(function () {
  return `/brand/${this._id}`;
});

export default model("Brand", BrandSchema);
