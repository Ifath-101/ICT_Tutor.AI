import "./SubtopicList.css";

function SubtopicList({ lesson, onSelectSubtopic, onTestMode }) {
  return (
    <div className="subtopic-card">
      <h2 className="subtopic-title">Choose a Subtopic</h2>

      <div className="subtopic-buttons">
        <button
          className="subtopic-btn"
          onClick={() => onSelectSubtopic("LO1")}
        >
          LO1
        </button>

        <button
          className="subtopic-btn"
          onClick={() => onSelectSubtopic("LO2")}
        >
          LO2
        </button>
      </div>

      <div className="divider"></div>

      <button className="test-btn" onClick={onTestMode}>
        🚀 Take Adaptive Test Directly
      </button>
    </div>
  );
}

export default SubtopicList;