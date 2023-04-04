import { Schema, model } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
});

CategorySchema.virtual("url").get(function () {
  return `/category/${this._id}`;
});

export default model("Category", CategorySchema);
