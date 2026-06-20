import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Instagram, Youtube, Settings } from 'lucide-react';
import { APP_SETTINGS } from '../lib/supabase';
import { useSupabaseData } from '../lib/useSupabaseData';
import { Link } from 'react-router-dom';

export function Footer() {
  const { settings } = useSupabaseData();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold tracking-[0.2em] uppercase text-gold-500 mb-6">
              KUMAR
            </h2>
            <p className="text-white/40 mb-6 font-light leading-relaxed text-sm">
              Turning your dreams into unforgettable celebrations. We are Ranchi's premium choice for luxury event planning and management.
            </p>
            <div className="flex gap-4">
              <a href={settings.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-gray-300 hover:bg-gold-500 hover:text-dark-900 hover:border-gold-500 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={settings.youtube} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-gray-300 hover:bg-gold-500 hover:text-dark-900 hover:border-gold-500 transition-all">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.3em] text-gold-500 mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {['Home', 'Services', 'Gallery', 'Testimonials', 'Contact'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="text-white/60 hover:text-gold-500 transition-colors text-sm font-light flex items-center gap-2">
                    <span className="text-gold-500 text-xs">→</span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.3em] text-gold-500 mb-6">Premium Services</h3>
            <ul className="space-y-4">
              {['Wedding Planning', 'Corporate Events', 'Stage Decoration', 'Catering Services', 'Birthday Parties'].map((item) => (
                <li key={item}>
                  <span className="text-white/60 text-sm font-light flex items-center gap-2">
                    <span className="text-gold-500 text-xs">→</span>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.3em] text-gold-500 mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <MapPin className="w-4 h-4 text-gold-500/50 shrink-0 mt-1" />
                <span className="text-white/60 text-sm font-light">{settings.address}</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="w-4 h-4 text-gold-500/50 shrink-0" />
                <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="text-white/60 hover:text-gold-500 transition-colors text-sm font-light">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-4">
                <Clock className="w-4 h-4 text-gold-500/50 shrink-0" />
                <span className="text-white/60 text-sm font-light">Open 24 Hours</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Kumar Wedding & Events. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <button onClick={scrollToTop} className="text-sm text-gray-500 hover:text-gold-400 transition-colors">
              Back to top
            </button>
            <Link to="/admin" className="text-gray-600 hover:text-white transition-colors">
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
