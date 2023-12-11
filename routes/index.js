var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const passport = require("passport");
const localStrategy = require('passport-local')
passport.use(new localStrategy(userModel.authenticate()));
const upload = require('./multer')

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index",{nav:false});
});

//profile
router.get('/profile', isLoggedIn, async function(req, res){
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  .populate("posts")
  res.render('profile', {user, nav:true})
})

//create post page
router.get('/post', function(req, res){
  res.render('post',{nav:true})
})

//All posts
router.get('/feed', async function(req, res){
const allPosts = await postModel.find()
.populate("user")
res.render('feed', {allPosts, nav:true})
})
//upload profile image
router.post('/edit-profile', isLoggedIn, upload.single("uploadProfile"), async function(req, res){
    const user = await userModel.findOne({
      username: req.session.passport.user
    })
    user.profileImage = req.file.filename
    await user.save();
    res.redirect('/profile')
})


//upload Post
router.post('/upload', isLoggedIn, upload.single("postImage"), async function(req, res){
    const user = await userModel.findOne({
      username: req.session.passport.user
    })
   const post = await postModel.create({
  title: req.body.title,
  description: req.body.description,
  postImage: req.file.filename,
  user:user._id
   })
   user.posts.push(post)
   await user.save();
   res.redirect('/profile')
})

router.get("/login", function (req, res, next) {
  res.render("login", {error: req.flash("error"), nav:false});
});

//Register Route
router.post("/register", function (req, res) {
  var userData = new userModel({
    username: req.body.username,
    fullname: req.body.fullname,
    email: req.body.email,
  });
  userModel
    .register(userData, req.body.password)
    .then(function (registeredUser) {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile");
      });
    });
});

//login
router.post('/login', passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login",
  failureFlash: true
}))

//logout
router.get('/logout', function(req, res, next){
  req.logout(function(err){
    if(err){return next(err)}
    res.redirect('/login')
  })
})

//isLogin
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login')
}

module.exports = router;
