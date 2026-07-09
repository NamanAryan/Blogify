require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const Blog = require("./models/blog");
const dbConnect = require("./services/dbConnect");

const userRoute =require("./routes/user");
const blogRoute  =require("./routes/blog");

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB before every request (cached for warm serverless invocations)
app.use(async (req, res, next) => {
  try {
    await dbConnect();
    next();
  } catch (err) {
    console.error("MongoDB connection error:", err);
    res.status(503).json({ error: "Database unavailable. Please try again later." });
  }
});

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

if (!process.env.VERCEL) {
  app.listen(PORT, () => {console.log(`Server start at PORT ${PORT}`)})
}

module.exports = app;
