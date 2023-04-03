import { Schema, model } from "mongoose";

const ItemSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  brand: {
    type: Schema.Types.ObjectId,
    ref: "Brand",
    required: [true, "Brand is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  categories: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category is required"],
  },
  img: {
    type: String,
    required: [true, "Image is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  stock: {
    type: Number,
    required: [true, "Stock is required"],
  },
});

ItemSchema.virtual("url").get(function () {
  return `/item/${this._id}`;
});

export default model("Item", ItemSchema);
