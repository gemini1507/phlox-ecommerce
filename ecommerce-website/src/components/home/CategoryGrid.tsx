import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'EARPHONE',
    label: 'Enjoy With',
    bg: 'bg-gray-900',
    textColor: 'text-white',
    img: 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=200&auto=format',
    span: 'col-span-1 row-span-1',
  },
  {
    name: 'WEARABLE',
    label: 'New',
    bg: 'bg-yellow-400',
    textColor: 'text-gray-900',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format',
    span: 'col-span-1 row-span-1',
  },
  {
    name: 'LAPTOP',
    label: 'Trend',
    sublabel: 'Devices',
    bg: 'bg-primary',
    textColor: 'text-white',
    img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&auto=format',
    span: 'col-span-2 row-span-1',
  },
  {
    name: 'CONSOLE',
    label: 'Best',
    sublabel: 'Gaming',
    bg: 'bg-white',
    textColor: 'text-gray-900',
    img: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&auto=format',
    span: 'col-span-2 row-span-1',
    border: true,
  },
  {
    name: 'OCULUS',
    label: 'Play',
    sublabel: 'Game',
    bg: 'bg-green-500',
    textColor: 'text-white',
    img: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=200&auto=format',
    span: 'col-span-1 row-span-1',
  },
  {
    name: 'SPEAKER',
    label: 'New',
    sublabel: 'Amazon',
    bg: 'bg-blue-500',
    textColor: 'text-white',
    img: 'https://images.unsplash.com/photo-1558618666-fdc3c39b2e35?w=200&auto=format',
    span: 'col-span-1 row-span-1',
  },
];

const CategoryGrid = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[180px]">
        {categories.map((cat, i) => (
          <Link
            key={i}
            to="/shop"
            className={`${cat.bg} ${cat.span} ${cat.border ? 'border border-gray-200' : ''} rounded-2xl p-5 flex flex-col justify-between overflow-hidden relative group hover:shadow-xl transition-shadow duration-300 cursor-pointer`}
          >
            <div className="z-10">
              <p className={`text-xs font-medium ${cat.textColor} opacity-70`}>{cat.label}</p>
              {cat.sublabel && <p className={`text-base font-semibold ${cat.textColor}`}>{cat.sublabel}</p>}
              <h3 className={`text-xl font-black ${cat.textColor} opacity-20 mt-1 tracking-wide uppercase leading-none`}>{cat.name}</h3>
            </div>
            <img
              src={cat.img}
              alt={cat.name}
              className="absolute right-3 bottom-3 w-24 h-24 object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-lg"
            />
            <button className={`relative z-10 mt-auto self-start px-4 py-1.5 text-xs font-semibold rounded-full transition-opacity ${
              cat.bg === 'bg-white' ? 'bg-primary text-white' : 'bg-white text-gray-900'
            }`}>
              Browse
            </button>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
