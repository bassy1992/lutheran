
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
// Added MapPin, Phone, and Mail icons to fix missing names error
import { Menu, X, Cross, Church, MapPin, Phone, Mail, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import { NAV_ITEMS, SOCIAL_LINKS } from '../constants';
import { churchService } from '../src/services/api/endpoints/church.service';
import { useLanguage } from '../src/contexts/LanguageContext';
import type { ChurchInfo } from '../src/types/models';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [churchInfo, setChurchInfo] = useState<ChurchInfo | null>(null);
  const location = useLocation();

  useEffect(() => {
    const fetchChurchInfo = async () => {
      try {
        const info = await churchService.getChurchInfo();
        setChurchInfo(info);
      } catch (error) {
        console.error('Failed to fetch church info:', error);
      }
    };
    fetchChurchInfo();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900 shadow-lg py-3' : 'bg-slate-900/95 py-4'}`}>
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group" onClick={closeMenu}>
            <img 
              src="/logo.jpeg" 
              alt="Trinity Lutheran Church" 
              className="h-11 w-11 object-contain transition-transform group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="p-1.5 rounded-lg bg-blue-600 text-white transform group-hover:rotate-12 transition-transform hidden">
              <Church size={24} />
            </div>
            <div className="hidden sm:block">
              <span className="block font-bold leading-tight text-lg text-white">TRINITY LUTHERAN CHURCH</span>
              <span className="block text-[9px] tracking-[0.25em] font-medium text-blue-300">TEMA</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 text-sm font-medium transition-all rounded-lg ${
                  location.pathname === item.path 
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link 
              to="/donate" 
              className="ml-2 px-5 py-2 rounded-lg font-semibold text-sm transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30"
            >
              Give
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-slate-900/98 backdrop-blur-sm border-t border-slate-800 shadow-2xl animate-fadeIn max-h-[calc(100vh-80px)] overflow-y-auto">
            <div className="container mx-auto px-4 py-4">
              {/* Main Navigation - Grid Layout */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMenu}
                    className={`px-3 py-3 rounded-lg text-sm font-medium transition-all text-center ${
                      location.pathname === item.path 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'bg-slate-800/50 text-slate-200 hover:bg-slate-800 active:scale-95'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              
              {/* Donate Button - Full Width */}
              <Link 
                to="/donate" 
                onClick={closeMenu}
                className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3.5 rounded-lg font-bold text-center hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg active:scale-95"
              >
                💝 Give Now
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer - Only show on home page */}
      {location.pathname === '/' && (
      <footer className="bg-slate-900 text-slate-300 pt-4 md:pt-8 pb-2 md:pb-4">
        <div className="container mx-auto px-4 md:px-8">
          
          {/* Mobile: Simplified single column layout */}
          <div className="md:hidden space-y-3 border-b border-slate-800 pb-3">
            {/* Logo & Social */}
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-1.5">
                <img 
                  src="/logo.jpeg" 
                  alt="Trinity Lutheran Church" 
                  className="h-5 w-5 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div>
                  <span className="block font-bold leading-tight text-[11px] text-white">TRINITY LUTHERAN</span>
                  <span className="block text-[6px] tracking-wider font-medium text-blue-300">TEMA</span>
                </div>
              </Link>
              <div className="flex gap-2">
                {churchInfo?.facebook_url && (
                  <a href={churchInfo.facebook_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-500 active:scale-95 transition-all" title="Facebook">
                    <Facebook className="w-5 h-5" fill="currentColor" />
                  </a>
                )}
                {churchInfo?.instagram_url && (
                  <a href={churchInfo.instagram_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-500 active:scale-95 transition-all" title="Instagram">
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {churchInfo?.youtube_url && (
                  <a href={churchInfo.youtube_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-red-500 active:scale-95 transition-all" title="YouTube">
                    <Youtube className="w-5 h-5" fill="currentColor" />
                  </a>
                )}
              </div>
            </div>
            
            {/* Quick Contact */}
            <div className="grid grid-cols-2 gap-2 text-[9px]">
              <div className="flex items-center gap-1">
                <Phone className="text-blue-500 w-2.5 h-2.5" />
                <span>{churchInfo?.phone || '+233 24 130 3374'}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="text-blue-500 w-2.5 h-2.5" />
                <span>{churchInfo?.city || 'Tema'}</span>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[9px]">
              {NAV_ITEMS.slice(0, 4).map((item) => (
                <Link key={item.path} to={item.path} className="hover:text-blue-400 transition-colors">{item.label}</Link>
              ))}
              <Link to="/donate" className="text-blue-400 font-semibold">Donate</Link>
            </div>
          </div>

          {/* Desktop: Full layout */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6 border-b border-slate-800 pb-6">
          <div className="space-y-2 md:space-y-3">
            <Link to="/" className="flex items-center gap-1.5 md:gap-2">
              <img 
                src="/logo.jpeg" 
                alt="Trinity Lutheran Church" 
                className="h-6 md:h-7 w-6 md:w-7 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="p-1.5 rounded-lg bg-blue-700 text-white hidden">
                <Church size={16} className="md:w-[18px] md:h-[18px]" />
              </div>
              <div>
                <span className="block font-bold leading-tight text-xs md:text-sm text-white">TRINITY LUTHERAN CHURCH</span>
                <span className="block text-[6px] md:text-[7px] tracking-[0.1em] md:tracking-[0.15em] font-medium text-blue-300">TEMA</span>
              </div>
            </Link>
            <p className="text-slate-400 leading-snug text-[10px] md:text-xs">
              Spreading the grace and truth of Jesus Christ throughout Ghana.
            </p>
            <div className="flex gap-2 md:gap-3">
              {churchInfo?.facebook_url && (
                <a href={churchInfo.facebook_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-500 transition-all" title="Facebook">
                  <Facebook className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" />
                </a>
              )}
              {churchInfo?.twitter_url && (
                <a href={churchInfo.twitter_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-400 transition-all" title="Twitter">
                  <Twitter className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" />
                </a>
              )}
              {churchInfo?.instagram_url && (
                <a href={churchInfo.instagram_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-500 transition-all" title="Instagram">
                  <Instagram className="w-5 h-5 md:w-6 md:h-6" />
                </a>
              )}
              {churchInfo?.youtube_url && (
                <a href={churchInfo.youtube_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-red-500 transition-all" title="YouTube">
                  <Youtube className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" />
                </a>
              )}
              {!churchInfo?.facebook_url && !churchInfo?.twitter_url && !churchInfo?.instagram_url && !churchInfo?.youtube_url && (
                SOCIAL_LINKS.map((link, idx) => (
                  <a key={idx} href={link.href} className="text-slate-400 hover:text-blue-500 transition-all">
                    {link.icon}
                  </a>
                ))
              )}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-2 md:mb-3 uppercase tracking-wider text-[10px] md:text-xs">Quick Links</h4>
            <ul className="space-y-1 md:space-y-1.5 text-[10px] md:text-xs">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="hover:text-blue-400 transition-colors">{item.label}</Link>
                </li>
              ))}
              <li><Link to="/donate" className="hover:text-blue-400 transition-colors">Donations</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-2 md:mb-3 uppercase tracking-wider text-[10px] md:text-xs">Service Times</h4>
            <ul className="space-y-1 md:space-y-1.5 text-[10px] md:text-xs">
              <li className="flex justify-between border-b border-slate-800 pb-1 md:pb-1.5">
                <span>Sunday Worship</span>
                <span className="text-blue-400">8:00 AM</span>
              </li>
              <li className="flex justify-between border-b border-slate-800 pb-1 md:pb-1.5">
                <span>Bible Study</span>
                <span className="text-blue-400">Thu 6:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-slate-800 pb-1 md:pb-1.5">
                <span>Prayer Meeting</span>
                <span className="text-blue-400">Fri 7:00 PM</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-2 md:mb-3 uppercase tracking-wider text-[10px] md:text-xs">Contact Us</h4>
            <ul className="space-y-1.5 md:space-y-2 text-[10px] md:text-xs">
              <li className="flex items-start gap-1.5 md:gap-2">
                <MapPin className="text-blue-500 shrink-0 w-3 h-3 md:w-4 md:h-4 mt-0.5" />
                <span>{churchInfo?.address || 'P.O BOX CO 143, Cocoa Village'}, {churchInfo?.city || 'Tema'}</span>
              </li>
              <li className="flex items-start gap-1.5 md:gap-2">
                <Phone className="text-blue-500 shrink-0 w-3 h-3 md:w-4 md:h-4 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span>{churchInfo?.phone || '+233 24 130 3374'}</span>
                  <span>+233 27 741 6250</span>
                </div>
              </li>
              <li className="flex items-center gap-1.5 md:gap-2">
                <Mail className="text-blue-500 shrink-0 w-3 h-3 md:w-4 md:h-4" />
                <span className="break-all">{churchInfo?.email || 'info@trinitylutheranghana.org'}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 mt-2 md:mt-4 flex flex-col md:flex-row justify-between items-center text-[8px] md:text-[10px] text-slate-500 gap-1 md:gap-2">
          <p>© {new Date().getFullYear()} Trinity Lutheran Church Ghana</p>
          <div className="flex gap-2 md:gap-3">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
          </div>
        </div>
        </div>
      </footer>
      )}
    </div>
  );
};

export default Layout;
