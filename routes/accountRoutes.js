const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getCurrentAccount,
} = require("../controllers/accountController");

router.post("/register", register); // Đăng ký tài khoản mới
router.post("/login", login); // Đăng nhập
router.get("/me/:email", getCurrentAccount); // Lấy thông tin tài khoản hiện tại

module.exports = router;
