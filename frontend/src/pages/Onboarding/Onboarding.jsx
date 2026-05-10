import { useState } from 'react';
import {
  User, Mail, Lock, Phone, Globe, Calendar,
  MapPin, Eye, EyeOff, Link2, ChevronDown, Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './Onboarding.css';

const API = import.meta.env.VITE_API_URL;

// ─── Shared SVG icons ────────────────────────────────────────
function ArrowRight() {
  return (
    <svg className="ob-btn-icon" viewBox="0 0 24 24" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg className="ob-btn-back-icon" viewBox="0 0 24 24" aria-hidden="true">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="ob-success-check" viewBox="0 0 24 24" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ─── Step config ─────────────────────────────────────────────
// Step 3 is now optional — label reflects that
const STEP_LABELS = ['Account', 'Profile', 'First Trip'];
const TOTAL_STEPS = STEP_LABELS.length;

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'es', label: 'Spanish' },
  { value: 'ja', label: 'Japanese' },
  { value: 'zh', label: 'Chinese' },
];

const VISIBILITY_OPTIONS = [
  { value: 'PRIVATE',   label: 'Private',   Icon: Eye   },
  { value: 'PUBLIC',    label: 'Public',     Icon: Globe },
  { value: 'LINK_ONLY', label: 'Link only',  Icon: Link2 },
];

// ─── Small helpers ────────────────────────────────────────────
function InputWrap({ focused, error, icon: Icon, children }) {
  return (
    <div className={`ob-input-wrap${focused ? ' focused' : ''}${error ? ' error' : ''}`}>
      {Icon && <Icon className="ob-input-icon" size={15} />}
      {children}
    </div>
  );
}

function Field({ label, optional, error, children }) {
  return (
    <div className="ob-field">
      {label && (
        <p className="ob-field-label">
          {label}
          {optional && <span className="ob-optional">optional</span>}
        </p>
      )}
      {children}
      {error && <p className="ob-error">{error}</p>}
    </div>
  );
}

// ─── Steps ────────────────────────────────────────────────────
function Step1({ data, onChange, errors }) {
  const [focused, setFocused] = useState('');
  const [showPw, setShowPw]   = useState(false);

  return (
    <div className="ob-step">
      <div className="ob-step-header">
        <p className="ob-step-eyebrow">Step 1 of {TOTAL_STEPS}</p>
        <h2 className="ob-step-title">Create your account</h2>
        <p className="ob-step-sub">You'll use this to log in every time.</p>
      </div>
      <div className="ob-fields">
        <div className="ob-row">
          <Field label="First name" error={errors.firstName}>
            <InputWrap focused={focused === 'firstName'} error={errors.firstName} icon={User}>
              <input
                className="ob-input"
                placeholder="Jane"
                value={data.firstName}
                onChange={e => onChange('firstName', e.target.value)}
                onFocus={() => setFocused('firstName')}
                onBlur={() => setFocused('')}
                autoComplete="given-name"
              />
            </InputWrap>
          </Field>
          <Field label="Last name" error={errors.lastName}>
            <InputWrap focused={focused === 'lastName'} error={errors.lastName} icon={User}>
              <input
                className="ob-input"
                placeholder="Doe"
                value={data.lastName}
                onChange={e => onChange('lastName', e.target.value)}
                onFocus={() => setFocused('lastName')}
                onBlur={() => setFocused('')}
                autoComplete="family-name"
              />
            </InputWrap>
          </Field>
        </div>
        <Field label="Email" error={errors.email}>
          <InputWrap focused={focused === 'email'} error={errors.email} icon={Mail}>
            <input
              className="ob-input"
              type="email"
              placeholder="jane@example.com"
              value={data.email}
              onChange={e => onChange('email', e.target.value)}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused('')}
              autoComplete="email"
            />
          </InputWrap>
        </Field>
        <Field label="Password" error={errors.password}>
          <InputWrap focused={focused === 'password'} error={errors.password} icon={Lock}>
            <input
              className="ob-input"
              type={showPw ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              value={data.password}
              onChange={e => onChange('password', e.target.value)}
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused('')}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPw(p => !p)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 0 }}
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw
                ? <EyeOff size={14} color="rgba(255,255,255,0.28)" />
                : <Eye    size={14} color="rgba(255,255,255,0.28)" />}
            </button>
          </InputWrap>
        </Field>
      </div>
    </div>
  );
}

function Step2({ data, onChange, errors }) {
  const [focused, setFocused] = useState('');

  return (
    <div className="ob-step">
      <div className="ob-step-header">
        <p className="ob-step-eyebrow">Step 2 of {TOTAL_STEPS}</p>
        <h2 className="ob-step-title">Tell us about yourself</h2>
        <p className="ob-step-sub">These details personalise your experience.</p>
      </div>
      <div className="ob-fields">
        <div className="ob-row">
          <Field label="Phone" optional error={errors.phone}>
            <InputWrap focused={focused === 'phone'} icon={Phone}>
              <input
                className="ob-input"
                type="tel"
                placeholder="+91 00000 00000"
                value={data.phone}
                onChange={e => onChange('phone', e.target.value)}
                onFocus={() => setFocused('phone')}
                onBlur={() => setFocused('')}
                autoComplete="tel"
              />
            </InputWrap>
          </Field>
          <Field label="Age" optional error={errors.age}>
            <InputWrap focused={focused === 'age'} icon={Calendar}>
              <input
                className="ob-input"
                type="number"
                min="13"
                max="120"
                placeholder="25"
                value={data.age}
                onChange={e => onChange('age', e.target.value)}
                onFocus={() => setFocused('age')}
                onBlur={() => setFocused('')}
              />
            </InputWrap>
          </Field>
        </div>
        <Field label="Preferred language">
          <div className="ob-input-wrap" style={{ cursor: 'pointer' }}>
            <Globe className="ob-input-icon" size={15} />
            <select
              className="ob-select"
              value={data.language_pref}
              onChange={e => onChange('language_pref', e.target.value)}
            >
              {LANGUAGES.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
            <ChevronDown className="ob-select-chevron" size={14} />
          </div>
        </Field>
      </div>
    </div>
  );
}

// ─── Step 3 — now fully optional ─────────────────────────────
function Step3({ data, onChange, errors }) {
  const [focused, setFocused] = useState('');

  return (
    <div className="ob-step">
      <div className="ob-step-header">
        <p className="ob-step-eyebrow">Step 3 of {TOTAL_STEPS} · <span className="ob-eyebrow-optional">Optional</span></p>
        <h2 className="ob-step-title">Plan your first trip</h2>
        <p className="ob-step-sub">Skip this now and plan a trip any time from your dashboard.</p>
      </div>
      <div className="ob-fields">
        {/* Optional nudge banner */}
        <div className="ob-optional-nudge">
          <Sparkles size={13} className="ob-nudge-icon" />
          <span>You can always add a trip later — your account is ready either way.</span>
        </div>

        <Field label="Trip title" optional error={errors.tripTitle}>
          <InputWrap focused={focused === 'tripTitle'} error={errors.tripTitle} icon={MapPin}>
            <input
              className="ob-input"
              placeholder="e.g. Europe Summer 2026"
              value={data.tripTitle}
              onChange={e => onChange('tripTitle', e.target.value)}
              onFocus={() => setFocused('tripTitle')}
              onBlur={() => setFocused('')}
            />
          </InputWrap>
        </Field>
        <div className="ob-row">
          <Field label="Start date" optional>
            <InputWrap focused={focused === 'startDate'} icon={Calendar}>
              <input
                className="ob-input"
                type="date"
                value={data.startDate}
                onChange={e => onChange('startDate', e.target.value)}
                onFocus={() => setFocused('startDate')}
                onBlur={() => setFocused('')}
                style={{ colorScheme: 'dark' }}
              />
            </InputWrap>
          </Field>
          <Field label="End date" optional>
            <InputWrap focused={focused === 'endDate'} icon={Calendar}>
              <input
                className="ob-input"
                type="date"
                value={data.endDate}
                onChange={e => onChange('endDate', e.target.value)}
                onFocus={() => setFocused('endDate')}
                onBlur={() => setFocused('')}
                style={{ colorScheme: 'dark' }}
              />
            </InputWrap>
          </Field>
        </div>
        <Field label="Who can see this trip?">
          <div className="ob-visibility-group">
            {VISIBILITY_OPTIONS.map(({ value, label, Icon }) => (
              <button
                key={value}
                type="button"
                className={`ob-visibility-pill${data.tripVisibility === value ? ' selected' : ''}`}
                onClick={() => onChange('tripVisibility', value)}
              >
                <Icon size={13} className="ob-visibility-icon" />
                {label}
              </button>
            ))}
          </div>
        </Field>
      </div>
    </div>
  );
}

// ─── Success screen — adapts copy based on whether trip was created ──
function StepSuccess({ tripCreated }) {
  const navigate = useNavigate();

  return (
    <div className="ob-success">
      <div className="ob-success-icon">
        <CheckIcon />
      </div>
      <h2 className="ob-success-title">You're all set!</h2>
      <p className="ob-success-sub">
        {tripCreated
          ? 'Your account and first trip are ready. Time to start exploring.'
          : 'Your account is ready. You can plan your first trip any time.'}
      </p>

      {/* First-trip CTA — only shown when user skipped step 3 */}
      {!tripCreated && (
        <div className="ob-success-cta">
          <p className="ob-success-cta-eyebrow">Ready to go?</p>
          <p className="ob-success-cta-text">
            Plan your first trip from the dashboard — it only takes a minute.
          </p>
          <button
            className="ob-btn-primary ob-success-cta-btn"
            type="button"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowRight />
            Plan a Trip
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────
const INITIAL_DATA = {
  firstName: '', lastName: '', email: '', password: '',
  phone: '', age: '', language_pref: 'en',
  tripTitle: '', startDate: '', endDate: '', tripVisibility: 'PRIVATE',
};

function validate(step, data) {
  const errors = {};
  if (step === 0) {
    if (!data.firstName.trim()) errors.firstName = 'Required';
    if (!data.lastName.trim())  errors.lastName  = 'Required';
    if (!data.email.trim() || !/\S+@\S+\.\S+/.test(data.email)) errors.email = 'Valid email required';
    if (data.password.length < 8) errors.password = 'Minimum 8 characters';
  }
  // Step 2 (index) — trip title is now OPTIONAL; no validation required
  return errors;
}

export function Onboarding() {
  const [step, setStep]           = useState(0);
  const [data, setData]           = useState(INITIAL_DATA);
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);
  const [done, setDone]           = useState(false);
  const [tripCreated, setTripCreated] = useState(false);

  const navigate    = useNavigate();
  const { setUser } = useAuth();

  const handleGoogleLogin = () => {
    window.location.href = `${API}/auth/google`;
  };

  const onChange = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  // ── Submit (called on final step's "Get Started") ────────────
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 1. Register
      const signupRes = await axios.post(
        `${API}/auth/signup`,
        {
          firstName:     data.firstName,
          lastName:      data.lastName,
          email:         data.email,
          password:      data.password,
          phone:         data.phone || undefined,
          age:           data.age ? parseInt(data.age) : undefined,
          language_pref: data.language_pref,
        }
      );
      
      // Extract token and configure auth header
      const token = signupRes.data.data.token;
      localStorage.setItem('token', token);
      const authConfig = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // 2. Hydrate auth context
      const meRes = await axios.get(
        `${API}/auth/me`,
        authConfig
      );
      setUser(meRes.data.data.user);

      // 3. Optionally create first trip — only if title was provided
      let didCreateTrip = false;
      if (data.tripTitle.trim()) {
        await axios.post(
          `${API}/trips`,
          {
            title:      data.tripTitle,
            start_date: data.startDate || undefined,
            end_date:   data.endDate   || undefined,
            visibility: data.tripVisibility,
            status:     'DRAFT',
          },
          authConfig
        );
        didCreateTrip = true;
      }

      setTripCreated(didCreateTrip);
      setDone(true);

      // Auto-redirect after success animation
      setTimeout(() => navigate('/dashboard'), 2200);
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setErrors({ submit: msg });
    } finally {
      setLoading(false);
    }
  };

  // ── Next / Continue ──────────────────────────────────────────
  const handleNext = async () => {
    const errs = validate(step, data);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    if (step < TOTAL_STEPS - 1) {
      setErrors({});
      setStep(s => s + 1);
      return;
    }

    // Last step — run submit
    await handleSubmit();
  };

  // ── Skip (only available on step 3) ─────────────────────────
  const handleSkip = async () => {
    // Clear any trip data so it's treated as "skipped"
    setData(prev => ({ ...prev, tripTitle: '', startDate: '', endDate: '' }));
    await handleSubmit();
  };

  return (
    <div className="ob-container">
      <div className="ob-glow" />

      {/* Back to home */}
      <button className="ob-back-btn" onClick={() => navigate('/')}>
        <svg viewBox="0 0 24 24" className="ob-back-icon" aria-hidden="true">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Home
      </button>

      <div className="ob-card">

        {/* Brand */}
        <div className="ob-brand">
          <p className="ob-brand-sub">Sign up to</p>
          <span className="ob-brand-name">PlannR</span>
        </div>

        {/* Progress */}
        {!done && (
          <div className="ob-progress">
            {/* Row 1: circles + connectors */}
            <div className="ob-progress-circles">
              {STEP_LABELS.map((label, i) => (
                <div key={label} className="ob-progress-circle-wrap">
                  <div className={`ob-progress-step-num${i === step ? ' active' : i < step ? ' done' : ''}${i === 2 ? ' optional' : ''}`}>
                    {i + 1}
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div className={`ob-progress-connector${i < step ? ' done' : ''}`} />
                  )}
                </div>
              ))}
            </div>
            {/* Row 2: labels */}
            <div className="ob-progress-labels">
              {STEP_LABELS.map((label, i) => (
                <span
                  key={label}
                  className={`ob-progress-label${i === step ? ' active' : i < step ? ' done' : ''}`}
                >
                  {label}{i === 2 ? ' *' : ''}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Step content */}
        {done ? (
          <StepSuccess tripCreated={tripCreated} />
        ) : (
          <>
            {step === 0 && <Step1 data={data} onChange={onChange} errors={errors} />}
            {step === 1 && <Step2 data={data} onChange={onChange} errors={errors} />}
            {step === 2 && <Step3 data={data} onChange={onChange} errors={errors} />}

            {errors.submit && (
              <p className="ob-error" role="alert" style={{ marginTop: '0.5rem' }}>
                {errors.submit}
              </p>
            )}

            {/* Actions */}
            <div className="ob-actions">
              {step > 0 && (
                <button className="ob-btn-back" type="button" onClick={() => setStep(s => s - 1)}>
                  <ArrowLeft />
                  Back
                </button>
              )}
              <button
                className="ob-btn-primary"
                type="button"
                onClick={handleNext}
                disabled={loading}
              >
                <ArrowRight />
                {loading ? 'Creating…' : step === TOTAL_STEPS - 1 ? 'Get Started' : 'Continue'}
              </button>
            </div>

            {/* Skip link — only on the optional step 3 */}
            {step === TOTAL_STEPS - 1 && !loading && (
              <button
                className="ob-skip-btn"
                type="button"
                onClick={handleSkip}
                disabled={loading}
              >
                Skip for now — I'll plan later
              </button>
            )}

            {/* Google OAuth — only on step 0 */}
            {step === 0 && (
              <>
                <div className="ob-divider">
                  <span className="ob-divider-line" />
                  <span className="ob-divider-text">Or sign up with</span>
                  <span className="ob-divider-line" />
                </div>
                <button className="ob-btn-google" type="button" onClick={handleGoogleLogin}>
                  <svg className="ob-google-icon" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
                <div className="ob-footer">
                  <button className="ob-link-btn" type="button" onClick={() => navigate('/login')}>
                    Already have an account?
                  </button>
                </div>
              </>
            )}
          </>
        )}

      </div>
    </div>
  );
}

export default Onboarding;
