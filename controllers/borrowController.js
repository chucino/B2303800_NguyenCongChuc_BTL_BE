const Borrow = require("../models/Borrow");
const Book = require("../models/Book");

const createBorrow = async (req, res) => {
  try {
    const { borrowerId, onModel, bookId, ngayTra } = req.body;

    // --- LOGIC KIỂM TRA ĐIỀU KIỆN MƯỢN SÁCH ---

    // 1. Lấy tất cả sách người dùng đang mượn
    const currentBorrows = await Borrow.find({
      borrowerId: borrowerId,
      status: "Đang mượn",
    });

    // 2. Kiểm tra nếu đã mượn đủ 3 cuốn
    if (currentBorrows.length >= 3) {
      return res.status(400).json({
        message:
          "Bạn đã mượn đủ 3 cuốn sách. Vui lòng trả sách cũ trước khi mượn thêm.",
      });
    }

    // 3. Kiểm tra xem có cuốn nào bị quá hạn không
    const now = new Date();
    const hasOverdueBook = currentBorrows.some(
      (borrow) => new Date(borrow.ngayTra) < now
    );

    if (hasOverdueBook) {
      return res.status(400).json({
        message:
          "Bạn có sách đã quá hạn trả. Vui lòng trả sách trước khi mượn thêm.",
      });
    }
    // --- KẾT THÚC LOGIC KIỂM TRA ---

    const book = await Book.findById(bookId);
    if (!book || book.soQuyen <= 0) {
      return res
        .status(400)
        .json({ message: "Sách đã hết hoặc không tồn tại." });
    }

    const newBorrow = new Borrow({ borrowerId, onModel, bookId, ngayTra });
    await newBorrow.save();

    // Giảm số lượng sách khi mượn
    await Book.findByIdAndUpdate(bookId, { $inc: { soQuyen: -1 } });

    res.status(201).json(newBorrow);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Không thể tạo phiếu mượn sách" });
  }
};

// Lấy lịch sử mượn sách của một người dùng
const getBorrowHistoryByUser = async (req, res) => {
  try {
    const borrows = await Borrow.find({ borrowerId: req.params.userId })
      .populate("borrowerId")
      .populate("bookId");

    res.status(200).json(borrows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy lịch sử mượn của người dùng" });
  }
};

// Lấy tất cả phiếu mượn
const getAllBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find()
      .populate("borrowerId")
      .populate("bookId");

    res.status(200).json(borrows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách phiếu mượn" });
  }
};

// Đánh dấu phiếu mượn là đã trả
const markAsReturned = async (req, res) => {
  try {
    const borrowId = req.params.id;
    const updatedBorrow = await Borrow.findByIdAndUpdate(
      borrowId,
      {
        status: "Đã trả",
        ngayThucTra: new Date(),
      },
      { new: true }
    );

    if (!updatedBorrow) {
      return res.status(404).json({ message: "Không tìm thấy phiếu mượn" });
    }
    // Tăng số lượng sách khi trả
    await Book.findByIdAndUpdate(updatedBorrow.bookId, {
      $inc: { soQuyen: 1 },
    });

    res.status(200).json(updatedBorrow);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật trạng thái phiếu mượn" });
  }
};

// Xóa phiếu mượn
const deleteBorrow = async (req, res) => {
  try {
    const deletedBorrow = await Borrow.findByIdAndDelete(req.params.id);
    if (!deletedBorrow) {
      return res.status(404).json({ message: "Không tìm thấy phiếu mượn" });
    }
    res.status(200).json({ message: "Đã xóa phiếu mượn thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa phiếu mượn" });
  }
};

module.exports = {
  createBorrow,
  getBorrowHistoryByUser,
  getAllBorrows,
  markAsReturned,
  deleteBorrow,
};
