import { PageHeader } from "../components/PageHeader";
import QuestionView from "../components/QuestionView";

function AssessmentRunPage() {
  return (
    <div>
      <PageHeader
        title="Adaptive assessment"
        subtitle="Answer in your own words. You will get feedback and an updated mastery estimate for this lesson."
        backTo="/assessments"
      />
      <QuestionView />
    </div>
  );
}

export default AssessmentRunPage;
