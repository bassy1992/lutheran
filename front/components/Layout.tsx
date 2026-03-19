
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
// Added MapPin, Phone, and Mail icons to fix missing names error
import { Menu, X, Cross, Church, MapPin, Phone, Mail } from 'lucide-react';
import { NAV_ITEMS, SOCIAL_LINKS } from '../constants';
import { churchService } from '../src/services/api/endpoints/church.service';
import { useLanguage } from '../src/contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';
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
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900 shadow-lg py-3' : 'bg-slate-900/95 py-5'}`}>
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
            <div className={`p-1.5 rounded-lg bg-blue-600 text-white transform group-hover:rotate-12 transition-transform`}>
              <Church size={24} />
            </div>
            <div>
              <span className="block font-bold leading-none text-xl text-white">TRINITY LUTHERAN</span>
              <span className="block text-[10px] tracking-[0.2em] font-medium text-blue-300">GHANA</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-semibold transition-colors uppercase tracking-wider ${
                  location.pathname === item.path 
                    ? 'text-blue-400'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <LanguageSelector />
            <Link 
              to="/donate" 
              className="px-6 py-2 rounded-full font-bold text-sm transition-all bg-blue-600 text-white hover:bg-blue-700"
            >
              GIVE NOW
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button className="lg:hidden p-2 text-current" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} className="text-white" /> : <Menu size={28} className="text-white" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-2xl py-6 flex flex-col items-center gap-6 animate-fadeIn">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={`text-lg font-bold uppercase ${location.pathname === item.path ? 'text-blue-700' : 'text-slate-600'}`}
              >
                {item.label}
              </Link>
            ))}
            <div className="w-full px-6">
              <LanguageSelector />
            </div>
            <Link 
              to="/donate" 
              onClick={closeMenu}
              className="bg-blue-700 text-white px-10 py-3 rounded-full font-bold w-[80%] text-center"
            >
              GIVE NOW
            </Link>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
        <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-slate-800 pb-16">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-700 text-white">
                <Church size={24} />
              </div>
              <span className="font-bold text-xl text-white">TRINITY LUTHERAN</span>
            </Link>
            <p className="text-slate-400 leading-relaxed">
              Spreading the grace and truth of Jesus Christ throughout the heart of Ghana. Join our community of faith.
            </p>
            <div className="flex gap-4">
              {churchInfo?.facebook_url && (
                <a href={churchInfo.facebook_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-blue-700 hover:text-white transition-all" title="Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              )}
              {churchInfo?.twitter_url && (
                <a href={churchInfo.twitter_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-blue-700 hover:text-white transition-all" title="Twitter">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 002.856-3.915 10 10 0 01-2.856.973 5 5 0 00-8.66 4.59 14.23 14.23 0 01-10.337-5.196 5 5 0 001.551 6.759 5 5 0 01-2.265-.567v.06a5 5 0 004.001 4.9 5 5 0 01-2.26.086 5 5 0 004.678 3.488 10.02 10.02 0 01-6.177 2.132c-.398 0-.79-.023-1.175-.067a14.201 14.201 0 007.713 2.262c9.256 0 14.336-7.662 14.336-14.322 0-.218-.005-.436-.015-.653a10.207 10.207 0 002.516-2.61z"/></svg>
                </a>
              )}
              {churchInfo?.instagram_url && (
                <a href={churchInfo.instagram_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-blue-700 hover:text-white transition-all" title="Instagram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>
                </a>
              )}
              {churchInfo?.youtube_url && (
                <a href={churchInfo.youtube_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-blue-700 hover:text-white transition-all" title="YouTube">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              )}
              {!churchInfo?.facebook_url && !churchInfo?.twitter_url && !churchInfo?.instagram_url && !churchInfo?.youtube_url && (
                SOCIAL_LINKS.map((link, idx) => (
                  <a key={idx} href={link.href} className="p-2 bg-slate-800 rounded-full hover:bg-blue-700 hover:text-white transition-all">
                    {link.icon}
                  </a>
                ))
              )}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-4">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="hover:text-blue-400 transition-colors">{item.label}</Link>
                </li>
              ))}
              <li><Link to="/donate" className="hover:text-blue-400 transition-colors">Donations</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider">Service Times</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between border-b border-slate-800 pb-2">
                <span>Sunday Worship</span>
                <span className="text-blue-400">8:00 AM</span>
              </li>
              <li className="flex justify-between border-b border-slate-800 pb-2">
                <span>Bible Study</span>
                <span className="text-blue-400">Wed 6:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-slate-800 pb-2">
                <span>Prayer Meeting</span>
                <span className="text-blue-400">Fri 7:00 PM</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="text-blue-500 shrink-0 w-5 h-5" />
                <span>{churchInfo?.address || 'P.O BOX CO 143, Cocoa Village'}, {churchInfo?.city || 'Tema'}, {churchInfo?.country || 'Ghana'}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="text-blue-500 shrink-0 w-5 h-5" />
                <div className="flex flex-col gap-1">
                  <span>{churchInfo?.phone || '+233 24 130 3374'}</span>
                  <span>+233 27 741 6250</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-blue-500 shrink-0 w-5 h-5" />
                <span>{churchInfo?.email || 'info@trinitylutheranghana.org'}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 mt-10 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Trinity Lutheran Church Ghana. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
