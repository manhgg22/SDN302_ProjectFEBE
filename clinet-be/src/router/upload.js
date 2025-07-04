const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// ❗ Sử dụng đường dẫn tuyệt đối tới thư mục uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "uploads"));  // ✅ đúng thư mục
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Không có file nào được tải lên" });
  }

  const fileUrl = `http://localhost:9999/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

module.exports = router;
