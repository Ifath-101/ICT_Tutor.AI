import { useEffect, useState } from "react";
import axios from "axios";
import "./QuestionView.css";

const API_BASE = "http://127.0.0.1:8000";

function QuestionView({ lesson }) {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);

  const fetchQuestion = () => {
    axios
      .get(`${API_BASE}/lesson/${lesson}/next-question`)
      .then((res) => {
        setQuestion(res.data);
        setAnswer("");
        setResult(null);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const submitAnswer = () => {
    if (!answer.trim()) return;

    axios
      .post(`${API_BASE}/lesson/${lesson}/answer`, {
        learning_objective: question.learning_objective,
        answer: answer,
        correct_answer: question.correct_answer,
      })
      .then((res) => {
        setResult(res.data);
      })
      .catch((err) => console.error(err));
  };

  if (!question) return <div className="loading">Loading question...</div>;

  return (
    <div className="question-card">
      <h2 className="question-title">📝 Adaptive Assessment</h2>

      <div className="question-box">
        <p>{question.question}</p>
      </div>

      <textarea
        className="answer-input"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer..."
      />

      <button className="submit-btn" onClick={submitAnswer}>
        Submit Answer
      </button>

      {result && (
        <div className="result-box">
          <p><strong>Score:</strong> {(result.score * 100).toFixed(0)}%</p>
          <p><strong>Mastery:</strong> {(result.updated_mastery * 100).toFixed(0)}%</p>
          <p><strong>Explanation:</strong> {result.explanation}</p>
          <p><strong>Strengths:</strong> {result.strengths}</p>
          <p><strong>Improvements:</strong> {result.improvements}</p>

          <button className="next-btn" onClick={fetchQuestion}>
            Next Question
          </button>
        </div>
      )}
    </div>
  );
}

export default QuestionView;