require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const Blog = require("./models/blog");

const userRoute =require("./routes/user");
const blogRoute  =require("./routes/blog");

const app = express();
const PORT = process.env.PORT || 8000;

const mongoUrl = process.env.MONGO_URL || process.env.MONGODB_URI;
if (mongoUrl) {
  mongoose.connect(mongoUrl)
    .then(e => console.log("MongoDB connected!"))
    .catch(err => console.error("MongoDB connection error:", err));
} else {
  console.warn("WARNING: No MongoDB URL provided. Database connections will fail.");
}

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public'))); 


app.get('/', async (req,res) => {
    const allBlogs = await Blog.find({});
    res.render('home',{
        user: req.user,
        blogs: allBlogs 
    });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => {console.log(`Server start at PORT ${PORT}`)})

module.exports = app;
