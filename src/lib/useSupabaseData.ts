import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, DUMMY_GALLERY, DUMMY_SERVICES, DUMMY_TESTIMONIALS, APP_SETTINGS } from './supabase';
import type { GalleryItem, ServiceItem, Testimonial } from '../types';

export function useSupabaseData() {
  const [gallery, setGallery] = useState<GalleryItem[]>(DUMMY_GALLERY);
  const [services, setServices] = useState<ServiceItem[]>(DUMMY_SERVICES);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DUMMY_TESTIMONIALS);
  const [settings, setSettings] = useState(APP_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const [galleryRes, servicesRes, testimonialsRes, settingsRes] = await Promise.all([
          supabase.from('gallery').select('*').order('created_at', { ascending: false }),
          supabase.from('services').select('*'),
          supabase.from('testimonials').select('*'),
          supabase.from('settings').select('*')
        ]);

        if (galleryRes.data && galleryRes.data.length > 0) setGallery(galleryRes.data);
        if (servicesRes.data && servicesRes.data.length > 0) setServices(servicesRes.data);
        if (testimonialsRes.data && testimonialsRes.data.length > 0) setTestimonials(testimonialsRes.data);
        
        if (settingsRes.data) {
          const settingsObj = { ...APP_SETTINGS };
          settingsRes.data.forEach((row: any) => {
            if (row.key) (settingsObj as any)[row.key] = row.value;
          });
          setSettings(settingsObj);
        }
      } catch (e) {
        console.error("Error fetching data:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { gallery, setGallery, services, setServices, testimonials, setTestimonials, settings, setSettings, loading };
}
