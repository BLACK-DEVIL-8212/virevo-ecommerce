import { Link } from 'react-router-dom';

const SocialIcon = ({ href, label, children }) => (
  <a href={href} aria-label={label} className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 text-slate-400 transition-all duration-200 hover:text-primary hover:bg-slate-700">{children}</a>
);

function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-[60px]">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-2xl font-extrabold text-white mb-4">VIREVO</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Your one-stop shop for premium products. Quality meets affordability at Virevo.</p>
          </div>
          <div>
            <h4 className="text-base font-semibold text-white mb-4">Quick Links</h4>
            <ul className="flex flex-col gap-2.5">
              <li><Link to="/" className="text-slate-400 text-sm transition-colors duration-200 hover:text-primary">Home</Link></li>
              <li><Link to="/shop" className="text-slate-400 text-sm transition-colors duration-200 hover:text-primary">Shop</Link></li>
              <li><Link to="/about" className="text-slate-400 text-sm transition-colors duration-200 hover:text-primary">About</Link></li>
              <li><Link to="/contact" className="text-slate-400 text-sm transition-colors duration-200 hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold text-white mb-4">Customer Service</h4>
            <ul className="flex flex-col gap-2.5">
              <li><Link to="/" className="text-slate-400 text-sm transition-colors duration-200 hover:text-primary">FAQ</Link></li>
              <li><Link to="/" className="text-slate-400 text-sm transition-colors duration-200 hover:text-primary">Shipping</Link></li>
              <li><Link to="/" className="text-slate-400 text-sm transition-colors duration-200 hover:text-primary">Returns</Link></li>
              <li><Link to="/privacy-policy" className="text-slate-400 text-sm transition-colors duration-200 hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold text-white mb-4">Newsletter</h4>
            <p className="text-slate-400 text-sm mb-3">Subscribe for latest updates and offers.</p>
            <form className="flex gap-2 mt-3" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" className="flex-1 px-3.5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 text-white text-sm outline-none focus:border-primary transition-colors duration-200" />
              <button type="submit" className="px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium transition-colors duration-200 hover:bg-primary-dark">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="mt-10 pt-5 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">&copy; {new Date().getFullYear()} Virevo. All rights reserved.</p>
            <div className="flex gap-4">
              <SocialIcon href="#" label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </SocialIcon>
              <SocialIcon href="#" label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1-.7 2-1.3 3-2z"/></svg>
              </SocialIcon>
              <SocialIcon href="#" label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </SocialIcon>
              <SocialIcon href="#" label="Youtube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              </SocialIcon>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
