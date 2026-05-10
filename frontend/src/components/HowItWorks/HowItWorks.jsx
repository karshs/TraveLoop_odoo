import './HowItWorks.css';

const STEPS = [
    {
        number: '01',
        title: 'Create an Account',
        description:
            'Sign up with your email or continue with Google. Takes under 30 seconds — no credit card needed.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
    },
    {
        number: '02',
        title: 'Build Your Itinerary',
        description:
            'Add multiple cities to your trip, set arrival and departure dates for each stop, and drag to reorder your route.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
        ),
    },
    {
        number: '03',
        title: 'Pick Activities',
        description:
            'Browse a curated catalog of activities for each city. Add them to your stops with custom costs and scheduled times.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
            </svg>
        ),
    },
    {
        number: '04',
        title: 'Track Your Budget',
        description:
            'Set a budget limit and log expenses by category — transport, stay, food, activities. Get instant over-budget warnings.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20" />
            </svg>
        ),
    },
    {
        number: '05',
        title: 'Pack & Note',
        description:
            'Use the built-in packing checklist to stay organised. Attach notes to your trip, a specific city stop, or a particular day.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
                <path d="M9 12h6M9 16h4" />
            </svg>
        ),
    },
    {
        number: '06',
        title: 'Share Your Trip',
        description:
            'Make your trip public or generate a private share link. Anyone with the link can view your full itinerary — no login required.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
            </svg>
        ),
    },
];

export function HowItWorks() {
    return (
        <section className="hiw" id="how-it-works">
            <div className="hiw__header">
                <span className="hiw__label">How It Works</span>
                <h2 className="hiw__title">Plan your trip in six steps</h2>
                <p className="hiw__subtitle">
                    From signup to sharing — everything you need to organise a stress-free trip.
                </p>
            </div>

            <div className="hiw__grid">
                {STEPS.map((step) => (
                    <div className="hiw__card" key={step.number}>
                        <div className="hiw__card-top">
                            <span className="hiw__number">{step.number}</span>
                            <div className="hiw__icon">{step.icon}</div>
                        </div>
                        <h3 className="hiw__card-title">{step.title}</h3>
                        <p className="hiw__card-desc">{step.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default HowItWorks;
