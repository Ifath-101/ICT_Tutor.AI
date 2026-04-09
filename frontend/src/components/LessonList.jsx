import { useEffect, useState } from "react";
import { api } from "../api/client";
import "./LessonList.css";

function LessonList({ onSelectLesson }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/lessons")
      .then((res) => {
        if (!cancelled) {
          setLessons(res.data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="lesson-card">
        <div className="loading-container">
          <div className="loading-spinner" aria-hidden="true" />
        </div>
      </div>
    );
  }

  if (error || lessons.length === 0) {
    return (
      <div className="lesson-card">
        <h2 className="lesson-title">Select a Lesson</h2>
        <p className="lesson-error">
          Could not load lessons. Check that the API is running and lesson
          blueprints exist in <code>backend/data/</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="lesson-card">
      <h2 className="lesson-title">Select a Lesson</h2>
      <div className="lesson-grid">
        {lessons.map((l) => (
          <button
            key={l.lesson_id}
            type="button"
            className="lesson-btn"
            onClick={() => onSelectLesson(l.lesson_id)}
          >
            <span className="lesson-btn__title">{l.title}</span>
            {l.grade_level && (
              <span className="lesson-btn__meta">{l.grade_level}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LessonList;
