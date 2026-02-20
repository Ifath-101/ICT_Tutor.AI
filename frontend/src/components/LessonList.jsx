import "./LessonList.css";

function LessonList({ onSelectLesson }) {
  return (
    <div className="lesson-card">
      <h2 className="lesson-title">Select a Lesson</h2>

      <button
        className="lesson-btn"
        onClick={() => onSelectLesson("lesson1")}
      >
        📘 Introduction to ICT
      </button>
    </div>
  );
}

export default LessonList;