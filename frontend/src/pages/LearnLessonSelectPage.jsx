import { useNavigate } from "react-router-dom";
import LessonList from "../components/LessonList";
import { PageHeader } from "../components/PageHeader";

function LearnLessonSelectPage() {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        title="Learn"
        subtitle="Choose a lesson, open a learning objective, read AI-generated content, then start the adaptive assessment when you are ready."
      />
      <LessonList
        onSelectLesson={(id) => {
          navigate(`/learn/${id}`);
        }}
      />
    </div>
  );
}

export default LearnLessonSelectPage;
