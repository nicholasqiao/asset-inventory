var express = require("express");
var router = express.Router({mergeParams: true});
var Asset = require("../models/asset")
var Note = require("../models/note")

router.post("/", isLoggedIn, function(req, res) {
  Asset.findById(req.params.id, function(err, foundAsset) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      var newNote = {
        text: req.body.newNote,
        author: {
          id: req.user._id,
          username: req.user.username
        }
      };
      
      Note.create(newNote, function(err, createdNote) {
        if (err) {
          console.log(err);
        } else {
          foundAsset.notes.push(createdNote);
          foundAsset.save();
          res.redirect("/assets/" + req.params.id);
        }
      });
    }
  })
});

router.get("/:note_id/edit", function(req, res) {
  res.send("Edit route for note");
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}


module.exports = router;
