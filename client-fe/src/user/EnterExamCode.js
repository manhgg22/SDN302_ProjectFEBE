import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EnterExamCode = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.get(`http://localhost:9999/exam/code/${code}`);
      const examId = res.data.examId;
      navigate(`/user/quiz/${examId}`);
    } catch (err) {
      setError("❌ Mã đề không tồn tại!");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">🔑 Nhập mã đề thi</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nhập exam code (VD: REACT2025)"
          className="border p-2 w-full mb-2"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Vào làm bài
        </button>
      </form>

      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default EnterExamCode;
