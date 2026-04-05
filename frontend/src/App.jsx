import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginForm from "./components/LoginForm";
import MainLayout from "./components/MainLayout";
import { useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import LearnLessonSelectPage from "./pages/LearnLessonSelectPage";
import LearnSubtopicsPage from "./pages/LearnSubtopicsPage";
import LearnStudyPage from "./pages/LearnStudyPage";
import LearnAssessPage from "./pages/LearnAssessPage";
import AssessmentLessonSelectPage from "./pages/AssessmentLessonSelectPage";
import AssessmentRunPage from "./pages/AssessmentRunPage";

function App() {
  const { user, ready } = useAuth();

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
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/learn" element={<LearnLessonSelectPage />} />
          <Route path="/learn/:lessonId" element={<LearnSubtopicsPage />} />
          <Route
            path="/learn/:lessonId/study/:loId"
            element={<LearnStudyPage />}
          />
          <Route path="/learn/:lessonId/assess" element={<LearnAssessPage />} />
          <Route
            path="/assessments"
            element={<AssessmentLessonSelectPage />}
          />
          <Route
            path="/assessments/:lessonId"
            element={<AssessmentRunPage />}
          />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
