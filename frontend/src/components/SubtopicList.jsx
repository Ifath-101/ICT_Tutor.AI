import { useEffect, useState } from "react";
import { api } from "../api/client";
import "./SubtopicList.css";

/** mode: "full" | "learn" | "assessment" */
function SubtopicList({
  lesson,
  mode = "full",
  onSelectSubtopic,
  onDirectTest,
}) {
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

  const showStudy = mode === "full" || mode === "learn";
  const showAssessment = mode === "full" || mode === "assessment";

  return (
    <div className="subtopic-card">
      <h2 className="subtopic-title">Choose a Subtopic</h2>

      {Object.entries(objectives).map(([loKey, loValue]) => (
        <div key={loKey} className="subtopic-row">
          <h3>{loKey}</h3>
          <p className="objective-text">{loValue.objective}</p>

          <div className="subtopic-actions">
            {showStudy && (
              <button
                className="study-btn"
                onClick={() => onSelectSubtopic(loKey)}
              >
                📖 Study Content
              </button>
            )}

            {showAssessment && onDirectTest && (
              <button
                className="test-btn"
                onClick={() => onDirectTest(loKey)}
              >
                📝 Start assessment
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SubtopicList;