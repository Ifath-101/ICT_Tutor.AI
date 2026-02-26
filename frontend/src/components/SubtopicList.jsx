import "./SubtopicList.css";

function SubtopicList({ lesson, onSelectSubtopic, onDirectTest }) {
  return (
    <div className="subtopic-card">
      <h2 className="subtopic-title">Choose a Subtopic</h2>

      {["LO1", "LO2"].map((lo) => (
        <div key={lo} className="subtopic-row">
          <h3>{lo}</h3>

          <div className="subtopic-actions">
            <button
              className="study-btn"
              onClick={() => onSelectSubtopic(lo)}
            >
              📖 Study Content
            </button>

            <button
              className="test-btn"
              onClick={() => onDirectTest(lo)}
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