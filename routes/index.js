var express = require("express");
var router = express.Router();
var User = require("../models/user")
var passport = require("passport")
var middleware = require("../middleware")

router.get('/', function (req, res) {
  res.render("index", {currentUser: req.user});
});

router.get("/skb", middleware.isLoggedIn, function(req, res) {
  res.render("skb");
})

router.get("/register", function(req, res) {
  res.render("register");
})

router.post("/register", function(req, res) {
  var newUser = new User({
    username: req.body.username, 
    email: req.body.email
  });
  
  User.register(newUser, req.body.password, function(err, newUser) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/skb"); 
      })
    }
  })
})

router.get("/login", function(req, res) {
  res.render("login");
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/assets",
  failureRedirect: "/login"
}), function(req, res) {
});

router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "Successfully logged out");
  res.redirect("/");
});

module.exports = router;
