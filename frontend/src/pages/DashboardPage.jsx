import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { PageHeader } from "../components/PageHeader";
import "./DashboardPage.css";

function labelKey(p) {
  return `${p.lesson_id}:${p.lo_id}`;
}

const CircularProgress = ({ percentage, color = "#6366f1", size = 80, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="circular-progress">
      <circle
        stroke="#e2e8f0"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size/2}
        cy={size/2}
      />
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${circumference} ${circumference}`}
        style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 1.5s ease-out' }}
        r={radius}
        cx={size/2}
        cy={size/2}
        transform={`rotate(-90 ${size/2} ${size/2})`}
      />
      <text x="50%" y="50%" dy=".3em" textAnchor="middle" fontSize={size * 0.25} fontWeight="800" fill="#1e293b">
        {Math.round(percentage)}%
      </text>
    </svg>
  );
};

function DashboardPage() {
  const [progress, setProgress] = useState([]);
  const [loLabels, setLoLabels] = useState({});
  const [lessonTitles, setLessonTitles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const progRes = await api.get("/my-progress");
        if (cancelled) return;
        const prog = progRes.data;
        setProgress(prog);

        const lessonIds = [...new Set(prog.map((p) => p.lesson_id))];
        const labels = {};
        const titles = {};

        await Promise.all(
          lessonIds.map(async (lid) => {
            try {
              const bpRes = await api.get(`/lesson/${lid}/blueprint`);
              const data = bpRes.data;
              titles[lid] = data.title || lid;
              const los = data.learning_objectives || {};
              Object.entries(los).forEach(([loId, v]) => {
                labels[`${lid}:${loId}`] = v.objective ?? loId;
              });
            } catch {
              titles[lid] = lid;
            }
          })
        );

        if (!cancelled) {
          setLoLabels(labels);
          setLessonTitles(titles);
        }
      } catch {
        if (!cancelled) {
          setError("Could not load your progress. Try again later.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    if (!progress.length) {
      return {
        totalAttempts: 0,
        avgMastery: 0,
        topicsTracked: 0,
        strongest: null,
        weakest: null,
      };
    }
    const totalAttempts = progress.reduce((s, p) => s + p.attempts, 0);
    const avgMastery =
      progress.reduce((s, p) => s + p.mastery, 0) / progress.length;
    const sorted = [...progress].sort((a, b) => b.mastery - a.mastery);
    return {
      totalAttempts,
      avgMastery,
      topicsTracked: progress.length,
      strongest: sorted[0] ?? null,
      weakest: sorted[sorted.length - 1] ?? null,
    };
  }, [progress]);

  const groupedProgress = useMemo(() => {
    return progress.reduce((acc, p) => {
      const title = lessonTitles[p.lesson_id] || p.lesson_id;
      if (!acc[title]) {
        acc[title] = [];
      }
      acc[title].push(p);
      return acc;
    }, {});
  }, [progress, lessonTitles]);

  return (
    <div className="dashboard">
      <PageHeader
        title="Your Dashboard"
        subtitle="Track your mastery across all lessons. See where you excel and what needs more focus."
      />

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner" aria-hidden="true" />
        </div>
      )}
      {error && <p className="dashboard-error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="dashboard-summary-cards">
            <div className="dashboard-card stat-card">
              <div className="stat-card__content">
                <span className="stat-card__label">Average Mastery</span>
                <p className="stat-card__subtext">Across all topics studied</p>
              </div>
              <CircularProgress percentage={stats.avgMastery * 100} size={84} color="#4f46e5" strokeWidth={8} />
            </div>
            
            <div className="dashboard-card stat-card">
              <div className="stat-card__content">
                <span className="stat-card__label">Objectives Tracked</span>
                <span className="stat-card__value">{stats.topicsTracked}</span>
                <p className="stat-card__subtext">Learning goals initiated</p>
              </div>
              <div className="stat-card__icon bg-indigo-100 text-indigo-600">📚</div>
            </div>

            <div className="dashboard-card stat-card">
              <div className="stat-card__content">
                <span className="stat-card__label">Total Attempts</span>
                <span className="stat-card__value">{stats.totalAttempts}</span>
                <p className="stat-card__subtext">Questions answered</p>
              </div>
              <div className="stat-card__icon bg-emerald-100 text-emerald-600">💯</div>
            </div>
          </div>

          <div className="dashboard-insights-grid">
            {stats.weakest && stats.weakest.mastery < 0.85 && (
              <div className="dashboard-card insight-card insight-card--focus">
                <div className="insight-card__header">
                  <span className="insight-card__icon">📈</span>
                  <h2 className="insight-card__title">Focus Next</h2>
                </div>
                <div className="insight-card__body">
                  <h3 className="insight-card__topic">
                    {lessonTitles[stats.weakest.lesson_id] || stats.weakest.lesson_id} · {stats.weakest.lo_id}
                  </h3>
                  <p className="insight-card__desc">
                    Current mastery is at {(stats.weakest.mastery * 100).toFixed(0)}%. 
                    Jumping into a quick assessment session will help reinforce this.
                  </p>
                  <Link to={`/learn/${stats.weakest.lesson_id}`} className="insight-card__cta insight-card__cta--focus">
                    Review Lesson
                  </Link>
                </div>
              </div>
            )}

            {stats.strongest && stats.strongest.mastery >= 0.5 && (
              <div className="dashboard-card insight-card insight-card--strong">
                <div className="insight-card__header">
                  <span className="insight-card__icon">⭐</span>
                  <h2 className="insight-card__title">Strongest Area</h2>
                </div>
                <div className="insight-card__body">
                  <h3 className="insight-card__topic">
                    {lessonTitles[stats.strongest.lesson_id] || stats.strongest.lesson_id} · {stats.strongest.lo_id}
                  </h3>
                  <p className="insight-card__desc">
                    You're doing great here with {(stats.strongest.mastery * 100).toFixed(0)}% mastery. 
                    Keep it up!
                  </p>
                  <Link to={`/assessments/${stats.strongest.lesson_id}`} className="insight-card__cta insight-card__cta--strong">
                    Test Yourself
                  </Link>
                </div>
              </div>
            )}
          </div>

          <h2 className="dashboard-section-heading">Detailed Progress by Lesson</h2>
          {progress.length === 0 ? (
            <div className="dashboard-empty-state">
              <div className="empty-state-icon">🚀</div>
              <h3>No progress yet</h3>
              <p>Complete an assessment to see your mastery breakdown here.</p>
              <Link to="/learn" className="empty-state-btn">Start Learning</Link>
            </div>
          ) : (
            <div className="lesson-groups">
              {Object.entries(groupedProgress).map(([lessonTitle, items]) => (
                <div key={lessonTitle} className="lesson-group">
                  <h3 className="lesson-group__title">{lessonTitle}</h3>
                  <div className="lesson-group__grid">
                    {items
                      .sort((a, b) => b.mastery - a.mastery)
                      .map((p) => {
                        const pct = Math.round(p.mastery * 100);
                        const objLabel = loLabels[labelKey(p)] ?? p.lo_id;
                        const accuracy = p.attempts > 0 ? Math.round((p.correct / p.attempts) * 100) : 0;
                        
                        return (
                          <div key={`${p.lesson_id}-${p.lo_id}`} className="objective-card">
                            <div className="objective-card__header">
                              <span className="objective-card__id">{p.lo_id}</span>
                              <span className="objective-card__pct">{pct}%</span>
                            </div>
                            <p className="objective-card__name">{objLabel}</p>
                            
                            <div className="objective-card__progress-container">
                              <div className="objective-card__progress-bg">
                                <div 
                                  className={`objective-card__progress-fill ${pct >= 85 ? 'fill-excellent' : pct >= 50 ? 'fill-good' : 'fill-needs-work'}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                            
                            <div className="objective-card__stats">
                              <div className="obj-stat">
                                <span className="obj-stat__lbl">Questions</span>
                                <span className="obj-stat__val">{p.attempts}</span>
                              </div>
                              <div className="obj-stat">
                                <span className="obj-stat__lbl">Accuracy</span>
                                <span className="obj-stat__val">{accuracy}%</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="dashboard-footer-note">
            <p>
              <strong>How mastery works:</strong> Mastery uses a reinforcement-style update from each graded answer, weighted by your history. Use it to track how the system estimates your understanding over time.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;
