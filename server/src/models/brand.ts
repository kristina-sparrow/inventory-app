import { Schema, model } from "mongoose";

const BrandSchema = new Schema({
  name: { type: String, minLength: 1 },
});

BrandSchema.virtual("url").get(function () {
  return `/brand/${this._id}`;
});

export default model("Brand", BrandSchema);
