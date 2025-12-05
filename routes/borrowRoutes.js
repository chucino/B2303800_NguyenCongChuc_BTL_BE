const express = require("express");
const router = express.Router();

const {
  createBorrow,
  getAllBorrows,
  getBorrowHistoryByUser,
  markAsReturned,
  deleteBorrow,
} = require("../controllers/borrowController");

router.post("/", createBorrow); // Tạo phiếu mượn mới
router.get("/me/:userId", getBorrowHistoryByUser); // Lấy lịch sử mượn của người dùng
router.get("/", getAllBorrows); // Lấy tất cả phiếu mượn
router.patch("/return/:id", markAsReturned); // Đánh dấu phiếu mượn là đã trả
router.delete("/:id", deleteBorrow); // Xóa phiếu mượn

module.exports = router;
