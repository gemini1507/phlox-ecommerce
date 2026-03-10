import { useState } from 'react';
import { Clock, User, ArrowRight, Tag, Search } from 'lucide-react';

const posts = [
  {
    id: 1,
    title: 'Top 10 Headphones for Music Lovers in 2024',
    excerpt: 'We tested dozens of headphones and narrowed it down to the absolute best options for audiophiles on any budget.',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format',
    category: 'Reviews',
    author: 'Sarah Chen',
    date: 'Feb 15, 2024',
    readTime: '8 min',
    featured: true,
  },
  {
    id: 2,
    title: 'Apple Watch Series 9: Is It Worth the Upgrade?',
    excerpt: 'A detailed comparison between the Series 8 and Series 9 ​— features, battery life, and real-world performance.',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format',
    category: 'Reviews',
    author: 'Danny Liu',
    date: 'Feb 10, 2024',
    readTime: '6 min',
    featured: false,
  },
  {
    id: 3,
    title: 'How to Set Up Your Perfect Home Office in 2024',
    excerpt: 'From ergonomic chairs to ultra-wide monitors — everything you need for productivity and comfort.',
    img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format',
    category: 'Guides',
    author: 'Mike Park',
    date: 'Feb 5, 2024',
    readTime: '10 min',
    featured: false,
  },
  {
    id: 4,
    title: 'PlayStation 5 vs Xbox Series X: The Ultimate Showdown',
    excerpt: 'Which next-gen console should you buy? We break down exclusive games, performance, and value.',
    img: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&auto=format',
    category: 'Comparison',
    author: 'Bella Deviant',
    date: 'Jan 28, 2024',
    readTime: '7 min',
    featured: false,
  },
  {
    id: 5,
    title: '5 Budget Wireless Earbuds That Sound Expensive',
    excerpt: 'You don\'t need to spend $200+ for great sound. These earbuds under $50 punch well above their weight.',
    img: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600&auto=format',
    category: 'Budget Picks',
    author: 'Sarah Chen',
    date: 'Jan 20, 2024',
    readTime: '5 min',
    featured: false,
  },
  {
    id: 6,
    title: 'The Future of Smart Homes: What\'s Coming in 2025',
    excerpt: 'AI assistants, smart appliances, and energy-efficient tech — a peek into tomorrow\'s connected living.',
    img: 'https://images.unsplash.com/photo-1558618666-fdc3c39b2e35?w=600&auto=format',
    category: 'Tech Trends',
    author: 'Mike Park',
    date: 'Jan 15, 2024',
    readTime: '9 min',
    featured: false,
  },
];

const categories = ['All', 'Reviews', 'Guides', 'Comparison', 'Budget Picks', 'Tech Trends'];

const Blog = () => {
  const [selectedCat, setSelectedCat] = useState('All');
  const [search, setSearch] = useState('');

  const featured = posts.find(p => p.featured);
  const filtered = posts
    .filter(p => !p.featured)
    .filter(p => selectedCat === 'All' || p.category === selectedCat)
    .filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-dark to-gray-800 text-white py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-primary text-sm font-semibold mb-3 uppercase tracking-widest">Blog</p>
          <h1 className="text-4xl font-bold mb-3">Tech Insights & Reviews</h1>
          <p className="text-gray-400 max-w-xl mx-auto">Expert reviews, buying guides, and the latest trends in consumer electronics.</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Featured post */}
        {featured && (
          <div className="mb-12 bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 grid md:grid-cols-2">
            <img src={featured.img} alt={featured.title} className="h-64 md:h-full w-full object-cover" />
            <div className="p-8 flex flex-col justify-center">
              <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full w-fit mb-4">{featured.category}</span>
              <h2 className="text-2xl font-bold text-dark mb-3 leading-tight">{featured.title}</h2>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {featured.author}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {featured.readTime} read</span>
              </div>
              <button className="mt-6 text-primary font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                Read Article <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCat(cat)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCat === cat ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary w-60" />
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(post => (
            <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-md transition-shadow">
              <div className="relative overflow-hidden h-48">
                <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  <Tag className="w-3 h-3 text-primary" /> {post.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-dark mb-2 group-hover:text-primary transition-colors leading-snug">{post.title}</h3>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                    <span>{post.date}</span>
                  </div>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
