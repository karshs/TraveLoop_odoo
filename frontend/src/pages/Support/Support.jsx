import { useState } from 'react';
import { ArrowLeft, Mail, MessageCircle, BookOpen, Zap, Shield, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Support.css';

const SUPPORT_EMAIL = 'plannr333@gmail.com';
const WEB3FORMS_KEY = '2054beed-f2f0-4407-9fcc-b85184639983';

const FAQS = [
    {
        question: 'How do I create my first trip?',
        answer:
            'After logging in, head to your dashboard and click "New Trip". Give it a name, set your dates, and start adding city stops. You can reorder stops anytime by dragging them.',
    },
    {
        question: "Can I share my trip with someone who doesn't have an account?",
        answer:
            "Yes. Open your trip settings and set visibility to \"Link Only\". You'll get a unique share link — anyone with that link can view your full itinerary without signing up.",
    },
    {
        question: 'How does the budget tracker work?',
        answer:
            'Set a budget limit when creating your trip. As you add activities and log expenses by category (transport, stay, food, etc.), PlannR calculates your running total and warns you when you\'re close to or over budget.',
    },
    {
        question: 'Can I duplicate a trip?',
        answer:
            'Yes. Open any trip and use the "Copy Trip" option. It creates a full deep copy — all stops, activities, and structure — as a new private draft you can edit freely.',
    },
    {
        question: 'How do I reset my packing checklist?',
        answer:
            "Inside your trip's checklist tab, there's a \"Reset All\" button that marks every item as unpacked in one click — useful when reusing a trip template.",
    },
    {
        question: 'Is my data safe?',
        answer:
            'All passwords are hashed with bcrypt and never stored in plain text. JWTs are short-lived and signed with a secret key. Private trips are never exposed in public feeds.',
    },
];

const TOPICS = [
    { icon: <Map size={18} />, label: 'Trip Planning' },
    { icon: <Zap size={18} />, label: 'Account & Billing' },
    { icon: <Shield size={18} />, label: 'Privacy & Security' },
    { icon: <BookOpen size={18} />, label: 'Getting Started' },
    { icon: <MessageCircle size={18} />, label: 'Bug Report' },
    { icon: <Mail size={18} />, label: 'Other' },
];

export default function Support() {
    const navigate = useNavigate();
    const [openIndex, setOpenIndex] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', topic: '', message: '' });
    const [focused, setFocused] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            setError('Please fill in your name, email, and message.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const payload = new FormData();
            payload.append('access_key', WEB3FORMS_KEY);
            payload.append('name', formData.name);
            payload.append('email', formData.email);
            payload.append('subject', `[PlannR Support] ${formData.topic || 'General'} — ${formData.name}`);
            payload.append('message', `Topic: ${formData.topic || 'General'}\n\n${formData.message}`);

            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: payload,
            });
            const data = await res.json();

            if (data.success) {
                setSubmitted(true);
            } else {
                setError(data.message || 'Something went wrong. Please try again.');
            }
        } catch {
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="support-container">
            <div className="support-glow support-glow--top" />
            <div className="support-glow support-glow--bottom" />

            {/* Back button */}
            <button className="support-back-btn" onClick={() => navigate('/')}>
                <ArrowLeft size={14} />
                Home
            </button>

            {/* ── Hero header ── */}
            <header className="support-header">
                <span className="support-label">Support</span>
                <h1 className="support-title">How can we help?</h1>
                <p className="support-subtitle">
                    Browse the FAQs or send us a message — we usually respond within 24 hours.
                </p>
                <a className="support-email-pill" href={`mailto:${SUPPORT_EMAIL}`}>
                    <Mail size={13} />
                    {SUPPORT_EMAIL}
                </a>
            </header>

            <div className="support-body">

                {/* ── FAQ ── */}
                <section className="support-section">
                    <h2 className="support-section-title">Frequently Asked Questions</h2>
                    <div className="support-faq-list">
                        {FAQS.map((faq, i) => (
                            <div
                                key={i}
                                className={`support-faq-item${openIndex === i ? ' open' : ''}`}
                            >
                                <button
                                    className="support-faq-q"
                                    onClick={() => toggle(i)}
                                    aria-expanded={openIndex === i}
                                >
                                    <span>{faq.question}</span>
                                    <span className="support-faq-chevron" aria-hidden="true">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </span>
                                </button>
                                <div className="support-faq-a">
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Contact form ── */}
                <section className="support-section">
                    <h2 className="support-section-title">Send a Message</h2>

                    {submitted ? (
                        <div className="support-success">
                            <div className="support-success-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <h3>Message sent</h3>
                            <p>
                                We've received your message and will get back to you at{' '}
                                <strong>{formData.email}</strong> within 24 hours.
                            </p>
                        </div>
                    ) : (
                        <form className="support-form" onSubmit={handleSubmit} noValidate>

                            {/* Name + Email row */}
                            <div className="support-form-row">
                                <div className={`support-input-wrap${focused === 'name' ? ' focused' : ''}`}>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Your name"
                                        className="support-input"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onFocus={() => setFocused('name')}
                                        onBlur={() => setFocused('')}
                                        required
                                    />
                                </div>
                                <div className={`support-input-wrap${focused === 'email' ? ' focused' : ''}`}>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Your email"
                                        className="support-input"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onFocus={() => setFocused('email')}
                                        onBlur={() => setFocused('')}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Topic chips */}
                            <div className="support-topics">
                                {TOPICS.map(({ icon, label }) => (
                                    <button
                                        key={label}
                                        type="button"
                                        className={`support-topic-chip${formData.topic === label ? ' selected' : ''}`}
                                        onClick={() => setFormData(prev => ({ ...prev, topic: label }))}
                                    >
                                        {icon}
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {/* Message */}
                            <div className={`support-input-wrap support-textarea-wrap${focused === 'message' ? ' focused' : ''}`}>
                                <textarea
                                    name="message"
                                    placeholder="Describe your issue or question…"
                                    className="support-input support-textarea"
                                    value={formData.message}
                                    onChange={handleChange}
                                    onFocus={() => setFocused('message')}
                                    onBlur={() => setFocused('')}
                                    rows={5}
                                    required
                                />
                            </div>

                            {error && <p className="support-error" role="alert">{error}</p>}

                            <button type="submit" className="support-btn-submit" disabled={loading}>
                                {loading ? (
                                    <span className="support-btn-spinner" />
                                ) : (
                                    <svg className="support-btn-icon" viewBox="0 0 24 24" aria-hidden="true">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                )}
                                {loading ? 'Sending…' : 'Send Message'}
                            </button>

                        </form>
                    )}
                </section>

            </div>
        </div>
    );
}
