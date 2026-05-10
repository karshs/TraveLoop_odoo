import { useState } from 'react'
import heroImg from '../../assets/hero.png'
import './Hero.scss'

const LINE1 = ['Plan', 'smarter', 'trips,']
const LINE2 = ['not', 'stressful', 'ones.']
const HIGHLIGHT_WORD = 'trips,'

const Hero = () => {
  const [loaded, setLoaded] = useState(false)

  return (
    <section className="hero">
      {!loaded && (
        <div className="hero__loader">
          <span className="hero__spinner" />
        </div>
      )}
      <img
        src={heroImg}
        alt="Hero"
        className={`hero__image${loaded ? ' hero__image--loaded' : ''}`}
        onLoad={() => setLoaded(true)}
      />
      <div className="hero__content">
        <h1 className="hero__title">
          <span className="hero__line">
            {LINE1.map((word, i) => (
              <span
                key={i}
                className={`hero__word${word === HIGHLIGHT_WORD ? ' hero__highlight' : ''}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {word}
              </span>
            ))}
          </span>
          <span className="hero__line">
            {LINE2.map((word, i) => (
              <span
                key={i}
                className="hero__word"
                style={{ animationDelay: `${(LINE1.length + i) * 0.1}s` }}
              >
                {word}
              </span>
            ))}
          </span>
        </h1>
      </div>
    </section>
  )
}

export default Hero
