var mongoose = require("mongoose");

var assetSchema = new mongoose.Schema({
  hostname: String,
  serialnumber: String,
  ipaddress: String,
  operatingsystem: String,
  machinetype: String,
  machinemodel: String,
  location: String,
  ethport: Number,
  netport: Number,
  group: String,
  ipv6: String,
  notes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Note"
  }]
});

module.exports = mongoose.model("Asset", assetSchema);