import { Link, useNavigate, useParams } from "react-router-dom";
import ContentView from "../components/ContentView";

function LearnStudyPage() {
  const { lessonId, loId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="lesson-study-wrap">
      <nav className="study-nav-back" aria-label="Lesson navigation">
        <Link to={`/learn/${lessonId}`} className="study-nav-back__link">
          ← Back to learning objectives
        </Link>
      </nav>
      <ContentView
        lesson={lessonId}
        subtopic={loId}
        onStartTest={() => navigate(`/learn/${lessonId}/assess`)}
      />
    </div>
  );
}

export default LearnStudyPage;
