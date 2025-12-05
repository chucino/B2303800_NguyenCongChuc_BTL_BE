const Book = require("../models/Book");
const Borrow = require("../models/Borrow");
const Publisher = require("../models/Publisher");

// Lấy tất cả sách
const getAllBooks = async (req, res) => {
  try {
    // Xóa điều kiện `isActive` để lấy tất cả sách
    const books = await Book.find().populate("maNXB", "tenNXB maNXB");
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
    console.error(error);
  }
};

// Lấy sách theo mã sách
const getBookByMaSach = async (req, res) => {
  try {
    // Xóa điều kiện `isActive`
    const book = await Book.findOne({
      maSach: Number(req.params.maSach),
    }).populate("maNXB", "tenNXB maNXB");
    if (!book)
      return res.status(404).json({ message: "Không tìm thấy sách theo mã" });

    res.status(200).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy sách theo mã" });
  }
};

// Tạo sách mới
const createBook = async (req, res) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.error(error);
  }
};

// Cập nhật thông tin sách
const updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedBook) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sách để cập nhật" });
    }
    res.status(200).json(updatedBook);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Không thể cập nhật sách" });
  }
};

// Xóa sách
const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    // Giữ lại logic kiểm tra sách đang được mượn
    const activeBorrows = await Borrow.find({
      bookId: bookId,
      status: "Đang mượn",
    });

    if (activeBorrows.length > 0) {
      return res
        .status(400)
        .json({ message: "Không thể xóa sách này vì đang có người mượn." });
    }

    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return res.status(404).json({ message: "Không tìm thấy sách để xóa" });
    }
    res.status(200).json({ message: "Sách đã được xóa thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi xóa sách" });
  }
};

// Lấy danh sách sách đã hết
const getOutOfStockBooks = async (req, res) => {
  try {
    const outOfStockBooks = await Book.find({ soQuyen: 0 }).populate(
      "maNXB",
      "tenNXB"
    );
    res.status(200).json(outOfStockBooks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách sách đã hết" });
  }
};

module.exports = {
  getAllBooks,
  getBookByMaSach,
  createBook,
  deleteBook,
  updateBook,
  getOutOfStockBooks,
};
