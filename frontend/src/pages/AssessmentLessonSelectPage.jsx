import { useNavigate } from "react-router-dom";
import LessonList from "../components/LessonList";
import { PageHeader } from "../components/PageHeader";

function AssessmentLessonSelectPage() {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        title="Assessments"
        subtitle="Practice without opening study material first. Questions target weaker objectives automatically based on your saved progress."
        backTo="/"
      />
      <LessonList
        onSelectLesson={(id) => {
          navigate(`/assessments/${id}`);
        }}
      />
    </div>
  );
}

export default AssessmentLessonSelectPage;
