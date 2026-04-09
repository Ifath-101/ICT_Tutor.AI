import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "./HomePage.css";

function HomePage() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [lessonsError, setLessonsError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/lessons")
      .then((res) => {
        if (!cancelled) setLessons(res.data);
      })
      .catch(() => {
        if (!cancelled) setLessonsError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="home">
      <section className="home-hero">
        <p className="home-eyebrow">A/L ICT · Adaptive tutoring</p>
        <h1 className="home-hero__title">
          Learn ICT with guidance that adapts to{" "}
          <span className="home-hero__accent">you</span>
        </h1>
        <p className="home-hero__lead">
          ICT Tutor AI explains concepts in clear language, asks questions at
          the right difficulty, and remembers your progress so every session
          builds on the last.
        </p>
        <div className="home-hero__actions">
          {user ? (
            <>
              <Link to="/learn" className="home-btn home-btn--primary">
                Start learning
              </Link>
              <Link to="/assessments" className="home-btn home-btn--secondary">
                Practice assessment
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" className="home-btn home-btn--primary">
                Create free account
              </Link>
              <Link to="/login" className="home-btn home-btn--secondary">
                Log in
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="home-catalog" aria-labelledby="catalog-heading">
        <h2 id="catalog-heading" className="home-section-title">
          Available lessons
        </h2>
        {lessonsError && (
          <p className="home-catalog__note">
            Lesson list is unavailable. Start the API server to see topics
            here.
          </p>
        )}
        {!lessonsError && lessons.length > 0 && (
          <ul className="home-catalog__list">
            {lessons.map((l) => (
              <li key={l.lesson_id} className="home-catalog__item">
                <span className="home-catalog__title">{l.title}</span>
                {l.grade_level && (
                  <span className="home-catalog__meta">{l.grade_level}</span>
                )}
              </li>
            ))}
          </ul>
        )}
        {!user && !lessonsError && lessons.length > 0 && (
          <p className="home-catalog__cta">
            <Link to="/login" className="home-catalog__link">
              Log in
            </Link>{" "}
            or{" "}
            <Link to="/register" className="home-catalog__link">
              register
            </Link>{" "}
            to study and track progress.
          </p>
        )}
      </section>

      <section className="home-features" aria-labelledby="features-heading">
        <h2 id="features-heading" className="home-section-title">
          How we support your studies
        </h2>
        <ul className="home-feature-grid">
          <li className="home-feature">
            <div className="home-feature__icon" aria-hidden>
              📚
            </div>
            <h3 className="home-feature__title">Structured lessons</h3>
            <p className="home-feature__text">
              Follow learning objectives with personalized explanations, worked
              examples, and scope aligned to core ICT topics.
            </p>
          </li>
          <li className="home-feature">
            <div className="home-feature__icon" aria-hidden>
              🎯
            </div>
            <h3 className="home-feature__title">Personalized practice</h3>
            <p className="home-feature__text">
              Questions target your weakest objectives first. Difficulty adjusts
              as your mastery grows—like a tutor who knows what to review next.
            </p>
          </li>
          <li className="home-feature">
            <div className="home-feature__icon" aria-hidden>
              📊
            </div>
            <h3 className="home-feature__title">Progress you can see</h3>
            <p className="home-feature__text">
              Your dashboard summarizes performance per topic, attempts, and
              mastery so you can track improvement over time.
            </p>
          </li>
        </ul>
      </section>

      <section className="home-steps" aria-labelledby="steps-heading">
        <h2 id="steps-heading" className="home-section-title">
          Typical workflow
        </h2>
        <ol className="home-steps__list">
          <li>
            <strong>Learn</strong> — Pick a lesson, study a subtopic, then move
            into assessment when you are ready.
          </li>
          <li>
            <strong>Assessments</strong> — Jump straight into adaptive questions
            when you want a quick check or exam-style practice.
          </li>
          <li>
            <strong>Dashboard</strong> — Review mastery and focus areas before
            your next session.
          </li>
        </ol>
      </section>
    </div>
  );
}

export default HomePage;
