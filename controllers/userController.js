const User = require("../models/User");
const Account = require("../models/Account");

// Tạo người dùng mới
const createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Lỗi tạo người dùng:", error.message);
    res.status(400).json({ message: "Không thể tạo người dùng" });
  }
};
// Lấy người dùng theo ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Lỗi khi lấy người dùng theo ID:", error.message);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Lấy tất cả người dùng
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Lỗi lấy danh sách người dùng:", error.message);
    res.status(500).json({ message: "Không thể lấy danh sách người dùng" });
  }
};

// Cập nhật thông tin người dùng
const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedUser)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Lỗi cập nhật người dùng:", error.message);
    res.status(400).json({ message: "Không thể cập nhật người dùng" });
  }
};

// Xóa người dùng theo ID
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    // Tìm và xóa tài khoản đăng nhập liên quan
    await Account.findOneAndDelete({ refId: userId, refModel: "User" });
    // Tìm và xóa hồ sơ người dùng
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.status(200).json({ message: "Người dùng đã được xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa người dùng" });
  }
};

module.exports = {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
};
