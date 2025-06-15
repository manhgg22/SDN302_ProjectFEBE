import React, { useEffect, useState } from "react";
import axios from "axios";

const UserResults = () => {
  const userId = localStorage.getItem("userId");
  const [results, setResults] = useState([]);

  useEffect(() => {
  const fetchResults = async () => {
    try {
      const res = await axios.get(`http://localhost:9999/results/${userId}`);
      setResults(res.data.results); // ✅ LẤY MẢNG kết quả từ object
    } catch (err) {
      console.error("Lỗi khi tải kết quả:", err.message);
    }
  };

  fetchResults();
}, [userId]);


  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("vi-VN");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📊 Kết quả bài thi của bạn</h2>

      {results.length === 0 ? (
        <p>⚠️ Bạn chưa làm bài thi nào.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">#</th>
              <th className="border p-2">Mã đề</th>
              <th className="border p-2">Điểm</th>
              <th className="border p-2">Ngày làm</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, index) => (
              <tr key={r._id}>
                <td className="border p-2 text-center">{index + 1}</td>
                <td className="border p-2 text-center">{r.examId?.code || r.examId}</td>
                <td className="border p-2 text-center">{r.score}</td>
                <td className="border p-2 text-center">{formatDate(r.submittedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserResults;
