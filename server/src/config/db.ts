import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(`${process.env.DB_URI}`, {});
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
