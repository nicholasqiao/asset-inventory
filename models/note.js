var mongoose = require("mongoose");

var noteSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    created: {type: Date, default: Date.now}
})

// var noteSchema = mongoose.Schema({
//     text: String,
//     author: String,
//     created: {type: Date, default: Date.now}
// })

module.exports = mongoose.model("Note", noteSchema);