const express = require("express");
const router = express.Router();
const Question = require("../model/Question");
const User = require("../model/userBE");
const Exam = require("../model/Exam");
const Result = require("../model/Result");
const { verifyToken, checkRole } = require("../middleware/auth");


// ============================================================
// 🧠 CÂU HỎI
// ============================================================

/**
 * @route GET /admin/questions
 * @desc Lấy danh sách toàn bộ câu hỏi
 */
router.get("/questions", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy câu hỏi" });
  }
});

/**
 * @route POST /admin/questions
 * @desc Tạo câu hỏi mới
 */
router.post("/questions", async (req, res) => {
  try {
    const { content, options, correctAnswer, explanation, subject, level } = req.body;

    if (!content || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: "Thiếu dữ liệu hoặc sai định dạng" });
    }

    const newQuestion = new Question({
      content,
      options,
      correctAnswer,
      explanation,
      subject,
      level,
      createdAt: new Date()
    });

    await newQuestion.save();
    res.status(201).json({ message: "✅ Tạo câu hỏi thành công", question: newQuestion });
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo câu hỏi", error: err.message });
  }
});


// ============================================================
// 👤 TÀI KHOẢN
// ============================================================

/**
 * @route GET /admin/accounts
 * @desc Lấy danh sách tài khoản (Chỉ admin)
 */
router.get("/accounts", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const accounts = await User.find().select("-password");
    res.status(200).json(accounts);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách tài khoản" });
  }
});


/**
 * @route GET /admin/user/:id
 * @desc Lấy thông tin một người dùng theo ID
 */
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
});


// ============================================================
// 📘 ĐỀ THI
// ============================================================

/**
 * @route GET /admin/tests
 * @desc Lấy danh sách tất cả đề thi
 */
router.get("/tests", async (req, res) => {
  try {
    const exams = await Exam.find().populate("questionIds");
    res.status(200).json(exams);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy danh sách đề thi" });
  }
});

/**
 * @route POST /admin/tests
 * @desc Tạo đề thi mới
 */
router.post("/tests", async (req, res) => {
  try {
    const { title, description, code, duration, questionIds } = req.body;

    if (!title || !code || !Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({ message: "Thiếu dữ liệu hoặc sai định dạng" });
    }

    const examExists = await Exam.findOne({ code });
    if (examExists) {
      return res.status(400).json({ message: "Mã đề thi đã tồn tại" });
    }

    const newExam = new Exam({
      title,
      description,
      code,
      duration, // phút
      questionIds
    });

    await newExam.save();

    res.status(201).json({ message: "✅ Tạo đề thi thành công", exam: newExam });
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo đề thi", error: err.message });
  }
});

/**
 * @route GET /admin/exam/code/:code
 * @desc Lấy ID đề thi từ mã code
 */
router.get("/exam/code/:code", async (req, res) => {
  try {
    const exam = await Exam.findOne({ code: req.params.code });
    if (!exam) return res.status(404).json({ message: "Exam code không tồn tại" });

    res.status(200).json({ examId: exam._id });
  } catch (err) {
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
});

/**
 * @route GET /admin/exam/:id
 * @desc Lấy chi tiết đề thi theo ID
 */
router.get("/exam/:id", async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate("questionIds");

    if (!exam) return res.status(404).json({ message: "Không tìm thấy đề thi" });

    res.status(200).json({
      ...exam.toObject(),
      questions: exam.questionIds,
      duration: exam.duration
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tải đề thi", error: err.message });
  }
});


// ============================================================
// 📊 THỐNG KÊ
// ============================================================

/**
 * @route GET /admin/results?code=REACT-MID
 * @desc Lấy danh sách học sinh đã làm bài theo mã đề
 */
router.get("/results", async (req, res) => {
  const { code } = req.query;

  try {
    const exam = await Exam.findOne({ code });
    if (!exam) return res.status(404).json({ message: "Không tìm thấy mã đề thi" });

    // 📌 Tự động join bảng User
    const results = await Result.find({ examId: exam._id })
      .populate("userId", "username email") // username + email từ bảng User
      .sort({ score: -1 });

    // ✅ Map dữ liệu gọn gàng
    const data = results.map((r) => ({
      userId: r.userId?._id || "Không có",
      username: r.userId?.username || "Không có",
      email: r.userId?.email || "Không có",
      score: r.score,
      submittedAt: r.submittedAt
    }));

    res.status(200).json({
      examTitle: exam.title,
      examCode: code,
      total: data.length,
      results: data
    });
  } catch (err) {
    console.error("❌ Lỗi khi truy xuất thống kê:", err.message);
    res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
  }
});





module.exports = router;
