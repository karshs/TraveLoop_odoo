import { useState } from 'react';
import { Plus } from 'lucide-react';
import '../Shared.css';
import './Trips.css';

const ALL_TRIPS = [
  { emoji: '🌴', dest: 'Bali, Indonesia',    dates: 'Jun 28 – Jul 8 · 10 nights',   tag: 'upcoming',   progress: 72 },
  { emoji: '🗼', dest: 'Paris, France',       dates: 'Sep 10 – Sep 17 · 7 nights',   tag: 'planning',   progress: 30 },
  { emoji: '🏔️', dest: 'Kyoto, Japan',       dates: 'Nov 1 – Nov 12 · 11 nights',   tag: 'planning',   progress: 10 },
  { emoji: '🏖️', dest: 'Santorini, Greece',  dates: 'Mar 2 – Mar 9 · 7 nights',     tag: 'completed',  progress: 100 },
  { emoji: '🦁', dest: 'Nairobi, Kenya',      dates: 'Jan 5 – Jan 14 · 9 nights',    tag: 'completed',  progress: 100 },
];

const FILTERS = ['All', 'Upcoming', 'Planning', 'Completed'];

function Trips() {
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All'
    ? ALL_TRIPS
    : ALL_TRIPS.filter(t => t.tag === filter.toLowerCase());

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">My Trips</div>
        <div className="page-sub">All your adventures, past and future.</div>
      </div>

      <div className="toggle-group">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`toggle-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="card-grid grid-3">
        {filtered.map(t => (
          <div key={t.dest} className="card trip-card-full">
            <div className="trip-img-lg">{t.emoji}</div>
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

        {/* New trip card */}
        <button className="new-trip-card" onClick={() => alert('Create new trip!')}>
          <Plus size={28} strokeWidth={1.5} color="rgba(255,255,255,0.18)" />
          <span>New Trip</span>
        </button>
      </div>
    </div>
  );
}

export default Trips;