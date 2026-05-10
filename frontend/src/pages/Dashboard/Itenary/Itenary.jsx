import '../Shared.css';
import './Itenary.css';

const DAYS = [
  {
    label: 'Day 1 — Monday, Jun 28',
    items: [
      { time: '08:00 AM', title: 'Arrive at Ngurah Rai Airport',  note: 'Flight SQ948 · Terminal Int\'l' },
      { time: '11:00 AM', title: 'Check-in — Villa Seminyak',     note: 'Private pool villa · 3 nights' },
      { time: '01:30 PM', title: 'Lunch at Sarong Restaurant',    note: 'Reservation confirmed' },
      { time: '04:00 PM', title: 'Sunset at Tanah Lot Temple',    note: '30 min drive · Entry $5' },
    ],
  },
  {
    label: 'Day 2 — Tuesday, Jun 29',
    items: [
      { time: '07:00 AM', title: 'Sunrise Yoga at the Villa',     note: 'Included with stay' },
      { time: '10:00 AM', title: 'Tegallalang Rice Terraces',     note: 'Guided tour · $25/person' },
      { time: '03:00 PM', title: 'Ubud Art Market',               note: 'Free entry · Budget $50' },
    ],
  },
];

const NOTES = [
  {
    color: 'rgba(255,215,0,0.04)',
    borderColor: 'rgba(255,215,0,0.12)',
    labelColor: 'rgba(255,215,0,0.7)',
    title: '📌 Must-Do',
    body: 'Book Tegallalang tour in advance · Rent scooter day 3 · Try suckling pig at Babi Guling',
  },
  {
    color: 'transparent',
    borderColor: 'rgba(255,255,255,0.09)',
    labelColor: 'rgba(52,211,153,0.7)',
    title: '✓ Confirmed Bookings',
    body: '✓ Flights — SQ948 & SQ949\n✓ Villa Seminyak (10 nights)\n✓ Sarong Restaurant (Jun 28)\n○ Spa at COMO — Pending',
  },
  {
    color: 'transparent',
    borderColor: 'rgba(255,255,255,0.09)',
    labelColor: 'rgba(167,139,250,0.7)',
    title: '🗺 Packing List',
    body: 'Sunscreen SPF50 · Sarong for temples\nPower adapter · Mosquito repellent\nReef-safe sunblock · Light linen clothes',
  },
];

function Itinerary() {
  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Itinerary Builder</div>
        <div className="page-sub">Plan each day of your Bali trip.</div>
      </div>

      <div className="card-grid grid-2">
        {/* Timeline */}
        <div className="card">
          <div className="section-row">
            <span className="section-title">Day Planner</span>
            <span className="pill-tag">Bali 🌴</span>
          </div>

          {DAYS.map(day => (
            <div key={day.label} className="day-block">
              <div className="day-label">{day.label}</div>
              {day.items.map((item, i) => (
                <div key={i} className={`timeline-item ${i === day.items.length - 1 ? 'last' : ''}`}>
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <div className="timeline-time">{item.time}</div>
                    <div className="timeline-title">{item.title}</div>
                    <div className="timeline-note">{item.note}</div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Notes panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {NOTES.map(n => (
            <div
              key={n.title}
              className="card"
              style={{ background: n.color, borderColor: n.borderColor, padding: '0.9rem 1rem' }}
            >
              <div className="note-label" style={{ color: n.labelColor }}>{n.title}</div>
              <div className="note-body">{n.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Itinerary;