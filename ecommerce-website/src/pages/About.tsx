import { Users, Award, Globe, Zap, Heart, Target } from 'lucide-react';

const team = [
  { name: 'Sarah Chen', role: 'CEO & Founder', img: 'https://i.pravatar.cc/200?u=sarah', bio: 'Former tech lead at Apple with a passion for premium audio.' },
  { name: 'Danny Liu', role: 'Head of Design', img: 'https://i.pravatar.cc/200?u=danny', bio: 'Award-winning designer from RISD, obsessed with minimalism.' },
  { name: 'Bella Deviant', role: 'CTO', img: 'https://i.pravatar.cc/200?u=bella', bio: 'Ex-Google engineer building scalable e-commerce experiences.' },
  { name: 'Mike Park', role: 'Marketing Director', img: 'https://i.pravatar.cc/200?u=mike', bio: 'Growth hacker who doubled our user base in 6 months.' },
];

const values = [
  { icon: Award, title: 'Quality First', desc: 'We curate only the best electronics and guarantee authenticity for every product we sell.' },
  { icon: Heart, title: 'Customer Love', desc: 'Every decision starts with our customers. Your satisfaction is our ultimate metric.' },
  { icon: Globe, title: 'Global Reach', desc: 'Serving tech enthusiasts in 50+ countries with fast, reliable international shipping.' },
  { icon: Zap, title: 'Innovation', desc: 'Always first to bring the latest tech gadgets before they hit mainstream markets.' },
];

const milestones = [
  { year: '2019', event: 'PHLOX founded in Jakarta with a small garage office and big dreams.' },
  { year: '2020', event: 'Reached 10,000 customers and launched mobile app.' },
  { year: '2021', event: 'Expanded to Southeast Asia — Malaysia, Singapore, Thailand.' },
  { year: '2022', event: 'Partnered with 200+ premium brands worldwide.' },
  { year: '2023', event: 'Hit $10M in annual revenue. Opened flagship experience store.' },
  { year: '2024', event: 'Launched AI-powered product recommendations and same-day delivery.' },
];

const About = () => {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-dark to-gray-800 text-white py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-primary text-sm font-semibold mb-3 uppercase tracking-widest">Our Story</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">We Bring the Best<br/>Tech to <span className="text-primary">Your Doorstep</span></h1>
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Founded in 2019, PHLOX started with a simple mission: make premium technology accessible to everyone.
            Today we serve over 100,000 happy customers across Southeast Asia.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '100K+', label: 'Happy Customers' },
            { value: '200+', label: 'Partner Brands' },
            { value: '50+', label: 'Countries Served' },
            { value: '4.9★', label: 'Average Rating' },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-3xl font-black text-primary">{s.value}</p>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark">Our Values</h2>
            <p className="text-gray-500 mt-2 text-sm">What drives us every single day</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <v.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-dark mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-dark text-center mb-12">Our Journey</h2>
          <div className="space-y-0">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">{m.year.slice(2)}</div>
                  {i < milestones.length - 1 && <div className="w-0.5 h-full bg-gray-200 my-1" />}
                </div>
                <div className="pb-8">
                  <p className="text-primary font-bold text-sm">{m.year}</p>
                  <p className="text-gray-600 text-sm mt-1">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark flex items-center justify-center gap-2">
              <Users className="w-8 h-8 text-primary" /> Meet Our Team
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-md transition-shadow">
                <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <img src={t.img} alt={t.name} className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-dark text-sm">{t.name}</h3>
                  <p className="text-primary text-xs font-medium mb-2">{t.role}</p>
                  <p className="text-gray-500 text-xs">{t.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-red-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <Target className="w-10 h-10 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-bold mb-3">Join the PHLOX Family</h2>
          <p className="text-white/80 mb-6">Discover premium tech products at unbeatable prices.</p>
          <a href="/shop" className="inline-block bg-white text-primary font-bold px-8 py-3 rounded-full hover:shadow-lg transition-shadow">Shop Now</a>
        </div>
      </section>
    </div>
  );
};

export default About;
