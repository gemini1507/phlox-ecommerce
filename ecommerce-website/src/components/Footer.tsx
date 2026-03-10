import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white/80 pt-14 pb-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-black tracking-widest text-white mb-4">
              PHL<span className="text-primary">O</span>X
            </h2>
            <p className="text-sm leading-relaxed mb-5">
              Your one-stop shop for premium electronics, gadgets, and tech accessories.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              {['Home', 'Shop', 'About Us', 'Blog', 'Contact Us'].map(link => (
                <li key={link}>
                  <Link to="/" className="text-sm hover:text-primary transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2.5">
              {['Headphones', 'Earphones', 'Wearables', 'Laptops', 'Gaming', 'Speakers'].map(cat => (
                <li key={cat}>
                  <Link to="/shop" className="text-sm hover:text-primary transition-colors">{cat}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                123 Tech Street, Jakarta, Indonesia 12345
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                +62 21 1234 5678
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-primary" />
                support@phlox.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© 2024 PHLOX. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
