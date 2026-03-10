import { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    subtitle: 'Beats Solo',
    title: 'Wireless',
    highlight: 'HEADPHONE',
    description: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration.',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format',
    bg: 'bg-gradient-to-br from-gray-50 to-white',
  },
  {
    subtitle: 'Apple Watch',
    title: 'Smart',
    highlight: 'WEARABLE',
    description: 'Experience the future on your wrist with the latest smartwatch technology and health tracking features.',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format',
    bg: 'bg-gradient-to-br from-blue-50 to-white',
  },
  {
    subtitle: 'MacBook Pro',
    title: 'Premium',
    highlight: 'LAPTOP',
    description: 'Unleash your creativity with the most powerful laptop ever made. M3 chip performance at its finest.',
    img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format',
    bg: 'bg-gradient-to-br from-purple-50 to-white',
  },
  {
    subtitle: 'PlayStation 5',
    title: 'Next Gen',
    highlight: 'GAMING',
    description: 'Immerse yourself in breathtaking gaming experiences with ultra-fast SSD and ray tracing capabilities.',
    img: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&auto=format',
    bg: 'bg-gradient-to-br from-red-50 to-white',
  },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [current]);

  const goTo = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent(index);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const slide = slides[current];

  return (
    <section className={`relative overflow-hidden ${slide.bg} transition-colors duration-700`}>
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8 min-h-[500px]">
        {/* Text */}
        <div className="flex-1 z-10" key={`text-${current}`}>
          <p className="text-sm text-gray-500 mb-2 animate-fade-up">{slide.subtitle}</p>
          <h1 className="text-5xl md:text-6xl font-bold text-dark mb-1 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {slide.title}
          </h1>
          <p className="text-5xl md:text-7xl font-black text-primary/20 tracking-widest mb-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            {slide.highlight}
          </p>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            Shop By Category <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Description */}
          <div className="mt-8 max-w-xs animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <p className="font-bold text-sm text-dark mb-1">Description</p>
            <p className="text-gray-500 text-xs leading-relaxed">{slide.description}</p>
          </div>
        </div>

        {/* Image */}
        <div className="flex-1 relative flex items-center justify-center" key={`img-${current}`}>
          <div className="w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-gray-200/50 to-gray-100/30 rounded-full absolute" />
          <img
            src={slide.img}
            alt={slide.title}
            className="relative z-10 w-64 md:w-80 h-auto object-contain drop-shadow-2xl animate-fade-up"
          />
        </div>
      </div>

      {/* Navigation arrows */}
      <button onClick={() => goTo((current - 1 + slides.length) % slides.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors z-20">
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>
      <button onClick={() => goTo((current + 1) % slides.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors z-20">
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} className={`h-2 rounded-full transition-all duration-300 ${current === i ? 'w-8 bg-primary' : 'w-2 bg-gray-300 hover:bg-gray-400'}`} />
        ))}
      </div>
    </section>
  );
};

export default HeroBanner;
