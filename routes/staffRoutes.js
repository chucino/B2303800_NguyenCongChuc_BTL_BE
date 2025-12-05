const express = require("express");
const router = express.Router();
const {
  createAdmin,
  getStaffById,
  getAllStaff,
  updateStaff,
  deleteStaff,
} = require("../controllers/staffController");

router.post("/admin", createAdmin); // Tạo nhân viên quản trị mới
router.get("/:id", getStaffById); // Lấy thông tin nhân viên theo ID
router.get("/", getAllStaff); // Lấy tất cả nhân viên
router.put("/:id", updateStaff); // Cập nhật thông tin nhân viên
router.delete("/:id", deleteStaff); // Xóa nhân viên

module.exports = router;
