var express = require('express');
var app = express();
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var methodOverride = require('method-override')
var Asset = require("./models/asset")
var Note = require("./models/note")
var User = require("./models/user")
var passport = require("passport")
var LocalStrategy = require("passport-local")
var passportLocalMongoose = require("passport-local-mongoose")
var flash = require("connect-flash")

var assetRoutes = require("./routes/assets");
var noteRoutes = require("./routes/notes");
var indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/botl")
app.use(require("express-session")({
  secret: "shezadi",
  resave: false,
  saveUninitialized: false
}))

app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.flashError = req.flash("error");
  res.locals.flashSuccess = req.flash("success");
  next();
});
app.use(indexRoutes);
app.use("/assets", assetRoutes);
app.use("/assets/:id/notes", noteRoutes);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("server running...");
});

