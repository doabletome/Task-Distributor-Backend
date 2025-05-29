import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    // Exit process with failure
    process.exit(1);
  }
}
