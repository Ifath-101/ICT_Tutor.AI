import { useEffect, useState } from "react";
import axios from "axios";
import "./QuestionView.css";

const API_BASE = "http://127.0.0.1:8000";

function QuestionView({ lesson }) {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);

  const fetchQuestion = () => {
    axios
      .get(`${API_BASE}/lesson/${lesson}/next-question`)
      .then((res) => {
        setQuestion(res.data);
        setAnswer("");
        setFeedback(null);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const submitAnswer = () => {
    axios
      .post(`${API_BASE}/lesson/${lesson}/answer`, {
        learning_objective: question.learning_objective,
        question_id: "q1",
        answer: answer,
      })
      .then((res) => {
        setFeedback(res.data);
      })
      .catch((err) => console.error(err));
  };

  if (!question) return <p className="loading">Loading question...</p>;

  return (
    <div className="question-card">
      <h2 className="question-title">📝 Test Mode</h2>

      <div className="question-box">
        <strong>Question:</strong>
        <p>{question.question}</p>
      </div>

      <textarea
        className="answer-input"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer here..."
      />

      <button className="submit-btn" onClick={submitAnswer}>
        Submit Answer
      </button>

      {feedback && (
        <div className="feedback-box">
          <h3>Feedback</h3>
          <p>{feedback.feedback}</p>

          <button className="next-btn" onClick={fetchQuestion}>
            Next Question
          </button>
        </div>
      )}
    </div>
  );
}

export default QuestionView;