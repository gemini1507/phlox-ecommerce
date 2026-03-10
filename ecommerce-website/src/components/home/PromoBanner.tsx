import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const PromoBanner = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="relative bg-primary rounded-3xl overflow-hidden min-h-[240px] flex items-center">
        {/* Background text watermark */}
        <div className="absolute left-5 top-1/2 -translate-y-1/2 leading-none select-none pointer-events-none">
          <p className="text-white/10 font-black text-8xl md:text-9xl uppercase tracking-tight">
            Find<br/>Smile
          </p>
        </div>

        {/* Product Image */}
        <div className="absolute -left-4 md:left-24 bottom-0 h-full flex items-end justify-center">
          <img
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format"
            alt="Promo product"
            className="h-56 object-contain drop-shadow-xl"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 ml-auto mr-10 md:mr-20 max-w-xs text-right">
          <p className="text-white/70 text-xs mb-2 tracking-widest uppercase">Beats Solo Air</p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Summer Sale</h2>
          <p className="text-white/80 text-sm mb-6 leading-relaxed">
            Company that's grown from 270 to 480 employees in the last 12 months.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-white text-primary px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors"
          >
            Shop <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Discount badge */}
        <div className="absolute top-5 left-5 bg-white/20 backdrop-blur text-white text-xs font-semibold px-3 py-1.5 rounded-full">
          20% Off
        </div>
        <div className="absolute bottom-5 left-5 text-white/60 text-xs">
          15 Nov To 7 Dec
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
