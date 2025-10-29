import mongoose from "mongoose";

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/nexa";

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  await mongoose.connect(mongoUri, {
    // useUnifiedTopology: true, // mongoose 7 uses these by default
  });
  console.log("[db] Connected to MongoDB");
  return mongoose.connection;
}
