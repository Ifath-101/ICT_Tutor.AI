import { Navigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { PageHeader } from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";
import "./AuthPage.css";

function RegisterPage() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-page">
      <PageHeader
        title="Create account"
        subtitle="Register to store mastery and personalization across sessions."
      />
      <LoginForm variant="register" />
    </div>
  );
}

export default RegisterPage;
