import { Heart, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <ShieldCheck size={25} />
            <span>MicroGuard AI</span>
          </div>

          <p>
            Helping people understand everyday microplastic exposure through
            accessible research, interactive tools, and practical guidance.
          </p>
        </div>

        <div className="footer-column">
          <h3>Explore</h3>
          <Link to="/explorer">3D Explorer</Link>
          <Link to="/assessment">Exposure Assessment</Link>
          <Link to="/map">Global Research Map</Link>
        </div>

        <div className="footer-column">
          <h3>Resources</h3>
          <Link to="/research">Research Library</Link>
          <Link to="/dashboard">My Dashboard</Link>
          <a href="https://github.com" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 MicroGuard AI · Team NextGen Solutions</p>

        <p>
          Built with <Heart size={14} fill="currentColor" /> for HackBIOS 2026
        </p>
      </div>
    </footer>
  );
}

export default Footer;