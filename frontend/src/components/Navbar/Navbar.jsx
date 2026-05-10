import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'How It Works', href: '#how-it-works', route: null },
  { label: 'Trips', href: '#trips', route: null },
  { label: 'Support', href: null, route: '/support' },
];

function ArrowIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const lastY = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Hide on scroll-down, show on scroll-up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastY.current && y > 80);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track active hash for link highlight
  useEffect(() => {
    const onHashChange = () => setActiveHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    setActiveHash(window.location.hash);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [location]);

  return (
    <nav
      className={`navbar-wrapper${hidden ? ' navbar-wrapper--hidden' : ''}`}
      aria-label="Main navigation"
    >
      <div className="navbar">

        {/* Logo */}
        <a href="/" className="navbar-logo" aria-label="TravelLoop home">
          <span className="navbar-logo-text">PlannR</span>
        </a>

        {/* Nav links */}
        <ul className="navbar-links" role="list">
          {NAV_LINKS.map(({ label, href, route }) => {
            const isActive = route
              ? location.pathname === route
              : activeHash === href;
            return (
              <li key={label}>
                {route ? (
                  <Link
                    to={route}
                    className={`navbar-link${isActive ? ' active' : ''}`}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <span className="navbar-link-inner">
                      <span className="navbar-link-top">{label}</span>
                      <span className="navbar-link-bottom">{label}</span>
                    </span>
                  </Link>
                ) : (
                  <a
                    href={href}
                    className={`navbar-link${isActive ? ' active' : ''}`}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    {isActive ? (
                      label
                    ) : (
                      <span className="navbar-link-inner">
                        <span className="navbar-link-top">{label}</span>
                        <span className="navbar-link-bottom">{label}</span>
                      </span>
                    )}
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <Link to="/login" className="navbar-cta-link">
          <button className="navbar-cta" type="button">
            <svg className="navbar-cta-icon" viewBox="0 0 24 24" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
            Get Started
          </button>
        </Link>

      </div>
    </nav>
  );
}

export default Navbar;