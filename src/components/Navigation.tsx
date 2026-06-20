import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Phone, UserCog } from 'lucide-react';
import { APP_SETTINGS } from '../lib/supabase';
import { useSupabaseData } from '../lib/useSupabaseData';
import { Link, useLocation } from 'react-router-dom';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const { settings } = useSupabaseData();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    setIsAdmin(localStorage.getItem('admin_auth') === 'true');
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/#services' },
    { name: 'Gallery', href: '/#gallery' },
    { name: 'Testimonials', href: '/#testimonials' },
    { name: 'Contact', href: '/#contact' },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-md shadow-lg py-4 border-b border-white/5' : 'bg-gradient-to-bottom from-black/80 to-transparent py-8'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-serif tracking-[0.15em] uppercase text-gold-500 hidden md:block">
              Kumar Wedding <span className="text-white/70">&amp;</span> Events
            </h1>
            <h1 className="text-2xl font-serif tracking-[0.2em] uppercase text-gold-500 md:hidden">
              KWE
            </h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith('/#')) {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }
                }}
                className="text-[11px] uppercase tracking-[0.2em] font-medium text-white/70 hover:text-gold-500 transition-colors"
              >
                {link.name}
              </a>
            ))}
            {isAdmin ? (
              <Link to="/admin/dashboard" className="text-[11px] flex items-center gap-2 uppercase tracking-[0.2em] font-medium text-gold-500 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-full border border-gold-500/30">
                <UserCog className="w-4 h-4" /> Admin Dashboard
              </Link>
            ) : (
              <Link to="/admin" className="text-[11px] flex items-center gap-2 uppercase tracking-[0.2em] font-medium text-white/50 hover:text-gold-500 transition-colors bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:border-gold-500/30">
                <UserCog className="w-4 h-4" /> Admin Login
              </Link>
            )}
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 bg-gold-500 hover:bg-white text-black px-5 py-3 rounded-none text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300"
            >
              <Phone className="w-3 h-3" />
              <span>Call Now</span>
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-gold-400" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-900/95 backdrop-blur-xl border-t border-white/10"
          >
            <div className="flex flex-col px-4 py-6 gap-4">
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    if (link.href.startsWith('/#')) {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }
                  }}
                  className="text-lg font-display text-gray-200 hover:text-gold-400 py-2 border-b border-white/5"
                >
                  {link.name}
                </a>
              ))}
              {isAdmin ? (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-display text-gold-500 py-2 border-b border-white/5 flex items-center gap-2"
                >
                  <UserCog className="w-5 h-5" /> Admin Dashboard
                </Link>
              ) : (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-display text-white/50 hover:text-gold-500 py-2 border-b border-white/5 flex items-center gap-2"
                >
                  <UserCog className="w-5 h-5" /> Admin Login
                </Link>
              )}
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-2 bg-gold-500 text-dark-900 px-5 py-3 rounded-md font-semibold mt-4"
              >
                <Phone className="w-5 h-5" />
                <span>Call {settings.phone}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
