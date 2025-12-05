const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema({
  msnv: Number,
  hoTenNV: String,
  chucVu: String,
  diaChi: String,
  soDienThoai: String,
});

module.exports = mongoose.model("Staff", StaffSchema);
