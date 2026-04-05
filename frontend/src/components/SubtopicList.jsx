import { useEffect, useState } from "react";
import { api } from "../api/client";
import "./SubtopicList.css";

function SubtopicList({ lesson, onSelectSubtopic, onDirectTest }) {
  const [objectives, setObjectives] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/lesson/${lesson}/blueprint`)
      .then((res) => {
        setObjectives(res.data.learning_objectives);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [lesson]);

  if (loading) return <div className="loading">Loading subtopics...</div>;

  return (
    <div className="subtopic-card">
      <h2 className="subtopic-title">Choose a Subtopic</h2>

      {Object.entries(objectives).map(([loKey, loValue]) => (
        <div key={loKey} className="subtopic-row">
          <h3>{loKey}</h3>
          <p className="objective-text">{loValue.objective}</p>

          <div className="subtopic-actions">
            <button
              className="study-btn"
              onClick={() => onSelectSubtopic(loKey)}
            >
              📖 Study Content
            </button>

            <button
              className="test-btn"
              onClick={() => onDirectTest(loKey)}
            >
              📝 Try Assessment
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SubtopicList;