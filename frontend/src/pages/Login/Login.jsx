import { useState } from 'react';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const API = import.meta.env.VITE_API_URL;

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [focused, setFocused]   = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const navigate    = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${API}/auth/login`,
        { email: formData.email, password: formData.password }
      );
      if (res.status === 200) {
        const token = res.data.data.token;
        localStorage.setItem('token', token);
        const meRes = await axios.get(
          `${API}/auth/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(meRes.data.data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API}/auth/google`;
  };

  return (
    <div className="auth-container">
      <div className="auth-glow" />

      {/* Back to home */}
      <button className="auth-back-btn" onClick={() => navigate('/')}>
        <ArrowLeft size={14} />
        Home
      </button>

      <div className="auth-card">

        {/* Brand */}
        <div className="auth-brand">
          <p className="auth-brand-sub">Log in to</p>
          <h1 className="auth-brand-name">PlannR</h1>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          <div className={`auth-input-wrap ${focused === 'email' ? 'focused' : ''}`}>
            <Mail className="auth-input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              className="auth-input"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused('')}
              autoComplete="email"
            />
          </div>

          <div className={`auth-input-wrap ${focused === 'password' ? 'focused' : ''}`}>
            <Lock className="auth-input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="auth-input"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused('')}
              autoComplete="current-password"
            />
          </div>

          {error && <p className="auth-error" role="alert">{error}</p>}

          {/* Button with arrow swap animation */}
          <button type="submit" className="auth-btn-primary" disabled={loading}>
            <span className="auth-btn-arrow-enter">
              <svg className="auth-btn-icon" viewBox="0 0 24 24" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
            <span className="auth-btn-arrow-wrap">
              <span className="auth-btn-arrow-exit">
                <svg className="auth-btn-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
              {loading ? 'Logging in…' : 'Log in'}
            </span>
          </button>

        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span className="auth-divider-line" />
          <span className="auth-divider-text">Or continue with</span>
          <span className="auth-divider-line" />
        </div>

        {/* Google */}
        <a className="auth-btn-google" href={`${API}/auth/google`}>
          <svg className="auth-google-icon" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </a>

        {/* Footer */}
        <div className="auth-footer">
          <button className="auth-link-btn" type="button" onClick={() => navigate('/register')}>
            Create Account
          </button>
          <button className="auth-footnote" type="button">
            Forgotten your password?
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;
