import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { api } from "../api/client";
import "./ContentView.css";

const markdownComponents = {
  h1: ({ children }) => <h1 className="study-md-h1">{children}</h1>,
  h2: ({ children }) => <h2 className="study-md-h2">{children}</h2>,
  h3: ({ children }) => <h3 className="study-md-h3">{children}</h3>,
  h4: ({ children }) => <h4 className="study-md-h4">{children}</h4>,
  p: ({ children }) => <p className="study-md-p">{children}</p>,
  ul: ({ children }) => <ul className="study-md-ul">{children}</ul>,
  ol: ({ children }) => <ol className="study-md-ol">{children}</ol>,
  li: ({ children }) => <li className="study-md-li">{children}</li>,
  strong: ({ children }) => <strong className="study-md-strong">{children}</strong>,
  em: ({ children }) => <em className="study-md-em">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="study-md-quote">{children}</blockquote>
  ),
  hr: () => <hr className="study-md-hr" />,
  a: ({ href, children }) => (
    <a className="study-md-a" href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  pre: ({ children }) => <pre className="study-md-pre">{children}</pre>,
  code: ({ className, children, ...props }) => {
    const isFence = Boolean(className?.includes("language-"));
    return (
      <code
        className={
          isFence
            ? `study-md-code-fence ${className || ""}`
            : "study-md-code-inline"
        }
        {...props}
      >
        {children}
      </code>
    );
  },
};

function ContentView({ lesson, subtopic, onStartTest }) {
  const [content, setContent] = useState("");
  const [meta, setMeta] = useState({
    lesson_title: "",
    learning_objective: "",
    learning_objective_id: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    api
      .get(`/lesson/${lesson}/content/${subtopic}`)
      .then((res) => {
        setContent(res.data.content ?? "");
        setMeta({
          lesson_title: res.data.lesson_title ?? "",
          learning_objective: res.data.learning_objective ?? "",
          learning_objective_id: res.data.learning_objective_id ?? subtopic,
        });
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [lesson, subtopic]);

  return (
    <div className="content-shell">
      <header className="content-hero">
        <p className="content-eyebrow">{meta.lesson_title || "Lesson"}</p>
        <div className="content-hero__badge-row">
          <span className="content-lo-badge">{meta.learning_objective_id}</span>
        </div>
        <h1 className="content-hero__title">Study material</h1>
        <p className="content-hero__objective">{meta.learning_objective}</p>
      </header>

      <div className="content-panel">
        {loading && (
          <div className="content-loading">
            <div className="content-loading__spinner" aria-hidden />
            <p>Generating your lesson…</p>
          </div>
        )}

        {error && (
          <div className="content-error">
            Could not load this content. Check your connection and try again.
          </div>
        )}

        {!loading && !error && (
          <article className="study-body" aria-label="Lesson content">
            <ReactMarkdown components={markdownComponents}>
              {content}
            </ReactMarkdown>
          </article>
        )}

        {!loading && !error && (
          <footer className="content-footer">
            <p className="content-footer__hint">
              When you are comfortable with this objective, continue to the
              adaptive assessment for this lesson.
            </p>
            <button
              type="button"
              className="content-cta"
              onClick={onStartTest}
            >
              Start assessment
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}

export default ContentView;
