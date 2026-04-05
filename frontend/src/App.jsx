import { useState } from "react";
import "./App.css";
import LessonList from "./components/LessonList";
import SubtopicList from "./components/SubtopicList";
import ContentView from "./components/ContentView";
import QuestionView from "./components/QuestionView";
import LoginForm from "./components/LoginForm";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, ready, logout } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [subtopic, setSubtopic] = useState(null);
  const [mode, setMode] = useState("lesson");

  const resetAll = () => {
    setLesson(null);
    setSubtopic(null);
    setMode("lesson");
  };

  if (!ready) {
    return (
      <div className="app-wrapper app-center">
        <p className="loading-inline">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app-wrapper app-center">
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="header-brand">
          <h1>ICT Tutor AI</h1>
          <span className="user-email">{user.email}</span>
        </div>
        <div className="header-actions">
          {lesson && (
            <button className="back-btn" onClick={resetAll}>
              ⬅ Back
            </button>
          )}
          <button className="logout-btn" type="button" onClick={logout}>
            Log out
          </button>
        </div>
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