import { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./ContentView.css";

const API_BASE = "http://127.0.0.1:8000";

function ContentView({ lesson, subtopic, onStartTest }) {
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
        <div className="loading">Generating lesson content...</div>
      ) : (
        <div className="markdown-content">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}

      <div className="content-actions">
        <button className="knowledge-btn" onClick={onStartTest}>
          🚀 Start Assessment
        </button>
      </div>
    </div>
  );
}

export default ContentView;