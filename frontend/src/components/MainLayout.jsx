import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ChatBot from "./ChatBot";
import "./MainLayout.css";

function MainLayout() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const navClass = ({ isActive }) =>
    `nav-link${isActive ? " nav-link--active" : ""}`;

  return (
    <div className="shell">
      <header className="shell-header">
        <div
          className={`shell-header__inner${user ? "" : " shell-header__inner--guest"}`}
        >
          <NavLink to="/" className="shell-brand" onClick={closeMenu}>
            <span className="shell-brand__mark" aria-hidden />
            <span className="shell-brand__text">
              <span className="shell-brand__title">ICT Tutor AI</span>
              <span className="shell-brand__tag">Personalized learning</span>
            </span>
          </NavLink>

          {user && (
            <nav
              id="primary-nav"
              className={`shell-nav${menuOpen ? " shell-nav--open" : ""}`}
            >
              <NavLink to="/learn" className={navClass} onClick={closeMenu}>
                Learn
              </NavLink>
              <NavLink
                to="/assessments"
                className={navClass}
                onClick={closeMenu}
              >
                Assessments
              </NavLink>
              <NavLink
                to="/dashboard"
                className={navClass}
                onClick={closeMenu}
              >
                Dashboard
              </NavLink>
            </nav>
          )}

          {user && (
            <div className="shell-user shell-user--desktop">
              <span className="shell-user__email" title={user.email}>
                {user.name || user.email}
              </span>
              <button type="button" className="shell-logout" onClick={logout}>
                Log out
              </button>
            </div>
          )}

          {!user && (
            <div className="shell-auth shell-auth--desktop">
              <NavLink to="/login" className="shell-auth-link">
                Log in
              </NavLink>
              <NavLink to="/register" className="shell-auth-btn">
                Register
              </NavLink>
            </div>
          )}

          <button
            type="button"
            className={`nav-toggle${user ? "" : " nav-toggle--guest-only"}`}
            aria-expanded={menuOpen}
            aria-controls={user ? "primary-nav" : "guest-auth-panel"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="nav-toggle__bar" />
            <span className="nav-toggle__bar" />
            <span className="nav-toggle__bar" />
            <span className="visually-hidden">Menu</span>
          </button>

          {user && menuOpen && (
            <div className="shell-user shell-user--mobile">
              <span className="shell-user__email">{user.name || user.email}</span>
              <button
                type="button"
                className="shell-logout"
                onClick={() => {
                  closeMenu();
                  logout();
                }}
              >
                Log out
              </button>
            </div>
          )}

          {!user && (
            <div
              id="guest-auth-panel"
              className={`shell-guest-panel${menuOpen ? " shell-guest-panel--open" : ""}`}
            >
              <NavLink
                to="/login"
                className="shell-guest-panel__link"
                onClick={closeMenu}
              >
                Log in
              </NavLink>
              <NavLink
                to="/register"
                className="shell-guest-panel__btn"
                onClick={closeMenu}
              >
                Register
              </NavLink>
            </div>
          )}
        </div>
      </header>

      <main className="shell-main">
        <Outlet />
      </main>

      <footer className="shell-footer">
        <p>ICT Tutor AI — adaptive practice aligned to your curriculum.</p>
      </footer>
      
      {user && <ChatBot />}
    </div>
  );
}

export default MainLayout;
