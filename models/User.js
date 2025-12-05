const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  // Madocgia: String,
  hoLot: String,
  ten: String,
  ngaySinh: Date,
  //phai: String,
  diaChi: String,
  dienThoai: String,
});

module.exports = mongoose.model("User", UserSchema);
