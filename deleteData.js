require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");
const Blog = require("./models/blog");
const Comment = require("./models/comment");

async function deleteAllData() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected!");

        await User.deleteMany({});
        console.log("✓ All users deleted");

        await Blog.deleteMany({});
        console.log("✓ All blogs deleted");

        await Comment.deleteMany({});
        console.log("✓ All comments deleted");

        console.log("\n✅ All data has been deleted successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error deleting data:", error);
        process.exit(1);
    }
}

deleteAllData();
