import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const dbURI = process.env.MONGODB_URI;
//
    if (!dbURI) {
      throw new Error("MONGODB_URI is not defined");
    }

    console.log("MONGODB_URI:", dbURI);

    await mongoose.connect(dbURI);
    console.log("MongoDB connected ✅");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
