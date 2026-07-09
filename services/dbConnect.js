const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_URL || process.env.MONGODB_URI;

// Cache the connection on the global object so that warm serverless
// invocations reuse the existing connection instead of opening a new one.
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGO_URL) {
    throw new Error(
      "Please set the MONGO_URL or MONGODB_URI environment variable."
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false,
    }).then((mongooseInstance) => mongooseInstance);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null; // Allow retrying on next request
    throw err;
  }

  return cached.conn;
}

module.exports = dbConnect;
