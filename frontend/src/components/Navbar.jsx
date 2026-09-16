import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar" role="banner">
      <nav className="navbar__inner container" aria-label="Main navigation">
        <Link to="/" className="navbar__brand" onClick={() => setMenuOpen(false)}>
          Customer Churn Predictor
        </Link>

        <button
          className={`navbar__toggle ${menuOpen ? 'navbar__toggle--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="navbar-menu"
          aria-label="Toggle navigation menu"
        >
          <span className="navbar__toggle-bar" />
          <span className="navbar__toggle-bar" />
          <span className="navbar__toggle-bar" />
        </button>

        <ul
          id="navbar-menu"
          className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}
          role="menubar"
        >
          <li role="none">
            <NavLink
              to="/"
              className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
              role="menuitem"
              onClick={() => setMenuOpen(false)}
            >
              Predictor
            </NavLink>
          </li>
          <li role="none">
            <NavLink
              to="/about"
              className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
              role="menuitem"
              onClick={() => setMenuOpen(false)}
            >
              About
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
