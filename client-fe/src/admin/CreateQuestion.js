import React, { useEffect, useState } from "react";
import axios from "axios";

const CreateQuestion = () => {
  const [form, setForm] = useState({
    content: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
    subject: "",
    level: "easy"
  });

  const [questions, setQuestions] = useState([]);

  // Lấy danh sách câu hỏi khi load
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const res = await axios.get("http://localhost:9999/admin/questions");
    setQuestions(res.data);
  };

  const handleChangeOption = (index, value) => {
    const updated = [...form.options];
    updated[index] = value;
    setForm({ ...form, options: updated });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:9999/admin/questions", form);
      alert("✅ Tạo câu hỏi thành công!");
      setForm({
        content: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
        subject: "",
        level: "easy"
      });
      fetchQuestions(); // làm mới danh sách
    } catch (err) {
      alert("❌ Lỗi khi tạo câu hỏi");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📌 Tạo câu hỏi mới</h2>

      <input
        className="border w-full p-2 mb-2"
        placeholder="Nội dung câu hỏi"
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
      />

      {form.options.map((opt, i) => (
        <input
          key={i}
          className="border w-full p-2 mb-2"
          placeholder={`Đáp án ${i + 1}`}
          value={opt}
          onChange={(e) => handleChangeOption(i, e.target.value)}
        />
      ))}

      <label className="block mb-2">
        Đáp án đúng:
        <select
          className="border ml-2 p-1"
          value={form.correctAnswer}
          onChange={(e) => setForm({ ...form, correctAnswer: parseInt(e.target.value) })}
        >
          {[0, 1, 2, 3].map((i) => (
            <option key={i} value={i}>
              Đáp án {i + 1}
            </option>
          ))}
        </select>
      </label>

      <input
        className="border w-full p-2 mb-2"
        placeholder="Giải thích"
        value={form.explanation}
        onChange={(e) => setForm({ ...form, explanation: e.target.value })}
      />

      <input
        className="border w-full p-2 mb-2"
        placeholder="Chủ đề"
        value={form.subject}
        onChange={(e) => setForm({ ...form, subject: e.target.value })}
      />

      <label className="block mb-2">
        Độ khó:
        <select
          className="border ml-2 p-1"
          value={form.level}
          onChange={(e) => setForm({ ...form, level: e.target.value })}
        >
          <option value="easy">Dễ</option>
          <option value="medium">Trung bình</option>
          <option value="hard">Khó</option>
        </select>
      </label>

      <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 mt-2 rounded">
        ➕ Tạo câu hỏi
      </button>

      <hr className="my-6" />

      <h3 className="text-xl font-semibold mb-2">📚 Danh sách câu hỏi đã tạo</h3>
      {questions.map((q, i) => (
        <div key={q._id} className="mb-4 p-3 border rounded bg-gray-50">
          <p className="font-semibold">{i + 1}. {q.content}</p>
          <ul className="list-disc ml-5">
            {q.options.map((opt, idx) => (
              <li key={idx} className={q.correctAnswer === idx ? "text-green-600 font-bold" : ""}>
                {opt}
              </li>
            ))}
          </ul>
          <p className="text-sm italic">📌 Chủ đề: {q.subject} | Độ khó: {q.level}</p>
        </div>
      ))}
    </div>
  );
};

export default CreateQuestion;
