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
  const [meta, setMeta] = useState({
    title: "",
    grade_level: "",
    scope: "",
  });
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoading(true);
    setFailed(false);
    api
      .get(`/lesson/${lesson}/blueprint`)
      .then((res) => {
        setObjectives(res.data.learning_objectives ?? {});
        setMeta({
          title: res.data.title ?? "Lesson",
          grade_level: res.data.grade_level ?? "",
          scope: res.data.scope ?? "",
        });
        setLoading(false);
      })
      .catch(() => {
        setFailed(true);
        setLoading(false);
      });
  }, [lesson]);

  const showStudy = mode === "full" || mode === "learn";
  const showAssessment = mode === "full" || mode === "assessment";

  const entries = Object.entries(objectives);

  if (loading) {
    return (
      <div className="subtopic-page">
        <div className="subtopic-loading">
          <span className="subtopic-loading__dot" />
          <span className="subtopic-loading__dot" />
          <span className="subtopic-loading__dot" />
          <p>Loading lesson outline…</p>
        </div>
      </div>
    );
  }

  if (failed || entries.length === 0) {
    return (
      <div className="subtopic-page">
        <div className="subtopic-error">
          Could not load this lesson. Try again or pick another lesson.
        </div>
      </div>
    );
  }

  return (
    <div className="subtopic-page">
      <header className="subtopic-hero">
        <p className="subtopic-eyebrow">Lesson outline</p>
        <h1 className="subtopic-hero__title">{meta.title}</h1>
        <div className="subtopic-hero__meta">
          {meta.grade_level && (
            <span className="subtopic-pill">{meta.grade_level}</span>
          )}
          <span className="subtopic-pill subtopic-pill--muted">
            {entries.length} objectives
          </span>
        </div>
        {meta.scope && (
          <p className="subtopic-hero__scope">{meta.scope}</p>
        )}
      </header>

      <section className="subtopic-section" aria-labelledby="lo-heading">
        <div className="subtopic-section__head">
          <h2 id="lo-heading" className="subtopic-section__title">
            Learning objectives
          </h2>
          <p className="subtopic-section__hint">
            {showStudy
              ? "Open a topic to generate personalized study content, then assess when you are ready."
              : "Choose where to begin."}
          </p>
        </div>

        <ul className="subtopic-cards">
          {entries.map(([loKey, loValue], index) => (
            <li key={loKey} className="subtopic-card">
              <div className="subtopic-card__rail" aria-hidden>
                <span className="subtopic-card__index">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="subtopic-card__main">
                <div className="subtopic-card__top">
                  <span className="subtopic-card__id">{loKey}</span>
                  {loValue.cognitive_level && (
                    <span className="subtopic-chip">{loValue.cognitive_level}</span>
                  )}
                </div>
                <p className="subtopic-card__objective">{loValue.objective}</p>
                <div className="subtopic-card__actions">
                  {showStudy && (
                    <button
                      type="button"
                      className="subtopic-btn subtopic-btn--primary"
                      onClick={() => onSelectSubtopic(loKey)}
                    >
                      Study this topic
                    </button>
                  )}
                  {showAssessment && onDirectTest && (
                    <button
                      type="button"
                      className="subtopic-btn subtopic-btn--secondary"
                      onClick={() => onDirectTest(loKey)}
                    >
                      Start assessment
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default SubtopicList;
