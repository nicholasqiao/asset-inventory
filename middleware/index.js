var middlewareObject = {};
var Note = require("../models/note")



middlewareObject.checkNoteOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Note.findById(req.params.note_id, function(err, foundNote) {
      if (err) {
        res.redirect("back");
      } else {
        if (foundNote.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You do not have permission to do that")
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "Please Login")
    res.redirect("/login");
  }
}

middlewareObject.isLoggedIn = function (req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please Login")
  res.redirect("/login");
}

module.exports = middlewareObject;