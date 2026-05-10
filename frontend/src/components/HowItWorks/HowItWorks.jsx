import './HowItWorks.scss';
import img1 from '../../assets/image1.jpg';
import img2 from '../../assets/iamge2.jpg';
import img3 from '../../assets/image3.jpg';

const STEPS = [
  {
    num: '01',
    label: 'Quick setup',
    headingStatic: 'Create your account in',
    headingItalic: 'seconds',
    desc: 'Sign up, set your travel preferences, and you\'re ready to go. No complicated onboarding — just start planning your next adventure immediately.',
    img: img1,
    imgAlt: 'PlannR signup illustration',
    flip: false,
  },
  {
    num: '02',
    label: 'Build your itinerary',
    headingStatic: 'Plan every day of your',
    headingItalic: 'trip',
    desc: 'Add destinations, schedule activities, set dates, and organise multi-city routes — all from one clean drag-and-drop itinerary builder.',
    img: img2,
    imgAlt: 'Itinerary builder illustration',
    flip: true,
  },
  {
    num: '03',
    label: 'Track & share',
    headingStatic: 'Manage budgets and share',
    headingItalic: 'memories',
    desc: 'Track every expense, stay within budget, and share your trips with friends or the PlannR community. Travel smarter, together.',
    img: img3,
    imgAlt: 'Budget and sharing illustration',
    flip: false,
  },
];

const HowItWorks = () => (
  <section className="hiw" id="how-it-works">
    <div className="hiw__label-top">
      <span>How it works</span>
    </div>
    <h2 className="hiw__heading">
      Simple planning, <em className="hiw__heading-em">unforgettable trips</em>
    </h2>
    <p className="hiw__subheading">From signup to takeoff — PlannR gets you there</p>

    <div className="hiw__cards">
      {STEPS.map((step) => (
        <div
          key={step.num}
          className={`hiw__card${step.flip ? ' hiw__card--flip' : ''}`}
        >
          <div className="hiw__img-pane">
            <img
              src={step.img}
              alt={step.imgAlt}
              className="hiw__img"
              draggable="false"
            />
          </div>
          <div className="hiw__content">
            <span className="hiw__num">{step.num}</span>
            <span className="hiw__small-label">{step.label}</span>
            <h3 className="hiw__card-heading">
              {step.headingStatic}{' '}
              <em className="hiw__card-heading-em">{step.headingItalic}</em>
            </h3>
            <p className="hiw__desc">{step.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default HowItWorks;
