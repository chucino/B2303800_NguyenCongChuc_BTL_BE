const express = require("express");
const {
  getAllBooks,
  getBookByMaSach,
  createBook,
  updateBook,
  deleteBook,
  getOutOfStockBooks,
} = require("../controllers/bookController");

const router = express.Router();

router.get("/out-of-stock", getOutOfStockBooks);

router.get("/", getAllBooks); // Lấy tất cả sách
router.post("/", createBook); // Tạo sách mới
router.get("/masach/:maSach", getBookByMaSach); // Lấy sách theo mã sách
router.put("/:id", updateBook); // Cập nhật thông tin sách
router.delete("/:id", deleteBook); // Xóa sách
module.exports = router;
