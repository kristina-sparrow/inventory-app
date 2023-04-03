import { Schema, model } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, minLength: 1 },
});

CategorySchema.virtual("url").get(function () {
  return `/category/${this._id}`;
});

export default model("Category", CategorySchema);
