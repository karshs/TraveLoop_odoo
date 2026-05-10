import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.scss';

const NAV_LINKS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Trips',     href: '#trips'      },
  { label: 'Support',   href: '#support'    },
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
  const [hidden, setHidden]       = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const lastY    = useRef(0);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastY.current && y > 80);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
        <a href="/" className="navbar-logo" aria-label="PlannR home">
          <span className="navbar-logo-text">PlannR</span>
        </a>

        {/* Nav links */}
        <ul className="navbar-links" role="list">
          {NAV_LINKS.map(({ label, href }) => {
            const isRoute  = href.startsWith('/');
            const isActive = isRoute
              ? location.pathname === href
              : activeHash === href;

            return (
              <li key={label}>
                {isRoute ? (
                  <Link
                    to={href}
                    className={`navbar-link${isActive ? ' active' : ''}`}
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
                    <span className="navbar-link-inner">
                      <span className="navbar-link-top">{label}</span>
                      <span className="navbar-link-bottom">{label}</span>
                    </span>
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
            Start Planning
          </button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
