import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes("localhost")) {
    console.warn("\n=======================================================");
    console.warn("[Database Notice] Running with Local / Default MongoDB URI.");
    console.warn("For multi-device real-time sync across different machines,");
    console.warn("set MONGODB_URI in your .env to a cloud MongoDB Atlas cluster:");
    console.warn("mongodb+srv://<user>:<password>@cluster.mongodb.net/peerforge");
    console.warn("=======================================================\n");
  }

  const targetUri = uri || "mongodb://localhost:27017/peerforge";

  // MongoDB connection event listeners
  mongoose.connection.on("connected", () => {
    console.log(`[Database] Mongoose connected successfully to: ${mongoose.connection.host}`);
  });

  mongoose.connection.on("error", (err) => {
    console.error(`[Database Error] Connection error: ${err.message}`);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("[Database Warning] Mongoose disconnected from MongoDB.");
  });

  try {
    const conn = await mongoose.connect(targetUri, {
      serverSelectionTimeoutMS: 8000,
      retryWrites: true,
      w: "majority",
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error]: Failed to connect to MongoDB at ${targetUri}.`);
    console.error(`Reason: ${error.message}`);
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
};

export default connectDB;

