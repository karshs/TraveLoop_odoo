import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import heroImg from '../../assets/hero.png'
import './Hero.scss'

const Hero = () => {
  const [loaded, setLoaded] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (loaded) {
      const timer = setTimeout(() => setVisible(true), 100)
      return () => clearTimeout(timer)
    }
  }, [loaded])

  return (
    <section className="hero" id="hero">
      {/* Loading state */}
      {!loaded && (
        <div className="hero__loader">
          <span className="hero__spinner" />
        </div>
      )}

      {/* Background image */}
      <img
        src={heroImg}
        alt="Airplane window at golden hour"
        className={`hero__image${loaded ? ' hero__image--loaded' : ''}`}
        onLoad={() => setLoaded(true)}
      />

      {/* Dark gradient overlays for text readability */}
      <div className="hero__overlay" />

      {/* Animated flight path SVG */}
      <svg
        className={`hero__flight-path${visible ? ' hero__flight-path--visible' : ''}`}
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(245,197,24,0)" />
            <stop offset="30%" stopColor="rgba(245,197,24,0.35)" />
            <stop offset="50%" stopColor="rgba(245,197,24,0.5)" />
            <stop offset="70%" stopColor="rgba(245,197,24,0.35)" />
            <stop offset="100%" stopColor="rgba(245,197,24,0)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M-50,320 C200,280 350,180 550,200 C750,220 850,320 1050,250 C1200,200 1350,280 1500,260"
          fill="none"
          stroke="url(#pathGrad)"
          strokeWidth="1.5"
          filter="url(#glow)"
          className="hero__path-line"
        />
        {/* Glowing nodes */}
        <circle cx="200" cy="290" r="3.5" fill="#f5c518" opacity="0.8" className="hero__node hero__node--1" />
        <circle cx="550" cy="200" r="4" fill="#f5c518" opacity="0.9" className="hero__node hero__node--2" />
        <circle cx="1050" cy="250" r="3.5" fill="#f5c518" opacity="0.8" className="hero__node hero__node--3" />
        <circle cx="1350" cy="275" r="3" fill="#f5c518" opacity="0.7" className="hero__node hero__node--4" />
      </svg>

      {/* Main content */}
      <div className={`hero__content${visible ? ' hero__content--visible' : ''}`}>
        {/* Headline */}
        <h1 className="hero__title">
          <span className="hero__title-line">
            <span className="hero__word hero__word--1">Plan</span>{' '}
            <span className="hero__word hero__word--highlight hero__word--2">journeys,</span>
          </span>
          <span className="hero__title-line">
            <span className="hero__word hero__word--3">not stress.</span>
          </span>
        </h1>

        {/* Search bar */}
        <div className="hero__search">
          <div className="hero__search-inner">
            <Search className="hero__search-icon" size={20} strokeWidth={1.8} />
            <input
              type="text"
              className="hero__search-input"
              placeholder="Where to next? Search cities, countries..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              id="hero-search"
            />
            <button className="hero__search-btn" type="button">
              Search
            </button>
          </div>
        </div>

        {/* Social proof */}
        <div className="hero__proof">
          <div className="hero__avatars">
            <div className="hero__avatar hero__avatar--1">
              <span>A</span>
            </div>
            <div className="hero__avatar hero__avatar--2">
              <span>M</span>
            </div>
            <div className="hero__avatar hero__avatar--3">
              <span>S</span>
            </div>
          </div>
          <div className="hero__proof-text">
            <span className="hero__proof-main">Join 50k+ travelers</span>
            <span className="hero__proof-sub">
              <svg className="hero__star" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.51.91-5.33L2.27 6.68l5.34-.78L10 1z" />
              </svg>
              4.9/5 stars from 10k reviews
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
