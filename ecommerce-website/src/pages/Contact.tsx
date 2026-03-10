import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-dark to-gray-800 text-white py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-primary text-sm font-semibold mb-3 uppercase tracking-widest">Contact Us</p>
          <h1 className="text-4xl font-bold mb-3">We'd Love to Hear From You</h1>
          <p className="text-gray-400 max-w-xl mx-auto">Got a question? Need help? We're here for you 24/7.</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Info cards */}
          <div className="space-y-4">
            {[
              { icon: MapPin, title: 'Our Office', lines: ['Jl. Sudirman No. 123', 'Jakarta Selatan 12190', 'Indonesia'] },
              { icon: Phone, title: 'Phone', lines: ['+62 21 1234 5678', '+62 812 3456 7890 (WhatsApp)'] },
              { icon: Mail, title: 'Email', lines: ['support@phlox.com', 'business@phlox.com'] },
              { icon: Clock, title: 'Working Hours', lines: ['Mon-Fri: 09:00 - 18:00 WIB', 'Sat: 10:00 - 15:00 WIB', 'Sun: Closed'] },
            ].map((info, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex gap-4 group hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <info.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-dark text-sm mb-1">{info.title}</h3>
                  {info.lines.map((line, j) => (
                    <p key={j} className="text-gray-500 text-sm">{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-dark mb-2 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" /> Send us a Message
            </h2>
            <p className="text-gray-500 text-sm mb-6">Fill out the form and we'll get back to you within 24 hours.</p>

            {sent && (
              <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-xl mb-4 border border-green-100 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Message sent successfully! We'll reply within 24 hours.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Full Name</label>
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="John Doe" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Email Address</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required placeholder="john@gmail.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Subject</label>
                <input type="text" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required placeholder="How can we help?" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Message</label>
                <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} required placeholder="Write your message here..." rows={5} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none" />
              </div>
              <button type="submit" className="btn-primary flex items-center gap-2 px-6 py-3 text-sm font-semibold">
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-12 bg-gray-100 rounded-2xl h-64 flex items-center justify-center overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2!2d106.82!3d-6.22!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTMnMTIuMCJTIDEwNsKwNDknMTIuMCJF!5e0!3m2!1sen!2sid!4v1"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            className="rounded-2xl"
          />
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-dark text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, bank transfer, OVO, GoPay, and cash on delivery.' },
              { q: 'How long does shipping take?', a: 'Standard delivery takes 3-5 business days. Same-day delivery is available for Jakarta area.' },
              { q: 'Can I return a product?', a: 'Yes! We offer a 30-day return policy for all products in original condition.' },
              { q: 'Do you offer international shipping?', a: 'Yes, we ship to 50+ countries across Southeast Asia and beyond.' },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-dark text-sm mb-2">{faq.q}</h3>
                <p className="text-gray-500 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
