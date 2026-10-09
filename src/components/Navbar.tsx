import { useState } from "react";
import { Menu, ShieldCheck, X } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { name: "Home", path: "/" },
  { name: "3D Explorer", path: "/explorer" },
  { name: "Assessment", path: "/assessment" },
  { name: "Research", path: "/research" },
  { name: "Global Map", path: "/map" },
  { name: "Dashboard", path: "/dashboard" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <NavLink to="/" className="brand" onClick={() => setMenuOpen(false)}>
        <span className="brand-icon">
          <ShieldCheck size={24} />
        </span>

        <span>
          <strong>MicroGuard</strong>
          <small>AI</small>
        </span>
      </NavLink>

      <nav className={menuOpen ? "nav-links nav-links-open" : "nav-links"}>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            {link.name}
          </NavLink>
        ))}

        <NavLink
          to="/assessment"
          className="nav-assessment-button"
          onClick={() => setMenuOpen(false)}
        >
          Check My Exposure
        </NavLink>
      </nav>

      <button
        className="menu-button"
        type="button"
        aria-label="Toggle navigation menu"
        onClick={() => setMenuOpen((current) => !current)}
      >
        {menuOpen ? <X size={25} /> : <Menu size={25} />}
      </button>
    </header>
  );
}

export default Navbar;