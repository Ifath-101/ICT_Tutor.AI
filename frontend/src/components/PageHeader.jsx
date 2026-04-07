import { Link } from "react-router-dom";
import "./PageHeader.css";

export function PageHeader({ title, subtitle, backTo, backLabel = "← Back" }) {
  return (
    <header className="page-header">
      {backTo && (
        <Link to={backTo} className="page-back">
          {backLabel}
        </Link>
      )}
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
    </header>
  );
}
