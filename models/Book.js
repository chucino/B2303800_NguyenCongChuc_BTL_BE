const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  maSach: {
    type: Number,
    unique: true,
    required: true,
    validate: {
      validator: (value) => value > 0,
      message: "Mã sách phải là số nguyên dương",
    },
  },
  tenSach: { type: String, required: true },
  donGia: Number,
  soQuyen: { type: Number, default: 1 },
  namXuatBan: Number,
  tacGia: { type: String, required: true },
  maNXB: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Publisher",
    required: true,
  },
  hinhAnh: { type: String, default: "" },
});

module.exports = mongoose.model("Book", BookSchema);
