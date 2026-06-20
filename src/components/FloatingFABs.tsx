import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, MapPin, Instagram, Youtube, Settings, Lock } from 'lucide-react';
import { APP_SETTINGS } from '../lib/supabase';
import { useSupabaseData } from '../lib/useSupabaseData';
import { Link } from 'react-router-dom';

// Custom icons
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

const JustdialIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11.954 1.25c-5.918 0-10.704 4.786-10.704 10.704 0 5.918 4.786 10.704 10.704 10.704 5.918 0 10.704-4.786 10.704-10.704 0-5.918-4.786-10.704-10.704-10.704zm3.844 14.161h-2.1v-6.38h2.1v6.38zm-1.05-7.399c-.643 0-1.164-.521-1.164-1.164 0-.643.521-1.164 1.164-1.164.643 0 1.164.521 1.164 1.164 0 .643-.521 1.164-1.164 1.164zm-3.6 7.399h-2.1v-8.497h2.1v8.497zm-1.05-9.516c-.643 0-1.164-.521-1.164-1.164 0-.643.521-1.164 1.164-1.164.643 0 1.164.521 1.164 1.164 0 .643-.521 1.164-1.164 1.164z"/>
  </svg>
);

export function FloatingFABs() {
  const { settings } = useSupabaseData();
  const actions = [
    { name: 'WhatsApp', icon: WhatsAppIcon, href: settings.whatsapp, color: 'bg-[#25D366] text-white', hover: 'hover:bg-[#128C7E]' },
    { name: 'Call Us', icon: Phone, href: `tel:${settings.phone.replace(/\s+/g, '')}`, color: 'bg-gold-500 text-dark-900', hover: 'hover:bg-gold-400' },
    { name: 'Directions', icon: MapPin, href: `https://maps.google.com/?q=${encodeURIComponent(settings.address)}`, color: 'bg-blue-600 text-white', hover: 'hover:bg-blue-500' }
  ];

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: settings.instagram, color: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white' },
    { name: 'YouTube', icon: Youtube, href: settings.youtube, color: 'bg-[#FF0000] text-white' },
    { name: 'Justdial', icon: JustdialIcon, href: settings.justdial, color: 'bg-[#FF6600] text-white' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      <AnimatePresence>
        <div className="flex flex-col gap-3">
          {socialLinks.map((item, idx) => (
            <motion.a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${item.color}`}
              title={item.name}
            >
              <item.icon className="w-5 h-5" />
            </motion.a>
          ))}
          {actions.map((item, idx) => (
            <motion.a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (socialLinks.length + idx) * 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl ${item.color} ${item.hover} transition-colors`}
              title={item.name}
            >
              <item.icon className="w-6 h-6" />
            </motion.a>
          ))}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (socialLinks.length + actions.length) * 0.1 }}
          >
            <Link
              to="/admin"
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl bg-black border border-white/20 text-white/50 hover:text-white hover:border-white/50 transition-colors"
              title="Admin Access"
            >
              <Lock className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </AnimatePresence>
    </div>
  );
}
