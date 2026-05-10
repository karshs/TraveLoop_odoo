import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Map, Calendar, Compass } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="dash-container">
      <div className="dash-glow"></div>
      
      <nav className="dash-nav">
        <div className="dash-brand">PlannR</div>
        <div className="dash-user">
          <span className="dash-username">Hello, {user?.firstName || 'Explorer'}</span>
          <button onClick={handleLogout} className="dash-logout-btn">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </nav>

      <main className="dash-main">
        <header className="dash-header">
          <h1 className="dash-title">Your Dashboard</h1>
          <p className="dash-subtitle">Where do you want to go next?</p>
        </header>

        <div className="dash-grid">
          <div className="dash-card">
            <div className="dash-card-icon"><Map size={24} /></div>
            <h2>My Trips</h2>
            <p>View and manage your upcoming and past adventures.</p>
            <button className="dash-card-btn">View Trips</button>
          </div>
          
          <div className="dash-card">
            <div className="dash-card-icon"><Calendar size={24} /></div>
            <h2>Plan a New Trip</h2>
            <p>Start a blank canvas and organize a brand new journey.</p>
            <button className="dash-card-btn primary">Create Trip</button>
          </div>

          <div className="dash-card">
            <div className="dash-card-icon"><Compass size={24} /></div>
            <h2>Discover</h2>
            <p>Find inspiration, popular cities, and top activities.</p>
            <button className="dash-card-btn">Explore</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
