const Publisher = require("../models/Publisher");
const Book = require("../models/Book");

// Tạo nhà xuất bản mới
const createPublisher = async (req, res) => {
  try {
    const newPublisher = new Publisher(req.body);
    await newPublisher.save();
    res.status(201).json(newPublisher);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Không thể tạo nhà xuất bản" });
  }
};

// Lấy tất cả nhà xuất bản
const getAllPublishers = async (req, res) => {
  try {
    const publishers = await Publisher.find();
    res.status(200).json(publishers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách nhà xuất bản" });
  }
};

// Cập nhật thông tin nhà xuất bản
const updatePublisher = async (req, res) => {
  try {
    const updatedPublisher = await Publisher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPublisher) {
      return res.status(404).json({ message: "Không tìm thấy nhà xuất bản" });
    }
    res.status(200).json(updatedPublisher);
  } catch (error) {
    res.status(400).json({ message: "Không thể cập nhật nhà xuất bản" });
  }
};

// Xóa nhà xuất bản
const deletePublisher = async (req, res) => {
  try {
    // Thêm logic kiểm tra xem NXB có đang được sách nào sử dụng không
    const booksWithPublisher = await Book.find({ maNXB: req.params.id });
    if (booksWithPublisher.length > 0) {
      return res.status(400).json({
        message: "Không thể xóa nhà xuất bản này vì đang có sách sử dụng.",
      });
    }

    const deletedPublisher = await Publisher.findByIdAndDelete(req.params.id);
    if (!deletedPublisher) {
      return res.status(404).json({ message: "Không tìm thấy nhà xuất bản" });
    }
    res.status(200).json({ message: "Nhà xuất bản đã được xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa nhà xuất bản" });
  }
};

module.exports = {
  createPublisher,
  getAllPublishers,
  deletePublisher,
  updatePublisher,
};
