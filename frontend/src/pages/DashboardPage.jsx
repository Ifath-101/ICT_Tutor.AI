import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { PageHeader } from "../components/PageHeader";
import "./DashboardPage.css";

function labelKey(p) {
  return `${p.lesson_id}:${p.lo_id}`;
}

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

  return (
    <div className="dashboard">
      <PageHeader
        title="Your dashboard"
        subtitle="Mastery and practice stats are saved per account. Use this view to see where you are improving and what to study next."
      />

      {loading && <p className="dashboard-loading">Loading your data…</p>}
      {error && <p className="dashboard-error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="dashboard-summary">
            <div className="dashboard-stat">
              <span className="dashboard-stat__value">
                {stats.totalAttempts}
              </span>
              <span className="dashboard-stat__label">Total attempts</span>
            </div>
            <div className="dashboard-stat">
              <span className="dashboard-stat__value">
                {(stats.avgMastery * 100).toFixed(0)}%
              </span>
              <span className="dashboard-stat__label">Avg. mastery</span>
            </div>
            <div className="dashboard-stat">
              <span className="dashboard-stat__value">
                {stats.topicsTracked}
              </span>
              <span className="dashboard-stat__label">Objectives tracked</span>
            </div>
          </div>

          {stats.weakest && stats.weakest.mastery < 0.85 && (
            <div className="dashboard-insight dashboard-insight--focus">
              <h2 className="dashboard-insight__title">Focus next</h2>
              <p>
                Your adaptive sessions will prioritize weaker objectives. Right
                now,{" "}
                <strong>
                  {lessonTitles[stats.weakest.lesson_id] ||
                    stats.weakest.lesson_id}{" "}
                  · {stats.weakest.lo_id}
                </strong>{" "}
                has the lowest mastery (
                {(stats.weakest.mastery * 100).toFixed(0)}%). Review it under{" "}
                <strong>Learn</strong> or practice in <strong>Assessments</strong>
                .
              </p>
            </div>
          )}

          {stats.strongest && stats.strongest.mastery >= 0.5 && (
            <div className="dashboard-insight dashboard-insight--positive">
              <h2 className="dashboard-insight__title">Strong area</h2>
              <p>
                <strong>
                  {lessonTitles[stats.strongest.lesson_id] ||
                    stats.strongest.lesson_id}{" "}
                  · {stats.strongest.lo_id}
                </strong>{" "}
                is among your highest mastery at{" "}
                {(stats.strongest.mastery * 100).toFixed(0)}% — keep reinforcing
                with mixed practice.
              </p>
            </div>
          )}

          <h2 className="dashboard-section-heading">Performance by objective</h2>
          {progress.length === 0 ? (
            <p className="dashboard-empty">
              No attempts yet. Complete an assessment to see per-topic mastery
              and improvement here.
            </p>
          ) : (
            <ul className="dashboard-rows">
              {progress
                .slice()
                .sort((a, b) => a.mastery - b.mastery)
                .map((p) => {
                  const pct = Math.round(p.mastery * 100);
                  const objLabel = loLabels[labelKey(p)] ?? p.lo_id;
                  const accuracy =
                    p.attempts > 0
                      ? Math.round((p.correct / p.attempts) * 100)
                      : 0;
                  const lessonTitle =
                    lessonTitles[p.lesson_id] || p.lesson_id;
                  return (
                    <li
                      key={`${p.lesson_id}-${p.lo_id}`}
                      className="dashboard-row"
                    >
                      <p className="dashboard-row__lesson">{lessonTitle}</p>
                      <div className="dashboard-row__head">
                        <span className="dashboard-row__id">{p.lo_id}</span>
                        <span className="dashboard-row__pct">{pct}%</span>
                      </div>
                      <p className="dashboard-row__objective">{objLabel}</p>
                      <div
                        className="dashboard-row__bar"
                        role="presentation"
                      >
                        <span
                          className="dashboard-row__fill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="dashboard-row__meta">
                        <span>
                          Attempts: <strong>{p.attempts}</strong>
                        </span>
                        <span>
                          Scores ≥ threshold: <strong>{p.correct}</strong>
                        </span>
                        <span>
                          Session accuracy: <strong>{accuracy}%</strong>
                        </span>
                      </div>
                    </li>
                  );
                })}
            </ul>
          )}

          <p className="dashboard-footnote">
            Mastery uses a reinforcement-style update from each graded answer
            (weighted with your history). It is not the same as a single exam
            score—use it to track how the system estimates your understanding
            over time.
          </p>
        </>
      )}
    </div>
  );
}

export default DashboardPage;
