import { useState } from "react";
import "./App.css";
import LessonList from "./components/LessonList";
import SubtopicList from "./components/SubtopicList";
import ContentView from "./components/ContentView";
import QuestionView from "./components/QuestionView";

function App() {
  const [lesson, setLesson] = useState(null);
  const [subtopic, setSubtopic] = useState(null);
  const [mode, setMode] = useState("lesson");

  const resetAll = () => {
    setLesson(null);
    setSubtopic(null);
    setMode("lesson");
  };

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1>ICT Tutor AI</h1>
        {lesson && (
          <button className="back-btn" onClick={resetAll}>
            ⬅ Back
          </button>
        )}
      </header>

      <main className="app-content">
        {!lesson && (
          <LessonList
            onSelectLesson={(l) => {
              setLesson(l);
              setMode("subtopics");
            }}
          />
        )}

        {lesson && mode === "subtopics" && (
          <SubtopicList
            lesson={lesson}
            onSelectSubtopic={(lo) => {
              setSubtopic(lo);
              setMode("content");
            }}
            onDirectTest={(lo) => {
              setSubtopic(lo);
              setMode("test");
            }}
          />
        )}

        {lesson && subtopic && mode === "content" && (
          <ContentView
            lesson={lesson}
            subtopic={subtopic}
            onStartTest={() => setMode("test")}
          />
        )}

        {lesson && subtopic && mode === "test" && (
          <QuestionView lesson={lesson} />
        )}
      </main>
    </div>
  );
}

export default App;