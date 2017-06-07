var express = require("express");
var router = express.Router({mergeParams: true});
var Asset = require("../models/asset")
var Note = require("../models/note")
var middleware = require("../middleware")

router.post("/", middleware.isLoggedIn, function(req, res) {
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

router.get("/:note_id/edit", middleware.checkNoteOwnership, function (req, res) {
  Note.findById(req.params.note_id, function(err, foundNote) {
    if (err) {
      console.log("cant find note");
    } else {
      res.render("notes/edit", {assetID: req.params.id, note: foundNote});
    }
  })
});

router.put("/:note_id", middleware.checkNoteOwnership, function(req, res) {
    Note.findByIdAndUpdate(req.params.note_id, req.body.note, function(err, updatedNote) {
      if (err) {
        res.redirect("/");
      } else {
        res.redirect("/assets/" + req.params.id);
      }
    });
});

router.delete("/:note_id", middleware.checkNoteOwnership, function (req, res) {
  Note.findByIdAndRemove(req.params.note_id, function(err) {
    if (err) {
      res.redirect("/");
    } else {
      res.redirect("/assets/" + req.params.id);
    }
  });
});

module.exports = router;
