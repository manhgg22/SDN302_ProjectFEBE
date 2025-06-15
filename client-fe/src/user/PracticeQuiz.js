import React, { useEffect, useState } from "react";
import axios from "axios";

const PracticeQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get("http://localhost:9999/admin/questions");
        setQuestions(res.data);
      } catch (err) {
        alert("Không thể tải danh sách câu hỏi");
      }
    };

    fetchQuestions();
  }, []);

  const handleChange = (qid, selected) => {
    setAnswers({ ...answers, [qid]: selected });
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q._id] === q.correctAnswer) correct++;
    });
    setScore(correct);
    setShowScore(true);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📚 Ôn tập câu hỏi</h2>

      {questions.map((q, idx) => (
        <div key={q._id} className="mb-6 border-b pb-4">
          <p className="font-semibold">{idx + 1}. {q.content}</p>
          {q.options.map((opt, i) => (
            <div key={i} className="ml-4">
              <label>
                <input
                  type="radio"
                  name={q._id}
                  value={i}
                  checked={answers[q._id] === i}
                  onChange={() => handleChange(q._id, i)}
                />
                {" "}
                {opt}
              </label>
            </div>
          ))}

          {showScore && (
            <p className={`mt-2 text-sm ${answers[q._id] === q.correctAnswer ? "text-green-600" : "text-red-600"}`}>
              {answers[q._id] === q.correctAnswer ? "✅ Đúng" : `❌ Sai - Đáp án đúng: ${q.options[q.correctAnswer]}`}
            </p>
          )}
        </div>
      ))}

      {!showScore ? (
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Chấm điểm
        </button>
      ) : (
        <div className="mt-4 text-lg font-bold text-green-700">
          🎉 Bạn đúng {score}/{questions.length} câu
        </div>
      )}
    </div>
  );
};

export default PracticeQuiz;
