import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TakeExam = () => {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null); // seconds
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await axios.get(`http://localhost:9999/exam/${examId}`);
        setExam(res.data);

        const durationInSeconds = (res.data.duration || res.data.timeLimit || 30) * 60;
        setTimeLeft(durationInSeconds);
      } catch (err) {
        alert("Không tải được đề thi");
      }
    };

    fetchExam();
  }, [examId]);

  // ⏳ Đếm ngược thời gian
  useEffect(() => {
    if (!timeLeft || score !== null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true); // tự động nộp khi hết giờ
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, score]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleChange = (qid, optIdx) => {
    setAnswers({ ...answers, [qid]: optIdx });
  };

  const handleSubmit = async (autoSubmit = false) => {
    const formattedAnswers = Object.entries(answers).map(([questionId, selected]) => ({
      questionId,
      selected
    }));

    try {
      const res = await axios.post("http://localhost:9999/result/submit", {
        userId,
        examId,
        answers: formattedAnswers
      });
      setScore(res.data.score);

      if (autoSubmit) {
        alert("⏰ Hết giờ! Bài đã được tự động nộp.");
      }
    } catch (err) {
      alert("Nộp bài thất bại");
    }
  };

  if (!exam) return <div>Đang tải đề thi...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">📝 {exam.title}</h2>
        {timeLeft !== null && (
          <div className="text-red-600 font-semibold text-lg">
            ⏳ Thời gian còn lại: {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <p className="italic text-gray-600 mb-4">⏱️ Tổng thời gian: {exam.duration || exam.timeLimit} phút</p>

      {exam.questions.map((q, i) => (
        <div key={q._id} className="mb-6">
          <p className="font-medium">{i + 1}. {q.content}</p>
          {q.options.map((opt, idx) => (
            <div key={idx} className="ml-4">
              <label>
                <input
                  type="radio"
                  name={q._id}
                  value={idx}
                  checked={answers[q._id] === idx}
                  onChange={() => handleChange(q._id, idx)}
                  disabled={score !== null}
                />
                {" "}{opt}
              </label>
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={() => handleSubmit(false)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={score !== null}
      >
        Nộp bài
      </button>

      {score !== null && (
        <div className="mt-4 text-green-600 font-bold">
          ✅ Bạn đã nộp bài. Điểm: {score}
        </div>
      )}
    </div>
  );
};

export default TakeExam;
