import { useState, useRef, useEffect } from 'react';
import { LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Traveller';
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : firstName[0]?.toUpperCase() || 'A';

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">PlannR</div>

      <div className="nav-right">
        <span className="nav-greeting">
          Hello, <span className="nav-greeting-name">{firstName}</span> 👋
        </span>

        <div className="nav-avatar-wrap" ref={dropRef}>
          <button
            className="nav-avatar"
            onClick={() => setDropOpen(p => !p)}
            aria-label="Account menu"
          >
            {initials}
            <ChevronDown size={11} className={`nav-avatar-chevron ${dropOpen ? 'open' : ''}`} />
          </button>

          {dropOpen && (
            <div className="nav-dropdown">
              <div className="nav-dropdown-header">
                <span className="nav-dropdown-name">{user?.name || firstName}</span>
                <span className="nav-dropdown-email">{user?.email}</span>
              </div>
              <div className="nav-dropdown-divider" />
              <button className="nav-dropdown-item danger" onClick={handleLogout}>
                <LogOut size={13} />
                Log out
              </button>
            </div>
          )}
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={11} />
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;