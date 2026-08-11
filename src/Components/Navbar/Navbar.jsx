import { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Search, User, ShoppingCart, Menu, X, LogOut, Package, UserRound } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userRef = useRef(null);
  const { cartCount, setIsCartOpen } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setIsUserOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-[1000] bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between h-[70px]">
          <button className="hidden md:inline-flex items-center justify-center w-10 h-10 rounded-full bg-transparent text-gray-800 hover:bg-gray-100 hover:text-primary transition-all duration-200" onClick={() => setIsMobileOpen(true)} aria-label="Open menu">
            <Menu size={24} />
          </button>

          <Link to="/" className="text-2xl font-extrabold text-primary tracking-widest">VIREVO</Link>

          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" end className="text-[15px] font-medium text-gray-800 transition-colors duration-200 relative hover:text-primary [&.active]:text-primary">Home</NavLink>
            <NavLink to="/shop" className="text-[15px] font-medium text-gray-800 transition-colors duration-200 relative hover:text-primary [&.active]:text-primary">Shop</NavLink>
            <NavLink to="/about" className="text-[15px] font-medium text-gray-800 transition-colors duration-200 relative hover:text-primary [&.active]:text-primary">About</NavLink>
            <NavLink to="/contact" className="text-[15px] font-medium text-gray-800 transition-colors duration-200 relative hover:text-primary [&.active]:text-primary">Contact</NavLink>
            <NavLink to="/blog" className="text-[15px] font-medium text-gray-800 transition-colors duration-200 relative hover:text-primary [&.active]:text-primary">Blog</NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <button className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-transparent text-gray-800 hover:bg-gray-100 hover:text-primary transition-all duration-200" onClick={() => setIsSearchOpen(!isSearchOpen)} aria-label="Search">
              <Search size={20} />
            </button>

            <div className="relative" ref={userRef}>
              <button className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-transparent text-gray-800 hover:bg-gray-100 hover:text-primary transition-all duration-200" onClick={() => setIsUserOpen(!isUserOpen)} aria-label="User menu">
                <User size={20} />
              </button>
              {isUserOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[180px] py-2 z-[1001]">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 font-semibold text-primary border-b border-gray-200 mb-1">{user?.name}</div>
                      <Link to="/profile" className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-800 bg-transparent text-left transition-colors duration-200 hover:bg-gray-100 hover:text-primary" onClick={() => setIsUserOpen(false)}>
                        <UserRound size={16} /> Profile
                      </Link>
                      <Link to="/orders" className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-800 bg-transparent text-left transition-colors duration-200 hover:bg-gray-100 hover:text-primary" onClick={() => setIsUserOpen(false)}>
                        <Package size={16} /> Orders
                      </Link>
                      <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-800 bg-transparent text-left transition-colors duration-200 hover:bg-gray-100 hover:text-primary" onClick={() => { logout(); setIsUserOpen(false); }}>
                        <LogOut size={16} /> Logout
                      </button>
                    </>
                  ) : (
                    <Link to="/login" className="block w-full px-4 py-2.5 text-sm text-gray-800 bg-transparent text-left transition-colors duration-200 hover:bg-gray-100 hover:text-primary" onClick={() => setIsUserOpen(false)}>Login</Link>
                  )}
                </div>
              )}
            </div>

            <button className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-transparent text-gray-800 hover:bg-gray-100 hover:text-primary transition-all duration-200" onClick={() => setIsCartOpen(true)} aria-label="Shopping cart">
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="absolute top-1 right-1 bg-primary text-white text-[11px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">{cartCount}</span>}
            </button>

            {isMobileOpen && (
              <button className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-transparent text-gray-800" onClick={() => setIsMobileOpen(false)} aria-label="Close menu">
                <X size={24} />
              </button>
            )}
          </div>
        </div>

        {isSearchOpen && (
          <div className="border-t border-gray-200 py-3 bg-white">
            <div className="max-w-[1280px] mx-auto px-6">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary transition-colors duration-200"
              />
            </div>
          </div>
        )}
      </header>

      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-[2000] flex justify-start" onClick={() => setIsMobileOpen(false)}>
          <aside className="w-[280px] h-full bg-white p-6 flex flex-col gap-6 animate-[slideIn_0.3s_ease]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-extrabold text-primary tracking-widest">VIREVO</span>
              <button onClick={() => setIsMobileOpen(false)} aria-label="Close menu"><X size={24} /></button>
            </div>
            <nav className="flex flex-col gap-4">
              <NavLink to="/" end onClick={() => setIsMobileOpen(false)} className="text-base font-medium text-gray-800 py-2.5 border-b border-gray-200 transition-colors duration-200 hover:text-primary [&.active]:text-primary">Home</NavLink>
              <NavLink to="/shop" onClick={() => setIsMobileOpen(false)} className="text-base font-medium text-gray-800 py-2.5 border-b border-gray-200 transition-colors duration-200 hover:text-primary [&.active]:text-primary">Shop</NavLink>
              <NavLink to="/about" onClick={() => setIsMobileOpen(false)} className="text-base font-medium text-gray-800 py-2.5 border-b border-gray-200 transition-colors duration-200 hover:text-primary [&.active]:text-primary">About</NavLink>
              <NavLink to="/contact" onClick={() => setIsMobileOpen(false)} className="text-base font-medium text-gray-800 py-2.5 border-b border-gray-200 transition-colors duration-200 hover:text-primary [&.active]:text-primary">Contact</NavLink>
              <NavLink to="/blog" onClick={() => setIsMobileOpen(false)} className="text-base font-medium text-gray-800 py-2.5 border-b border-gray-200 transition-colors duration-200 hover:text-primary [&.active]:text-primary">Blog</NavLink>
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}

export default Navbar;
