import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MapPin, CalendarDays, Wallet, MessageSquare } from 'lucide-react';
import './Shared.css';
import './Dashboard.css';

const STATS = [
  { label: 'Total Trips',   value: '12',    badge: '↑ 3 this year', type: 'up' },
  { label: 'Countries',     value: '8',     badge: '↑ 2 new',       type: 'up' },
  { label: 'Total Spent',   value: '$9.4k', badge: '↓ Budget –12%', type: 'down' },
  { label: 'Next Trip',     value: 'Bali 🌴', sub: 'in 18 days' },
];

const TRIPS = [
  { emoji: '🌴', dest: 'Bali, Indonesia',  dates: 'Jun 28 – Jul 8 · 10 nights',  tag: 'upcoming',  progress: 72 },
  { emoji: '🗼', dest: 'Paris, France',    dates: 'Sep 10 – Sep 17 · 7 nights',  tag: 'planning',  progress: 30 },
  { emoji: '🏔️', dest: 'Kyoto, Japan',    dates: 'Nov 1 – Nov 12 · 11 nights',  tag: 'planning',  progress: 10 },
];

const QUICK = [
  { icon: MapPin,        label: 'New Trip',    to: '/trips'     },
  { icon: CalendarDays,  label: 'Plan Day',    to: '/itinerary' },
  { icon: Wallet,        label: 'Add Expense', to: '/budget'    },
  { icon: MessageSquare, label: 'Community',   to: '/community' },
];

function Dashboard() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const firstName = user?.name?.split(' ')[0] || 'Traveller';

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Dashboard</div>
        <div className="page-sub">Welcome back, {firstName}. Here's your travel overview.</div>
      </div>

      {/* Stat cards */}
      <div className="card-grid grid-4 mb-lg">
        {STATS.map(s => (
          <div key={s.label} className="card stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={s.value.length > 5 ? { fontSize: '1.1rem' } : {}}>{s.value}</div>
            {s.badge && <div className={`stat-badge ${s.type}`}>{s.badge}</div>}
            {s.sub   && <div className="stat-sub">{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="quick-grid mb-lg">
        {QUICK.map(({ icon: Icon, label, to }) => (
          <button key={label} className="quick-btn" onClick={() => navigate(to)}>
            <Icon size={20} strokeWidth={1.8} />
            {label}
          </button>
        ))}
      </div>

      {/* Upcoming trips */}
      <div className="section-row">
        <span className="section-title">Upcoming Trips</span>
        <button className="see-all-btn" onClick={() => navigate('/trips')}>See all →</button>
      </div>
      <div className="card-grid grid-3">
        {TRIPS.map(t => (
          <div key={t.dest} className="card trip-card" onClick={() => navigate('/trips')}>
            <div className="trip-img">{t.emoji}</div>
            <div>
              <div className="trip-dest">{t.dest}</div>
              <div className="trip-dates">{t.dates}</div>
            </div>
            <span className={`trip-tag ${t.tag}`}>{t.tag}</span>
            <div>
              <div className="stat-label" style={{ fontSize: 9, marginBottom: 3 }}>PLANNING PROGRESS</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${t.progress}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;