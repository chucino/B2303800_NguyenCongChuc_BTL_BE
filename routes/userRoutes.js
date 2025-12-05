const express = require("express");
const router = express.Router();
const {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

router.post("/", createUser); // Tạo người dùng
router.get("/:id", getUserById); // Lấy người dùng theo ID
router.get("/", getAllUsers); // Lấy danh sách người dùng
router.put("/:id", updateUser); // Cập nhật người dùng theo ID
router.delete("/:id", deleteUser); // Xóa người dùng theo ID

module.exports = router;
