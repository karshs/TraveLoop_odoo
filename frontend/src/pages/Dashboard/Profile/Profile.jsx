import { useAuth } from '../../../context/AuthContext';
import '../Shared.css';
import './Profile.css';

function Profile() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Traveller';
  const initials  = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : firstName[0]?.toUpperCase() || 'A';

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Profile & Settings</div>
        <div className="page-sub">Manage your account and preferences.</div>
      </div>

      <div className="card-grid grid-2">
        {/* Profile card */}
        <div className="card">
          <div className="section-row">
            <span className="section-title">Your Profile</span>
          </div>
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">{initials}</div>
            <div>
              <div className="profile-name">{user?.name || firstName}</div>
              <div className="profile-email">{user?.email || '—'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input className="form-input" defaultValue={user?.name || ''} placeholder="Your name" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" defaultValue={user?.email || ''} placeholder="your@email.com" disabled />
            </div>
            <button className="btn-primary" style={{ marginTop: '0.5rem', width: 'fit-content' }}>
              Save Changes
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="card">
          <div className="section-row">
            <span className="section-title">Preferences</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div className="form-group">
              <label className="form-label">Preferred language</label>
              <select className="form-input" style={{ cursor: 'pointer' }}>
                <option>English</option>
                <option>Hindi</option>
                <option>French</option>
                <option>German</option>
                <option>Spanish</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Currency</label>
              <select className="form-input" style={{ cursor: 'pointer' }}>
                <option>USD — US Dollar</option>
                <option>EUR — Euro</option>
                <option>INR — Indian Rupee</option>
                <option>GBP — British Pound</option>
              </select>
            </div>
          </div>

          <div className="section-row" style={{ marginTop: '1.5rem' }}>
            <span className="section-title">Danger Zone</span>
          </div>
          <button className="btn-danger">Delete Account</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
