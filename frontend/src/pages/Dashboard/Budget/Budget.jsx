import '../Shared.css';
import './Budget.css';

const STATS = [
  { label: 'Total Budget', value: '$4,500', sub: 'Bali trip' },
  { label: 'Spent',        value: '$2,810', badge: '62% used',   type: 'down' },
  { label: 'Remaining',    value: '$1,690', badge: '18 days left', type: 'up'  },
  { label: 'Daily Avg',    value: '$94',    sub: 'target $125/day' },
];

const CATEGORIES = [
  { color: '#ffd700',  label: 'Flights',        amount: '$1,200', pct: '43%' },
  { color: '#818cf8',  label: 'Accommodation',  amount: '$890',   pct: '32%' },
  { color: '#34d399',  label: 'Food & Dining',  amount: '$340',   pct: '12%' },
  { color: '#f97316',  label: 'Activities',     amount: '$250',   pct: '9%'  },
  { color: '#94a3b8',  label: 'Transport',      amount: '$80',    pct: '3%'  },
  { color: '#64748b',  label: 'Miscellaneous',  amount: '$50',    pct: '2%', divider: true },
];

const EXPENSES = [
  { name: 'Sarong Restaurant',   date: 'Jun 28 · Food',      amount: '$48' },
  { name: 'Tanah Lot Entry',     date: 'Jun 28 · Activity',  amount: '$10' },
  { name: 'Airport Transfer',    date: 'Jun 28 · Transport', amount: '$22' },
  { name: 'Tegallalang Tour',    date: 'Jun 29 · Activity',  amount: '$50' },
  { name: 'Ubud Market',         date: 'Jun 29 · Shopping',  amount: '$35' },
  { name: 'Morning Coffee × 2', date: 'Jun 30 · Food',      amount: '$8'  },
];

function Budget() {
  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Budget Planner</div>
        <div className="page-sub">Track spending across all your trips.</div>
      </div>

      {/* Stats row */}
      <div className="card-grid grid-4" style={{ marginBottom: '1.25rem' }}>
        {STATS.map(s => (
          <div key={s.label} className="card stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            {s.badge && <div className={`stat-badge ${s.type}`}>{s.badge}</div>}
            {s.sub   && <div className="stat-sub">{s.sub}</div>}
          </div>
        ))}
      </div>

      <div className="card-grid grid-2">
        {/* Category breakdown */}
        <div className="card">
          <div className="section-row">
            <span className="section-title">By Category</span>
          </div>
          <div className="progress-bar" style={{ height: 6, marginBottom: '1rem' }}>
            <div className="progress-fill" style={{ width: '62%' }} />
          </div>
          {CATEGORIES.map(c => (
            <div
              key={c.label}
              className="budget-row"
              style={c.divider ? { borderTop: '1px solid rgba(255,255,255,0.09)', borderBottom: 'none', paddingTop: '0.75rem', marginTop: '0.25rem' } : {}}
            >
              <div className="budget-cat">
                <div className="budget-dot" style={{ background: c.color }} />
                {c.label}
              </div>
              <div>
                <span className="budget-amt">{c.amount}</span>
                <span className="budget-pct">{c.pct}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent expenses */}
        <div className="card">
          <div className="section-row">
            <span className="section-title">Recent Expenses</span>
            <button className="see-all-btn" onClick={() => alert('Add expense')}>+ Add</button>
          </div>
          {EXPENSES.map((e, i) => (
            <div
              key={e.name}
              className="budget-row"
              style={i === EXPENSES.length - 1 ? { borderBottom: 'none' } : {}}
            >
              <div style={{ flex: 1 }}>
                <div className="expense-name">{e.name}</div>
                <div className="expense-date">{e.date}</div>
              </div>
              <div className="budget-amt">{e.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Budget;