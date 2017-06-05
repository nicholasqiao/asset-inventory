var express = require("express");
var router = express.Router();
var Asset = require("../models/asset")
var Note = require("../models/note")

router.get('/', function (req, res) {
  Asset.find({}, function(err, allAssets) {
    if(err) {
      console.log(err);
    } else {
      res.render("assets", {assets: allAssets});
    }
  });
});

router.get('/new', isLoggedIn, function (req, res) {
    res.render("new");
});

router.post('/', isLoggedIn, function (req, res) {
  var newNote = {
    text: req.body.newAsset.note,
    author: {
      id: req.user._id,
      username: req.user.username
    }
  };
  
  Asset.create(req.body.newAsset, function(err, createdAsset) {
    if (err) {
      console.log(err);
    } else {
      Note.create(newNote, function(err, createdNote) {
        if (err) {
          console.log(err);
        } else {
          createdAsset.notes.push(createdNote);
          createdAsset.save();
          //console.log(createdAsset);
          res.redirect("/assets");
        };
      })
    }
  });
});

router.get("/:id", function(req, res) {
  Asset.findById(req.params.id).populate("notes").exec(function(err, foundAsset) {
    if(err) {
      console.log(err);
    } else {
      //console.log(foundAsset.notes[0].created);
      res.render("show", {asset: foundAsset});
    }
  });
});

router.get("/:id/edit", isLoggedIn, function(req, res) {
  Asset.findById(req.params.id, function(err, foundAsset) {
    if(err) {
      res.redirect("/")
    } else {
      res.render("edit", {asset: foundAsset});
    }
  });
});

router.put("/:id", isLoggedIn, function(req, res) {
  Asset.findByIdAndUpdate(req.params.id, req.body.assetData, function(err, updatedAsset) {
    if (err) {
      res.redirect("/");
    } else {
      res.redirect("/assets/" + req.params.id);
    }
  });
});

router.delete("/:id", isLoggedIn, function(req, res) {
  Asset.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/");
    } else {
      res.redirect("/assets");
    }
  });
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
