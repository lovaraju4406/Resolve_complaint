const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/resolvenow";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅  MongoDB connected →", MONGO_URI))
  .catch((err) => {
    console.error("❌  MongoDB connection failed:", err.message);
    process.exit(1);
  });

mongoose.connection.on("disconnected", () =>
  console.warn("⚠️   MongoDB disconnected")
);