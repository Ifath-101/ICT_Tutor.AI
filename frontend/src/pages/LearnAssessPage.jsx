import { useParams } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import QuestionView from "../components/QuestionView";

function LearnAssessPage() {
  const { lessonId } = useParams();

  return (
    <div>
      <PageHeader
        title="Lesson assessment"
        subtitle="Practice for this lesson continues until you leave. Your progress updates your dashboard."
        backTo={`/learn/${lessonId}`}
        backLabel="← Back to topics"
      />
      <QuestionView />
    </div>
  );
}

export default LearnAssessPage;
