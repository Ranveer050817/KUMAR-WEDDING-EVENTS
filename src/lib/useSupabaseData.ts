import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, supabaseUrl, DUMMY_GALLERY, DUMMY_SERVICES, DUMMY_TESTIMONIALS, APP_SETTINGS } from './supabase';
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

        console.log('Fetched gallery data:', galleryRes.data);
        if (galleryRes.error) {
          console.error('Gallery fetch error:', galleryRes.error);
        }

        const cleanUrls = (items: any[]) => items?.map(item => {
          if (item.image_url && typeof item.image_url === 'string') {
            if (item.image_url.includes('localhost') || item.image_url.includes('127.0.0.1')) {
              // Extract the path after /storage/v1/object/public/ and prepend the current supabaseUrl
              const pathMatches = item.image_url.match(/\/storage\/v1\/object\/public\/(.*)/);
              if (pathMatches && pathMatches[1]) {
                 item.image_url = `${supabaseUrl}/storage/v1/object/public/${pathMatches[1]}`;
              }
            }
          }
          return item;
        });

        if (galleryRes.data && galleryRes.data.length > 0) setGallery(cleanUrls(galleryRes.data));
        if (servicesRes.data && servicesRes.data.length > 0) setServices(cleanUrls(servicesRes.data));
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
