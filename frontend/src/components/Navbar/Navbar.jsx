import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.scss';

const NAV_LINKS = [
  { label: 'How It Works', scrollId: 'how-it-works' },
  { label: 'Support', route: '/support' },
];

export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const lastY = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();

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

  // Scroll to section — navigate home first if not already there
  const handleScrollLink = (e, scrollId) => {
    e.preventDefault();
    const doScroll = () => {
      const el = document.getElementById(scrollId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    if (location.pathname === '/') {
      doScroll();
    } else {
      navigate('/');
      // Wait for home page to mount then scroll
      setTimeout(doScroll, 100);
    }
  };

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
          {NAV_LINKS.map(({ label, scrollId, route }) => {
            const isActive = route
              ? location.pathname === route
              : activeHash === `#${scrollId}`;

            return (
              <li key={label}>
                {scrollId ? (
                  <a
                    href={`/#${scrollId}`}
                    className={`navbar-link${isActive ? ' active' : ''}`}
                    onClick={(e) => handleScrollLink(e, scrollId)}
                  >
                    <span className="navbar-link-inner">
                      <span className="navbar-link-top">{label}</span>
                      <span className="navbar-link-bottom">{label}</span>
                    </span>
                  </a>
                ) : (
                  <Link
                    to={route}
                    className={`navbar-link${isActive ? ' active' : ''}`}
                  >
                    <span className="navbar-link-inner">
                      <span className="navbar-link-top">{label}</span>
                      <span className="navbar-link-bottom">{label}</span>
                    </span>
                  </Link>
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
