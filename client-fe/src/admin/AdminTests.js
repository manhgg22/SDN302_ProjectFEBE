import React, { useState } from "react";
import axios from "axios";

const AdminTests = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [duration, setDuration] = useState(30);
  const [questionIds, setQuestionIds] = useState([]);
  const [count, setCount] = useState(5);

  // ✅ Sinh mã đề tự động
  const generateExamCode = () => {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const generatedCode = `EXAM-${random}`;
    setCode(generatedCode);
  };

  // 🎲 Gọi API random câu hỏi
  const handleRandomQuestions = async () => {
    try {
      const res = await axios.get(`http://localhost:9999/admin/questions/random?count=${count}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });
      const ids = res.data.map(q => q._id);
      setQuestionIds(ids);
      alert(`✅ Đã chọn ngẫu nhiên ${ids.length} câu hỏi`);
    } catch (err) {
      console.error("Lỗi khi random câu hỏi:", err);
      alert("❌ Lỗi khi chọn câu hỏi");
    }
  };

  // 📝 Gửi API tạo đề thi
  const handleCreateTest = async () => {
    try {
      await axios.post("http://localhost:9999/admin/tests", {
        title,
        description,
        code,
        duration,
        questionIds
      }, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });
      alert("✅ Đề thi đã được tạo thành công");
    } catch (err) {
      console.error("Lỗi tạo đề thi:", err);
      if (err.response?.data?.message === "Mã đề thi đã tồn tại") {
        alert("❌ Mã đề đã tồn tại. Vui lòng tạo mã mới.");
      } else {
        alert("❌ Không thể tạo đề thi");
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">📝 Tạo đề thi</h2>

      <div className="space-y-3">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Tiêu đề đề thi"
          className="border w-full p-2"
        />
        <input
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Mô tả đề thi"
          className="border w-full p-2"
        />

        {/* Sinh mã đề tự động */}
        <div className="flex items-center gap-2">
          <input
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Mã đề (code)"
            className="border w-full p-2"
          />
          <button
            onClick={generateExamCode}
            className="bg-purple-600 text-white px-3 py-2 rounded"
          >
            🎯 Tạo mã đề
          </button>
        </div>

        <input
          type="number"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
          placeholder="Thời gian (phút)"
          className="border w-full p-2"
        />

        {/* Chọn câu hỏi ngẫu nhiên */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={count}
            onChange={e => setCount(Number(e.target.value))}
            className="border p-2 w-20"
          />
          <button
            onClick={handleRandomQuestions}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            🎲 Chọn ngẫu nhiên
          </button>
        </div>

        <button
          onClick={handleCreateTest}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          ➕ Tạo đề thi
        </button>
      </div>

      {/* Hiển thị số câu hỏi đã chọn */}
      {questionIds.length > 0 && (
        <p className="mt-4 text-sm text-gray-600">
          ✅ Đã chọn <strong>{questionIds.length}</strong> câu hỏi cho đề thi.
        </p>
      )}
    </div>
  );
};

export default AdminTests;
