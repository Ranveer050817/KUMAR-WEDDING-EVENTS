import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Image as ImageIcon, Settings, Users, LayoutDashboard, Plus, Trash2, Home, MessageSquare, Edit, Database, Menu, X, Upload } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useSupabaseData } from '../lib/useSupabaseData';
import type { GalleryItem, ServiceItem, Testimonial } from '../types';
import { Toaster, toast } from 'react-hot-toast';

const Modal = ({ isOpen, onClose, title, children }: any) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-dark-900 border border-white/10 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif text-xl">{title}</h3>
            <button onClick={onClose} className="text-white/50 hover:text-white transition-colors"><X className="w-5 h-5"/></button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview'|'gallery'|'services'|'testimonials'|'settings'>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const { gallery, setGallery, services, setServices, testimonials, setTestimonials, settings, setSettings, loading } = useSupabaseData();

  type ModalState = { isOpen: boolean, mode: 'add' | 'edit', data: any };
  const [photoModal, setPhotoModal] = useState<ModalState>({ isOpen: false, mode: 'add', data: null });
  const [serviceModal, setServiceModal] = useState<ModalState>({ isOpen: false, mode: 'add', data: null });
  const [testimonialModal, setTestimonialModal] = useState<ModalState>({ isOpen: false, mode: 'add', data: null });

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth');
    if (!isAuth) navigate('/admin');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    navigate('/');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'gallery', label: 'Gallery & Albums', icon: ImageIcon },
    { id: 'services', label: 'Services', icon: Users },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'settings', label: 'Business Info', icon: Settings },
  ] as const;

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;
    const { error: uploadError } = await supabase.storage.from('wedding-gallery').upload(filePath, file);
    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      if (uploadError.message.toLowerCase().includes('bucket not found') || uploadError.message.includes('not found')) {
        throw new Error("Storage bucket 'wedding-gallery' not found. Please create it in Supabase and set it to Public.");
      }
      throw uploadError;
    }
    const { data } = supabase.storage.from('wedding-gallery').getPublicUrl(filePath);
    console.log('Generated public URL:', data.publicUrl);
    return data.publicUrl;
  };

  // Gallery CRUD
  const handleSavePhoto = async ({ title, category, file }: any) => {
    setIsSaving(true);
    try {
      if (photoModal.mode === 'add') {
        let image_url = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop';
        if (file && isSupabaseConfigured) {
          image_url = await uploadImage(file);
        }
        const newItem = { id: Date.now().toString(), title, category, image_url, created_at: new Date().toISOString() };
        if (isSupabaseConfigured) {
          const { data, error } = await supabase.from('gallery').insert([{ title, category, image_url }]).select().single();
          if (error) throw error;
          setGallery([data, ...gallery]);
        } else {
          setGallery([newItem, ...gallery]);
        }
        toast.success("Photo added successfully!");
      } else {
        let image_url = photoModal.data.image_url;
        if (file && isSupabaseConfigured) {
          image_url = await uploadImage(file);
        }
        if (isSupabaseConfigured) {
          const { error } = await supabase.from('gallery').update({ title, category, image_url }).eq('id', photoModal.data.id);
          if (error) throw error;
        }
        setGallery(gallery.map(g => g.id === photoModal.data.id ? { ...g, title, category, image_url } : g));
        toast.success("Photo updated successfully!");
      }
      setPhotoModal({ isOpen: false, mode: 'add', data: null });
    } catch (e: any) {
      toast.error(e.message || "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePhoto = async (id: string, imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;
    setIsSaving(true);
    try {
      if (isSupabaseConfigured) {
        const pathMatch = imageUrl.match(/wedding-gallery\/(.+)$/);
        if (pathMatch) await supabase.storage.from('wedding-gallery').remove([pathMatch[1]]);
        const { error } = await supabase.from('gallery').delete().eq('id', id);
        if (error) throw error;
      }
      setGallery(gallery.filter(g => g.id !== id));
      toast.success('Photo deleted successfully');
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete photo');
    } finally {
      setIsSaving(false);
    }
  };

  // Services CRUD
  const handleSaveService = async ({ title, description, file }: any) => {
    setIsSaving(true);
    try {
      if (serviceModal.mode === 'add') {
        let image_url = 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop';
        if (file && isSupabaseConfigured) image_url = await uploadImage(file);
        const newItem = { id: Date.now().toString(), title, description, image_url, icon: 'star' };
        
        if (isSupabaseConfigured) {
          const { data, error } = await supabase.from('services').insert([{ title, description, image_url, icon: 'star' }]).select().single();
          if (error) throw error;
          setServices([...services, data]);
        } else {
          setServices([...services, newItem]);
        }
        toast.success("Service added successfully!");
      } else {
        let image_url = serviceModal.data.image_url;
        if (file && isSupabaseConfigured) image_url = await uploadImage(file);
        
        if (isSupabaseConfigured) {
          const { error } = await supabase.from('services').update({ title, description, image_url }).eq('id', serviceModal.data.id);
          if (error) throw error;
        }
        setServices(services.map(s => s.id === serviceModal.data.id ? { ...s, title, description, image_url } : s));
        toast.success("Service updated successfully!");
      }
      setServiceModal({ isOpen: false, mode: 'add', data: null });
    } catch (e: any) {
      toast.error(e.message || "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteService = async (id: string, imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    setIsSaving(true);
    try {
      if (isSupabaseConfigured) {
        const pathMatch = imageUrl.match(/wedding-gallery\/(.+)$/);
        if (pathMatch) await supabase.storage.from('wedding-gallery').remove([pathMatch[1]]);
        const { error } = await supabase.from('services').delete().eq('id', id);
        if (error) throw error;
      }
      setServices(services.filter(s => s.id !== id));
      toast.success('Service deleted successfully');
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete service');
    } finally {
      setIsSaving(false);
    }
  };

  // Testimonial CRUD
  const handleSaveTestimonial = async ({ name, review, rating }: any) => {
    setIsSaving(true);
    try {
      if (testimonialModal.mode === 'add') {
        const newItem = { id: Date.now().toString(), name, review, rating, date: new Date().toISOString() };
        if (isSupabaseConfigured) {
          const { data, error } = await supabase.from('testimonials').insert([{ name, review, rating }]).select().single();
          if (error) throw error;
          setTestimonials([...testimonials, data]);
        } else {
          setTestimonials([...testimonials, newItem]);
        }
        toast.success("Testimonial added successfully!");
      } else {
        if (isSupabaseConfigured) {
          const { error } = await supabase.from('testimonials').update({ name, review, rating }).eq('id', testimonialModal.data.id);
          if (error) throw error;
        }
        setTestimonials(testimonials.map(t => t.id === testimonialModal.data.id ? { ...t, name, review, rating } : t));
        toast.success("Testimonial updated successfully!");
      }
      setTestimonialModal({ isOpen: false, mode: 'add', data: null });
    } catch (e: any) {
      toast.error(e.message || "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    setIsSaving(true);
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('testimonials').delete().eq('id', id);
        if (error) throw error;
      }
      setTestimonials(testimonials.filter(t => t.id !== id));
      toast.success('Testimonial deleted successfully');
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete testimonial');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      if (isSupabaseConfigured) {
        // Upsert all modified keys
        const entries = Object.entries(settings);
        for (const [key, value] of entries) {
           const { error } = await supabase.from('settings').upsert({ key, value });
           if (error) throw error;
        }
        toast.success("Settings saved to database!");
      } else {
        toast.success("Settings saved locally! (Preview Mode)");
      }
    } catch (e: any) {
       toast.error(e.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px' } }} />

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-dark-900 sticky top-0 z-50">
        <h1 className="text-xl font-bold tracking-[0.2em] uppercase text-gold-500">Admin</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-white hover:text-gold-500 transition-colors">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-dark-900 border-r border-white/5 flex flex-col z-40 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="hidden md:block p-8 border-b border-white/5">
          <h1 className="text-xl font-bold tracking-[0.2em] uppercase text-gold-500 justify-center">ADMIN PANEL</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-16 md:mt-0 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-4 uppercase tracking-[0.1em] text-xs font-semibold transition-all ${
                activeTab === tab.id 
                  ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-4 text-xs tracking-widest uppercase text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <Home className="w-4 h-4 shrink-0" />
            <span className="font-semibold">View Site</span>
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-4 text-xs tracking-widest uppercase text-red-500 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20">
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="font-semibold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />}

      {/* Main Content */}
      <main className="flex-1 min-w-0 h-screen overflow-y-auto bg-[#050505]">
        <div className="p-4 sm:p-8 md:p-12 max-w-6xl mx-auto">
          {!isSupabaseConfigured && (
            <div className="mb-8 p-4 bg-gold-500/10 border border-gold-500/30 text-gold-500 text-xs tracking-widest uppercase flex items-center gap-2">
              <strong className="block">Preview Mode Active:</strong>
              Data modifications won't be saved until Supabase keys are connected.
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <h2 className="font-serif text-3xl md:text-4xl font-normal mb-6 md:mb-8 break-words">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>

              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  <div className="bg-white/[0.03] p-6 md:p-8 border border-white/5">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4">Total Photos</div>
                    <div className="text-5xl font-serif font-normal text-white">{gallery.length}</div>
                  </div>
                  <div className="bg-white/[0.03] p-8 border border-white/5">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4">Total Services</div>
                    <div className="text-5xl font-serif font-normal text-white">{services.length}</div>
                  </div>
                  <div className="bg-white/[0.03] p-8 border border-white/5">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4">Testimonials</div>
                    <div className="text-5xl font-serif font-normal text-white">{testimonials.length}</div>
                  </div>
                </div>
              )}

              {activeTab === 'gallery' && (
                <div className="w-full">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8 pb-4 border-b border-white/5">
                    <p className="text-white/60 text-sm font-light">Manage your portfolio images and albums here. Uses `wedding-gallery` bucket.</p>
                    <button onClick={() => setPhotoModal({ isOpen: true, mode: 'add', data: null })} className="bg-gold-500 text-black px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 hover:bg-white transition-colors w-full sm:w-auto">
                      <Plus className="w-4 h-4" /> Upload Photo
                    </button>
                  </div>
                  <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {gallery.map(item => (
                      <div key={item.id} className="relative group overflow-hidden bg-white/[0.03] border border-white/5 flex flex-col">
                        <div className="relative">
                          <img src={item.image_url} alt={item.title} className="w-full h-40 sm:h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-md">
                            <button onClick={() => setPhotoModal({ isOpen: true, mode: 'edit', data: item })} className="text-white hover:text-black hover:bg-white p-3 transition-colors border border-white rounded-full bg-black/50">
                              <Edit className="w-4 sm:w-5 h-4 sm:h-5" />
                            </button>
                            <button onClick={() => handleDeletePhoto(item.id, item.image_url)} className="text-red-500 hover:text-white hover:bg-red-500 p-3 transition-colors border border-red-500 rounded-full bg-black/50">
                              <Trash2 className="w-4 sm:w-5 h-4 sm:h-5" />
                            </button>
                          </div>
                        </div>
                        <div className="p-4 border-t border-white/5 flex-1 break-words">
                          <div className="font-serif text-white text-base md:text-lg mb-1 line-clamp-2">{item.title}</div>
                          <div className="text-[10px] uppercase tracking-[0.2em] text-gold-500">{item.category}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'services' && (
                <div className="w-full">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8 pb-4 border-b border-white/5">
                    <p className="text-white/60 text-sm font-light">Manage core services offered.</p>
                    <button onClick={() => setServiceModal({ isOpen: true, mode: 'add', data: null })} className="bg-gold-500 text-black px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 hover:bg-white transition-colors w-full sm:w-auto">
                      <Plus className="w-4 h-4" /> Add Service
                    </button>
                  </div>
                  <div className="space-y-4">
                    {services.map(service => (
                      <div key={service.id} className="bg-white/[0.03] p-4 md:p-6 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full">
                          <img src={service.image_url} className="w-full sm:w-20 h-32 sm:h-20 flex-shrink-0 object-cover opacity-80 border border-white/10" alt="" />
                          <div className="flex-1 min-w-0 pr-4 break-words">
                            <h3 className="font-serif text-xl text-white mb-2">{service.title}</h3>
                            <p className="text-white/40 text-sm font-light line-clamp-2">{service.description}</p>
                          </div>
                        </div>
                        <div className="flex flex-row md:flex-col gap-2 justify-end sm:justify-start flex-shrink-0">
                          <button onClick={() => setServiceModal({ isOpen: true, mode: 'edit', data: service })} className="bg-white/5 md:bg-transparent text-white/40 hover:text-white transition-colors p-3 md:p-2 rounded-md md:rounded-none">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDeleteService(service.id, service.image_url)} className="bg-white/5 md:bg-transparent text-white/20 hover:text-red-500 transition-colors p-3 md:p-2 rounded-md md:rounded-none">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'testimonials' && (
                <div className="w-full">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8 pb-4 border-b border-white/5">
                    <p className="text-white/60 text-sm font-light">Manage client stories and testimonials.</p>
                    <button onClick={() => setTestimonialModal({ isOpen: true, mode: 'add', data: null })} className="bg-gold-500 text-black px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 hover:bg-white transition-colors w-full sm:w-auto">
                      <Plus className="w-4 h-4" /> Add Testimonial
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {testimonials.map(testimonial => (
                      <div key={testimonial.id} className="bg-white/[0.03] p-6 md:p-8 border-l-2 border-gold-500 relative flex flex-col justify-between">
                        <p className="text-sm italic text-white/80 leading-relaxed mb-6 break-words">"{testimonial.review}"</p>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-[10px] text-gold-500 font-bold shrink-0">
                              {testimonial.name.charAt(0)}
                            </div>
                            <span className="text-[10px] uppercase tracking-widest font-semibold break-words line-clamp-1">{testimonial.name}</span>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button onClick={() => setTestimonialModal({ isOpen: true, mode: 'edit', data: testimonial })} className="text-white/20 hover:text-white p-2">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteTestimonial(testimonial.id)} className="text-white/20 hover:text-red-500 p-2">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="w-full max-w-4xl mx-auto md:mx-0">
                  <div className="mb-6 md:mb-8 pb-4 border-b border-white/5">
                    <p className="text-white/60 text-sm font-light">Update public business information and website content.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-gold-500 text-[10px] uppercase tracking-widest border-b border-white/5 pb-2">Contact Details</h3>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Business Email</label>
                        <input type="text" value={(settings as any).email} onChange={(e) => updateSetting('email', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-white font-light focus:border-gold-500 outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Phone Number</label>
                        <input type="text" value={(settings as any).phone} onChange={(e) => updateSetting('phone', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-white font-light focus:border-gold-500 outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Physical Address</label>
                        <input type="text" value={(settings as any).address} onChange={(e) => updateSetting('address', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-white font-light focus:border-gold-500 outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">WhatsApp Link</label>
                        <input type="text" value={(settings as any).whatsapp} onChange={(e) => updateSetting('whatsapp', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-white font-light focus:border-gold-500 outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Instagram URL</label>
                        <input type="text" value={(settings as any).instagram} onChange={(e) => updateSetting('instagram', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-white font-light focus:border-gold-500 outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">YouTube URL</label>
                        <input type="text" value={(settings as any).youtube} onChange={(e) => updateSetting('youtube', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-white font-light focus:border-gold-500 outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">JustDial URL</label>
                        <input type="text" value={(settings as any).justdial} onChange={(e) => updateSetting('justdial', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-white font-light focus:border-gold-500 outline-none transition-colors" />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-gold-500 text-[10px] uppercase tracking-widest border-b border-white/5 pb-2">Hero Section Content</h3>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Hero Heading</label>
                        <textarea rows={3} value={(settings as any).hero_heading} onChange={(e) => updateSetting('hero_heading', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-white font-light focus:border-gold-500 outline-none transition-colors" />
                        <p className="text-xs text-white/40 mt-1">Text matching "Into Unforgettable" will automatically be styled beautifully.</p>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Hero Subheading</label>
                        <textarea rows={3} value={(settings as any).hero_subheading} onChange={(e) => updateSetting('hero_subheading', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-white font-light focus:border-gold-500 outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Hero Background Image URL</label>
                        <input type="text" value={(settings as any).hero_image} onChange={(e) => updateSetting('hero_image', e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-4 text-white font-light focus:border-gold-500 outline-none transition-colors" />
                      </div>
                      
                      <button onClick={handleSaveSettings} disabled={isSaving} className="bg-gold-500 text-black px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-white transition-colors mt-6 block w-full text-center disabled:opacity-50">
                        {isSaving ? "Saving..." : "Save All Settings"}
                      </button>
                    </div>

                    <div className="space-y-6 md:col-span-2 mt-8 pt-8 border-t border-white/5">
                      <h3 className="text-gold-500 text-[10px] uppercase tracking-widest border-b border-white/5 pb-2 flex items-center gap-2">
                        <Database className="w-3 h-3"/> Database Connection
                      </h3>
                      
                      {isSupabaseConfigured ? (
                         <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-400 text-xs tracking-widest uppercase mb-4">
                           Supabase connected. Database tables: gallery, services, testimonials, settings. Storage bucket: wedding-gallery.
                         </div>
                      ) : (
                        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs tracking-widest uppercase mb-4">
                           Not Connected. Using demo data.
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Supabase Project URL</label>
                          <input type="text" value={localStorage.getItem('SUPABASE_URL') || ''} onChange={(e) => localStorage.setItem('SUPABASE_URL', e.target.value)} placeholder="https://your-project.supabase.co" className="w-full bg-white/[0.03] border border-white/10 p-4 text-white font-light focus:border-gold-500 outline-none transition-colors" />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Supabase Anon Key</label>
                          <input type="password" value={localStorage.getItem('SUPABASE_ANON_KEY') || ''} onChange={(e) => localStorage.setItem('SUPABASE_ANON_KEY', e.target.value)} placeholder="eyJhb..." className="w-full bg-white/[0.03] border border-white/10 p-4 text-white font-light focus:border-gold-500 outline-none transition-colors" />
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <button onClick={() => window.location.reload()} className="bg-dark-800 border border-white/10 text-white px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-white/5 transition-colors w-full sm:w-auto">
                          Apply Connection Settings
                        </button>
                        <button onClick={() => { localStorage.removeItem('SUPABASE_URL'); localStorage.removeItem('SUPABASE_ANON_KEY'); window.location.reload(); }} className="bg-red-500/10 border border-red-500/30 text-red-500 px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-red-500/20 transition-colors w-full sm:w-auto">
                          Clear Keys
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Forms/Modals */}
      <Modal isOpen={photoModal.isOpen} onClose={() => setPhotoModal({ ...photoModal, isOpen: false })} title={photoModal.mode === 'add' ? 'Upload Photo' : 'Edit Photo'}>
        <form onSubmit={(e) => { e.preventDefault(); const t = e.target as any; handleSavePhoto({ title: t.title.value, category: t.category.value, file: t.image.files?.[0] }); }} className="space-y-4">
          <div><label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Title</label><input name="title" defaultValue={photoModal.data?.title} required className="w-full bg-black/50 border border-white/10 p-3 text-white outline-none focus:border-gold-500" /></div>
          <div><label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Category</label><input name="category" defaultValue={photoModal.data?.category} required className="w-full bg-black/50 border border-white/10 p-3 text-white outline-none focus:border-gold-500" /></div>
          <div><label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Image {photoModal.data && '(Leave empty to keep current)'}</label><input name="image" type="file" accept="image/*" required={!photoModal.data} className="w-full text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:bg-gold-500/10 file:text-gold-500 hover:file:bg-gold-500/20" /></div>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={() => setPhotoModal({ ...photoModal, isOpen: false })} className="text-white/50 hover:text-white text-[10px] uppercase tracking-widest p-3">Cancel</button>
            <button type="submit" disabled={isSaving} className="bg-gold-500 text-black px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50">{isSaving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={serviceModal.isOpen} onClose={() => setServiceModal({ ...serviceModal, isOpen: false })} title={serviceModal.mode === 'add' ? 'Add Service' : 'Edit Service'}>
        <form onSubmit={(e) => { e.preventDefault(); const t = e.target as any; handleSaveService({ title: t.title.value, description: t.description.value, file: t.image.files?.[0] }); }} className="space-y-4">
          <div><label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Service Title</label><input name="title" defaultValue={serviceModal.data?.title} required className="w-full bg-black/50 border border-white/10 p-3 text-white outline-none focus:border-gold-500" /></div>
          <div><label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Description</label><textarea name="description" rows={3} defaultValue={serviceModal.data?.description} required className="w-full bg-black/50 border border-white/10 p-3 text-white outline-none focus:border-gold-500" /></div>
          <div><label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Hero Image {serviceModal.data && '(Leave empty to keep current)'}</label><input name="image" type="file" accept="image/*" required={!serviceModal.data} className="w-full text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:bg-gold-500/10 file:text-gold-500 hover:file:bg-gold-500/20" /></div>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={() => setServiceModal({ ...serviceModal, isOpen: false })} className="text-white/50 hover:text-white text-[10px] uppercase tracking-widest p-3">Cancel</button>
            <button type="submit" disabled={isSaving} className="bg-gold-500 text-black px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50">{isSaving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={testimonialModal.isOpen} onClose={() => setTestimonialModal({ ...testimonialModal, isOpen: false })} title={testimonialModal.mode === 'add' ? 'Add Testimonial' : 'Edit Testimonial'}>
        <form onSubmit={(e) => { e.preventDefault(); const t = e.target as any; handleSaveTestimonial({ name: t.name.value, review: t.review.value, rating: parseInt(t.rating.value) }); }} className="space-y-4">
          <div><label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Client Name</label><input name="name" defaultValue={testimonialModal.data?.name} required className="w-full bg-black/50 border border-white/10 p-3 text-white outline-none focus:border-gold-500" /></div>
          <div><label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Review / Story</label><textarea name="review" rows={4} defaultValue={testimonialModal.data?.review} required className="w-full bg-black/50 border border-white/10 p-3 text-white outline-none focus:border-gold-500" /></div>
          <div><label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Rating (1-5)</label><input name="rating" type="number" min="1" max="5" defaultValue={testimonialModal.data?.rating || 5} required className="w-full bg-black/50 border border-white/10 p-3 text-white outline-none focus:border-gold-500" /></div>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={() => setTestimonialModal({ ...testimonialModal, isOpen: false })} className="text-white/50 hover:text-white text-[10px] uppercase tracking-widest p-3">Cancel</button>
            <button type="submit" disabled={isSaving} className="bg-gold-500 text-black px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50">{isSaving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>

    </div>
  );
}

