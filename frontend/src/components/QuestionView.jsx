import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import "./QuestionView.css";

function QuestionView({ lesson: lessonProp }) {
  const { lessonId } = useParams();
  const lesson = lessonProp ?? lessonId;

  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [hint, setHint] = useState(null);
  const [isHintLoading, setIsHintLoading] = useState(false);

  const fetchQuestion = useCallback((signal) => {
    if (!lesson) return;
    api
      .get(`/lesson/${lesson}/next-question`, { signal })
      .then((res) => {
        setQuestion(res.data);
        setAnswer("");
        setResult(null);
        setHint(null);
      })
      .catch((err) => {
        if (err.name !== "CanceledError") {
          console.error(err);
        }
      });
  }, [lesson]);

  useEffect(() => {
    const controller = new AbortController();
    setQuestion(null);
    setResult(null);
    fetchQuestion(controller.signal);

    return () => {
      controller.abort();
    };
  }, [lesson, fetchQuestion]);

  const submitAnswer = () => {
    if (!answer.trim() || !question) return;

    api
      .post(`/lesson/${lesson}/answer`, {
        learning_objective: question.learning_objective,
        answer: answer,
        correct_answer: question.correct_answer,
      })
      .then((res) => {
        setResult(res.data);
      })
      .catch((err) => console.error(err));
  };

  const fetchHint = () => {
    if (!question) return;
    setIsHintLoading(true);
    api
      .post(`/lesson/${lesson}/hint`, {
        question: question.question,
        correct_answer: question.correct_answer,
      })
      .then((res) => {
        setHint(res.data.hint);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsHintLoading(false));
  };

  if (!lesson) {
    return (
      <div className="loading-container">
        Missing lesson.
      </div>
    );
  }

  if (!question) return (
    <div className="loading-container">
      <div className="loading-spinner" aria-hidden="true" />
    </div>
  );

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

      <div className="action-buttons" style={{ display: "flex", gap: "10px" }}>
        <button type="button" className="submit-btn" onClick={submitAnswer}>
          Submit Answer
        </button>
        <button type="button" className="hint-btn" onClick={fetchHint} disabled={isHintLoading} style={{ padding: "10px 16px", borderRadius: "10px", border: "1px solid #cbd5e1", cursor: "pointer", background: "white" }}>
          {isHintLoading ? "Getting Hint..." : "Get Hint"}
        </button>
      </div>

      {hint && (
        <div className="socratic-hint">
          <p><strong>💡 Hint:</strong> {hint}</p>
        </div>
      )}

      {result && (
        <div className="result-box">
          <p>
            <strong>Score:</strong> {(result.score * 100).toFixed(0)}%
          </p>
          <p>
            <strong>Mastery:</strong>{" "}
            {(result.updated_mastery * 100).toFixed(0)}%
          </p>
          <p>
            <strong>Explanation:</strong> {result.explanation}
          </p>
          <p>
            <strong>Strengths:</strong> {result.strengths}
          </p>
          <p>
            <strong>Improvements:</strong> {result.improvements}
          </p>

          <button type="button" className="next-btn" onClick={fetchQuestion} style={{ marginTop: "15px" }}>
            Next Question
          </button>
        </div>
      )}
    </div>
  );
}

export default QuestionView;
