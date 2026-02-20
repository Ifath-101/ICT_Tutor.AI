import { useEffect, useState } from "react";
import axios from "axios";
import "./ContentView.css";

const API_BASE = "http://127.0.0.1:8000";

function ContentView({ lesson, subtopic, onCheckKnowledge }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    axios
      .get(`${API_BASE}/lesson/${lesson}/content/${subtopic}`)
      .then((res) => {
        setContent(res.data.content);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [lesson, subtopic]);

  return (
    <div className="content-card">
      <h2 className="content-title">📖 Study Content</h2>

      {loading ? (
        <p className="loading">Generating lesson content...</p>
      ) : (
        <p className="content-text">{content}</p>
      )}

      <button
        className="knowledge-btn"
        onClick={onCheckKnowledge}
      >
        Check Knowledge
      </button>
    </div>
  );
}

export default ContentView;