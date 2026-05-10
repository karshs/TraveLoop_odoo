import React from 'react'
import heroImg from '../../assets/hero.png'
import './Hero.scss'

const Hero = () => {
  return (
    <section className="hero">
      <img src={heroImg} alt="Hero" className="hero__image" />
    </section>
  )
}

export default Hero
