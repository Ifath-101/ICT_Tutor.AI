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

  return (
    <div className="app-container">
      <h1 className="app-title">ICT Tutor AI</h1>

      {!lesson && <LessonList onSelectLesson={setLesson} />}

      {lesson && !subtopic && mode === "lesson" && (
        <SubtopicList
          lesson={lesson}
          onSelectSubtopic={(lo) => {
            setSubtopic(lo);
            setMode("content");
          }}
          onTestMode={() => setMode("test")}
        />
      )}

      {lesson && subtopic && mode === "content" && (
        <ContentView
          lesson={lesson}
          subtopic={subtopic}
          onCheckKnowledge={() => setMode("test")}
        />
      )}

      {lesson && mode === "test" && (
        <QuestionView lesson={lesson} />
      )}
    </div>
  );
}

export default App;