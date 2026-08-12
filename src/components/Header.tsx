import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, UserCheck, Calculator, MessageCircle, MapPin } from 'lucide-react';
import { HeaderSocialIcons } from './SocialIcons';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About us', path: '/about-us' },
    { name: 'Products', path: '/loans' },
    { name: 'Programs', path: '/programs' },
    { name: 'Sponsorship', path: '/sponsorship' },
    { name: 'Beneficiaries', path: '/beneficiaries' },
    { name: 'Volunteers', path: '/volunteers' },
    { name: 'Partners', path: '/partners' },
    { name: 'Careers', path: '/careers' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact us', path: '/contact' },
    { name: 'Blog', path: '/blog' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
      {/* Top Bar */}
      <div className="bg-[#074504] text-white text-xs py-2 px-4 border-b border-[#053203]">
        <div className="max-w-[1536px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Contact Details & Social Icons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <a 
              href="tel:+254705759365" 
              className="flex items-center gap-1.5 hover:text-[#C0991B] font-bold transition-colors text-[11px] sm:text-xs"
            >
              <Phone className="w-3.5 h-3.5 text-[#C0991B]" />
              <span>0705 759 365</span>
            </a>
            <span className="text-emerald-800/80 hidden sm:inline">|</span>
            <a 
              href="mailto:info@neemaheep.com" 
              className="flex items-center gap-1.5 hover:text-[#C0991B] font-bold transition-colors text-[11px] sm:text-xs"
            >
              <Mail className="w-3.5 h-3.5 text-[#C0991B]" />
              <span>info@neemaheep.com</span>
            </a>
            <span className="text-emerald-800/80 hidden lg:inline">|</span>
            {/* Address placed before social media icons */}
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-bold text-[#C0991B]">
              <MapPin className="w-3.5 h-3.5 text-[#C0991B] shrink-0" />
              <span>Neema Plaza, 3rd Floor, Mama Ngina Street, Embu</span>
            </div>
            <span className="text-emerald-800/80 hidden md:inline">|</span>
            <div className="hidden md:flex items-center gap-2">
              <HeaderSocialIcons />
            </div>
          </div>

          {/* Right Side: Portal Login & Loan Eligibility */}
          <div className="flex items-center gap-3 text-[11px] sm:text-xs font-bold">
            <Link 
              to="/pre-qualification" 
              className="text-[#C0991B] hover:text-amber-300 font-extrabold transition-colors hidden sm:flex items-center gap-1.5"
            >
              <Calculator className="w-3.5 h-3.5 text-[#C0991B]" />
              <span className="text-[#C0991B]">Check Loan Eligibility</span>
            </Link>
            <span className="text-emerald-800/80 hidden sm:inline">|</span>
            <Link 
              to="/portal" 
              className="bg-emerald-950/80 hover:bg-[#C0991B] hover:text-[#074504] text-white px-2.5 py-1 rounded-md border border-[#C0991B]/40 transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#C0991B]" />
              <span>Portal Login</span>
            </Link>
          </div>
        </div>
      </div>
      {/* Main Header Nav */}
      <div className="max-w-[1536px] mx-auto px-2 sm:px-3 lg:px-4 h-16 flex items-center justify-between gap-1">
        {/* Desktop Header View */}
        <div className="hidden lg:flex items-center justify-between w-full gap-2">
          {/* Logo on Left with Brand Name */}
          <Link to="/" className="flex items-center gap-2 group shrink-0 pr-1">
            <img 
              src="/header_logo.jpeg" 
              alt="NEEMA HEEP Microfinance Logo" 
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.triedFallback) {
                  target.dataset.triedFallback = 'true';
                  target.src = "https://lh3.googleusercontent.com/d/1AjKteb0c7SG53qAtVjVFrjMjRxkecOFF";
                }
              }}
              className="h-9 sm:h-10 lg:h-[38px] xl:h-[42px] w-auto object-contain rounded-md shadow-2xs group-hover:scale-102 transition-transform" 
            />
            <div className="flex flex-col leading-tight">
              <span className="font-black text-[12px] xl:text-[14px] text-[#074504] tracking-tight uppercase group-hover:text-[#053203] transition-colors whitespace-nowrap">
                Neema Heep
              </span>
              <span className="text-[8.5px] xl:text-[9.5px] font-extrabold text-[#C0991B] tracking-wider uppercase whitespace-nowrap">
                Micro Finance
              </span>
            </div>
          </Link>

          {/* Primary Nav Links evenly distributed across header width */}
          <nav className="flex-1 flex items-center justify-between gap-0.5 xl:gap-1.5 px-2 xl:px-4 min-w-0">
            {navLinks.map((link, idx) => (
              <React.Fragment key={link.path}>
                <Link
                  to={link.path}
                  className={`flex-1 text-center text-[10.5px] lg:text-[11px] xl:text-[12px] 2xl:text-[13px] font-extrabold whitespace-nowrap transition-all px-1 py-1 rounded-md ${
                    isActive(link.path)
                      ? 'text-[#074504] bg-[#074504]/5 border-b-2 border-[#C0991B]'
                      : 'text-gray-800 hover:text-[#074504] hover:bg-gray-100/80'
                  }`}
                >
                  {link.name}
                </Link>
                {idx < navLinks.length - 1 && (
                  <span className="h-3 w-[1px] bg-[#C0991B]/35 shrink-0 self-center" aria-hidden="true" />
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* CTAs on Right */}
          <div className="flex items-center gap-1.5 xl:gap-2 shrink-0">
            <Link
              to="/join"
              className="bg-[#074504] hover:bg-[#0a5c06] text-white text-[10px] lg:text-[10.5px] xl:text-[11.5px] font-extrabold uppercase tracking-wider px-2 xl:px-3 py-1.5 rounded-lg shadow-xs transition-all flex items-center gap-1 border border-[#C0991B]/40 whitespace-nowrap shrink-0 hover:scale-102"
            >
              <UserCheck className="w-3 h-3 xl:w-3.5 xl:h-3.5 text-[#C0991B]" />
              <span>Join us Now</span>
            </Link>
            <a
              href="https://wa.me/254705759365"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white text-[10px] lg:text-[10.5px] xl:text-[11.5px] font-extrabold uppercase tracking-wider px-2 xl:px-3 py-1.5 rounded-lg shadow-xs transition-all flex items-center gap-1 whitespace-nowrap shrink-0 hover:scale-102"
            >
              <MessageCircle className="w-3 h-3 xl:w-3.5 xl:h-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Mobile Header View */}
        <div className="flex items-center justify-between w-full lg:hidden">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <img 
              src="/header_logo.jpeg" 
              alt="NEEMA HEEP Microfinance Logo" 
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.triedFallback) {
                  target.dataset.triedFallback = 'true';
                  target.src = "https://lh3.googleusercontent.com/d/1AjKteb0c7SG53qAtVjVFrjMjRxkecOFF";
                }
              }}
              className="h-9 w-auto object-contain rounded-md shadow-2xs" 
            />
            <div className="flex flex-col leading-tight">
              <span className="font-black text-xs text-[#074504] tracking-tight uppercase">
                Neema Heep
              </span>
              <span className="text-[8.5px] font-extrabold text-[#C0991B] tracking-wider uppercase">
                Micro Finance
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-700 hover:text-[#074504] rounded-lg focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-bold ${
                isActive(link.path)
                  ? 'bg-emerald-50 text-[#074504]'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            <Link
              to="/join"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-4 py-2.5 text-xs font-extrabold text-white bg-[#074504] hover:bg-[#0a5c06] rounded-lg shadow-xs flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-[#C0991B]" />
              <span>Join us Now</span>
            </Link>
            <a
              href="https://wa.me/254705759365"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-4 py-2.5 text-xs font-extrabold text-white bg-[#25D366] hover:bg-[#20bd5a] rounded-lg shadow-xs flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp Chat</span>
            </a>
            <Link
              to="/pre-qualification"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-4 py-2.5 text-xs font-black text-[#074504] bg-[#C0991B] hover:bg-amber-400 rounded-lg shadow-xs border border-[#C0991B] transition-colors flex items-center justify-center gap-2"
            >
              <Calculator className="w-4 h-4 text-[#074504]" />
              <span>Check Loan Eligibility</span>
            </Link>
            <Link
              to="/portal"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-4 py-2.5 text-xs font-bold text-white bg-[#074504] rounded-lg shadow-xs flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-[#C0991B]" />
              <span>Portal Login</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
