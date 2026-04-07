import { Navigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { PageHeader } from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";
import "./AuthPage.css";

function LoginPage() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-page">
      <PageHeader
        title="Sign in"
        subtitle="Access your lessons, assessments, and saved progress."
      />
      <LoginForm variant="login" />
    </div>
  );
}

export default LoginPage;
