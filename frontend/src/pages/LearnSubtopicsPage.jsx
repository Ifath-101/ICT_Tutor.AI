import { useNavigate, useParams } from "react-router-dom";
import SubtopicList from "../components/SubtopicList";
import { PageHeader } from "../components/PageHeader";

function LearnSubtopicsPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        title="Learning objectives"
        subtitle="Study each subtopic in order, or jump ahead—content is tailored for the objective you pick."
        backTo="/learn"
      />
      <SubtopicList
        lesson={lessonId}
        mode="learn"
        onSelectSubtopic={(lo) => {
          navigate(`/learn/${lessonId}/study/${lo}`);
        }}
      />
    </div>
  );
}

export default LearnSubtopicsPage;
