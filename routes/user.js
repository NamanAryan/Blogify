const {Router} = require("express");
const User = require("../models/user")
const multer = require("multer");
const router = Router();
const path = require('path');


router.get('/signin', (req,res) => {
    res.render("signin");
});

router.get('/signup', (req,res) => {
    res.render("signup");
});

router.get('/logout', (req,res) =>{
    return res.clearCookie('token').redirect('/');

})

router.post('/signin', async(req, res) => {
    const { email,password } = req.body;
    try{
        const token = await User.matchPasswordAndGenerateToken(email, password);
        console.log("Token: ", token);
        return res.cookie('token', token).redirect("/");
    }
    catch{
        return res.render("signin", {
            error: "Incorrect email or password",
        });
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads/`));
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

  router.post('/signup', upload.single('profileImage'), async (req, res) => {
    const { fullName, email, password } = req.body;
    
    const profileImageURL = req.file ? `/uploads/${req.file.filename}` : '/images/default_profileImage.png';
    
    await User.create({
        fullName,
        email,
        password,
        profileImageURL
    });
    return res.redirect("/");
});




module.exports = router;



