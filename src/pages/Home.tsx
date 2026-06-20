import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronRight, ArrowRight, Star, MapPin, Camera, Calendar, Users, Coffee, Phone } from 'lucide-react';
import { supabase, isSupabaseConfigured, DUMMY_SERVICES, DUMMY_GALLERY, DUMMY_TESTIMONIALS, APP_SETTINGS } from '../lib/supabase';
import { useSupabaseData } from '../lib/useSupabaseData';
import type { ServiceItem, GalleryItem, Testimonial } from '../types';

export function Home() {
  const { services, gallery, testimonials, settings, loading } = useSupabaseData();
  const [formData, setFormData] = useState({ name: '', phone: '', eventType: '', eventDate: '', details: '' });
  const [formError, setFormError] = useState('');

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.eventType || !formData.eventDate || !formData.details) {
      setFormError('Please fill out all required fields.');
      return;
    }
    setFormError('');
    
    const text = `Hello Kumar Wedding & Events,\n\nName: ${formData.name}\nPhone: ${formData.phone}\nEvent Type: ${formData.eventType}\nEvent Date: ${formData.eventDate}\n\nEvent Details & Budget:\n${formData.details}\n\nPlease contact me regarding my event.`;
    window.open(`https://wa.me/917091395999?text=${encodeURIComponent(text)}`, '_blank');
  };

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-t-2 border-gold-500 animate-spin"></div>
    </div>;
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 z-0 opacity-60">
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/20 z-10"></div>
          <img 
            src={settings.hero_image || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80"} 
            alt="Luxury Wedding Setup" 
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="container relative z-20 mx-auto px-4 text-center mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="inline-flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-gold-500/30 mb-6"
          >
            <span className="text-gold-500 text-sm">⭐ 5.0</span>
            <span className="text-white/60 text-[10px] uppercase tracking-wider">29 Verified Reviews</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-serif text-5xl md:text-7xl lg:text-[100px] leading-[0.95] tracking-tight text-white mb-6 max-w-5xl mx-auto drop-shadow-2xl whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: settings.hero_heading.replace(/\n/g, '<br/>').replace(/Into Unforgettable/, '<span class="text-gold-500 italic font-serif">Into Unforgettable</span>') }}
          />

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md whitespace-pre-wrap"
          >
            {settings.hero_subheading}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a 
              href={`#contact`} 
              className="w-full sm:w-auto px-10 py-4 bg-gold-500 text-black text-xs uppercase tracking-[0.2em] font-bold hover:bg-white transition-colors duration-300 flex items-center justify-center"
            >
              Book Consultation
            </a>
            <a 
              href="#gallery" 
              className="w-full sm:w-auto border border-white/30 backdrop-blur-md px-10 py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-white/10 transition-colors flex items-center justify-center text-white"
            >
              View Portfolio
            </a>
          </motion.div>
        </div>
      </section>

      {/* Stats/Highlight Section */}
      <section className="py-12 bg-dark-800 border-y border-white/5 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
            {[
              { icon: Star, label: 'Rating', value: '5.0 ⭐', sub: '29 Reviews' },
              { icon: Calendar, label: 'Events', value: '100+', sub: 'Successfully Managed' },
              { icon: Users, label: 'Guest Capacity', value: '5k+', sub: 'Handling Capability' },
              { icon: Coffee, label: 'Services', value: '24/7', sub: 'Customer Support' },
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center px-4"
              >
                <div className="flex justify-center mb-3 text-gold-400">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-2xl md:text-3xl font-display font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-dark-900 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-[11px] uppercase tracking-[0.3em] text-gold-500 mb-6">Exclusive Services</h3>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-white">Premium Services</h2>
            <div className="w-24 h-[1px] bg-gold-500/50 mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative overflow-hidden bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={service.image_url} 
                    alt={service.title} 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent opacity-80"></div>
                </div>
                <div className="absolute bottom-0 left-0 w-full p-6 bg-black/60 backdrop-blur-md border-t border-white/5">
                  <h3 className="font-serif text-lg font-normal text-white mb-1 tracking-wide">{service.title}</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest line-clamp-2">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 bg-dark-800 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.3em] text-gold-500 mb-6">Portfolio</h3>
              <h2 className="font-serif text-4xl md:text-5xl font-normal text-white">Capturing Magic</h2>
            </div>
            <a href={APP_SETTINGS.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gold-500 hover:text-white transition-colors mt-6 md:mt-0 pb-2 border-b border-gold-500 hover:border-white">
              View Instagram <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {gallery.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
                className="break-inside-avoid group relative overflow-hidden cursor-pointer border border-white/5"
              >
                <img 
                  src={item.image_url} 
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 text-center backdrop-blur-md">
                  <div>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">
                      {item.category}
                    </span>
                    <h3 className="font-serif text-2xl text-white font-normal">{item.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-dark-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-[11px] uppercase tracking-[0.3em] text-gold-500 mb-6">Guest Testimony</h3>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-white mb-6">Client Stories</h2>
            <div className="flex justify-center items-center gap-2">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 text-gold-500 fill-gold-500" />)}
            </div>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mt-4">5.0 Average Rating / 29 Reviews</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white/[0.03] p-8 border-l-2 border-gold-500 relative"
              >
                <div className="relative z-10">
                  <p className="text-sm italic text-white/80 leading-relaxed mb-6">"{testimonial.review}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-[10px] text-gold-500 font-bold">
                      {testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2)}
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-semibold">{testimonial.name}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative overflow-hidden bg-dark-800">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gold-900/5 blur-[150px] pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto bg-black p-8 md:p-12 border border-white/5 shadow-2xl">
            <div className="text-center mb-10">
              <h3 className="text-[11px] uppercase tracking-[0.3em] text-gold-500 mb-6">Contact Us</h3>
              <h2 className="font-serif text-3xl md:text-5xl font-normal text-white mb-4">Let's Plan Your Perfect Day</h2>
              <p className="text-white/60 font-light">Reach out to us for a free consultation or budget estimation.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <a href={`tel:${APP_SETTINGS.phone.replace(/\s+/g, '')}`} className="flex items-center gap-4 p-4 rounded-xl bg-dark-800 border border-white/5 hover:border-gold-500/50 transition-colors group">
                  <div className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-dark-900 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-400 mb-1">Direct Call</h4>
                    <p className="text-white font-medium">{APP_SETTINGS.phone}</p>
                  </div>
                </a>
                
                <a href={APP_SETTINGS.whatsapp} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-dark-800 border border-white/5 hover:border-[#25D366]/50 transition-colors group">
                  <div className="w-12 h-12 bg-[#25D366]/10 rounded-full flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-400 mb-1">WhatsApp Chat</h4>
                    <p className="text-white font-medium">Instant Reply</p>
                  </div>
                </a>
                
                <a href={`https://maps.google.com/?q=${encodeURIComponent(APP_SETTINGS.address)}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-dark-800 border border-white/5 hover:border-blue-500/50 transition-colors group">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-400 mb-1">Our Office</h4>
                    <p className="text-white font-medium text-sm line-clamp-1">{APP_SETTINGS.address}</p>
                  </div>
                </a>
              </div>
              
              <div className="bg-dark-800 p-6 rounded-xl border border-white/5">
                <form className="space-y-4" onSubmit={handleInquirySubmit}>
                  {formError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs tracking-widest uppercase mb-4 text-center">
                      {formError}
                    </div>
                  )}
                  <div>
                    <input 
                      type="text" 
                      placeholder="Your Name *" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      required 
                      className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors" 
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input 
                      type="tel" 
                      placeholder="Phone *" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      required 
                      className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors" 
                    />
                    <input 
                      type="text" 
                      placeholder="Event Type *" 
                      value={formData.eventType}
                      onChange={e => setFormData({...formData, eventType: e.target.value})}
                      required
                      className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors" 
                    />
                  </div>
                  <div>
                    <input 
                      type="date" 
                      placeholder="Event Date *" 
                      value={formData.eventDate}
                      onChange={e => setFormData({...formData, eventDate: e.target.value})}
                      required
                      className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-3 text-white/70 focus:outline-none focus:border-gold-500 transition-colors" 
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                  <div>
                    <textarea 
                      placeholder="Event Details & Estimated Budget *" 
                      rows={3} 
                      value={formData.details}
                      onChange={e => setFormData({...formData, details: e.target.value})}
                      required
                      className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors"
                    ></textarea>
                  </div>
                  <button type="submit" className="w-full bg-gold-500 text-black text-xs uppercase tracking-[0.2em] font-bold py-4 px-4 hover:bg-white transition-colors">
                    Send Inquiry
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
