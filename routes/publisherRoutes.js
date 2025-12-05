const express = require("express");
const router = express.Router();
const {
  createPublisher,
  getAllPublishers,
  deletePublisher,
  updatePublisher,
} = require("../controllers/publisherController");

router.post("/", createPublisher); // Tạo nhà xuất bản mới
router.get("/", getAllPublishers); // Lấy tất cả nhà xuất bản
router.put("/:id", updatePublisher); // Cập nhật nhà xuất bản theo ID
router.delete("/:id", deletePublisher); // Xóa nhà xuất bản theo ID

module.exports = router;
