import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { api } from "../api/client";
import "./ContentView.css";

function ContentView({ lesson, subtopic, onStartTest }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    api
      .get(`/lesson/${lesson}/content/${subtopic}`)
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