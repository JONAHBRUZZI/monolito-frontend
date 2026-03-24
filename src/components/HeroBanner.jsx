import React, { useState, useEffect } from 'react';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1585398919211-31c824a35965?q=80&w=2070&auto=format&fit=crop',
    headline: 'Descubre Tu Esencia Única',
    subtext: 'Explora nuestra colección curada de fragancias de lujo de todo el mundo.'
  },
  {
    image: 'https://images.unsplash.com/photo-1622636542322-6a5245112987?q=80&w=2070&auto=format&fit=crop',
    headline: 'Nuevas Llegadas de Primavera',
    subtext: 'Aromas frescos y florales para celebrar la temporada.'
  },
  {
    image: 'https://images.unsplash.com/photo-1594035918253-03a0a9b14267?q=80&w=2070&auto=format&fit=crop',
    headline: 'El Regalo Perfecto te Espera',
    subtext: 'Encuentra una fragancia inolvidable para esa persona especial.'
  }
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-banner">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`slide ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="slide-content">
            <h2>{slide.headline}</h2>
            <p>{slide.subtext}</p>
            <button className="button-primary">Explorar Ahora</button>
          </div>
        </div>
      ))}
      <div className="slide-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}
