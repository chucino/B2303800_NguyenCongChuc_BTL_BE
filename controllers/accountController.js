const Account = require("../models/Account");
const User = require("../models/User");
const Staff = require("../models/Staff");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Đăng ký tài khoản mới
const register = async (req, res) => {
  try {
    const { email, password, role, refId, refModel } = req.body;

    if (!password || password.trim().length < 6)
      return res
        .status(400)
        .json({ message: "Mật khẩu phải có ít nhất 6 kí tự" });

    const accountExists = await Account.findOne({ email });
    if (accountExists)
      return res.status(400).json({ message: "email đã tồn tại" });

    const hashedPass = await bcrypt.hash(password, 10);
    const newAccount = new Account({
      email,
      password: hashedPass,
      role,
      refId,
      refModel,
    });

    await newAccount.save();
    res.status(201).json(newAccount);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Không thể đăng ký tài khoản" });
  }
};

// Đăng nhập
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const account = await Account.findOne({ email });
    if (!account)
      return res.status(404).json({ message: "Tài khoản không tồn tại" });

    const match = await bcrypt.compare(password, account.password);
    if (!match)
      return res.status(401).json({ message: "Mật khẩu không chính xác" });

    let userInfo = {};
    if (account.refModel === "User") {
      const user = await User.findById(account.refId);
      if (user)
        userInfo = {
          userId: account.refId,
          fullName: `${user.hoLot} ${user.ten}`,
          email: account.email,
          role: account.role,
        };
    } else if (account.refModel === "Staff") {
      const staff = await Staff.findById(account.refId);
      if (staff)
        userInfo = {
          userId: account.refId,
          hoTenNV: staff.hoTenNV,
          chucVu: staff.chucVu,
          role: account.role,
        };
    }

    const token = jwt.sign(
      { id: account._id, role: account.role },
      process.env.JWT_SECRET || "dev_secret_key",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      role: account.role,
      userInfo,
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error.message);
    res.status(500).json({ message: "Đăng nhập thất bại" });
  }
};

// Lấy thông tin tài khoản hiện tại
const getCurrentAccount = async (req, res) => {
  try {
    const { email } = req.params;
    const account = await Account.findOne({ email });
    if (!account)
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });

    res.status(200).json(account);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy thông tin tài khoản" });
  }
};

module.exports = {
  getCurrentAccount,
  login,
  register,
};
