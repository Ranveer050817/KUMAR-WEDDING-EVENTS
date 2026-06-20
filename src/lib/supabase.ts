import { createClient } from '@supabase/supabase-js';

// Check both environment variables and localStorage for the keys
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || localStorage.getItem('SUPABASE_URL') || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('SUPABASE_ANON_KEY') || '';

if (!import.meta.env.VITE_SUPABASE_URL && !localStorage.getItem('SUPABASE_URL')) {
  console.warn('Supabase URL is missing. Ensure VITE_SUPABASE_URL is set in your environment variables.');
}

// Create realistic dummy data for preview mode when Supabase isn't configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  // Mock client if not configured
  : ({} as any);

export const DUMMY_SERVICES = [
  {
    id: '1',
    title: 'Wedding Planning',
    description: 'Complete end-to-end management for your dream day. From venues to catering, we handle it all.',
    image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    title: 'Stage Decoration',
    description: 'Premium, luxury floral and lighting setups that leave a lasting impression.',
    image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    title: 'Corporate Events',
    description: 'Professional conference, seminar, and retreat planning with exceptional attention to detail.',
    image_url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '4',
    title: 'Catering Services',
    description: 'Exquisite multi-cuisine menus crafted by expert chefs for an unforgettable culinary experience.',
    image_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  }
];

export const DUMMY_GALLERY = [
  { id: '1', title: 'Grand Reception', category: 'Wedding', image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '2', title: 'Floral Mandap', category: 'Decoration', image_url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '3', title: 'Outdoor Dining', category: 'Outdoor', image_url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '4', title: 'Bride Entry', category: 'Wedding', image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '5', title: 'Corporate Seminar', category: 'Corporate', image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '6', title: 'Haldi Stage', category: 'Decoration', image_url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
];

export const DUMMY_TESTIMONIALS = [
  { id: '1', name: 'Rohan Sharma', review: 'Best service in Ranchi at reasonable cost. They made our wedding day absolutely magical and stress-free. The decoration was beyond our expectations.', rating: 5 },
  { id: '2', name: 'Priya Singh', review: 'Outstanding work and management. The team is extremely professional and polite. Our corporate event was handled flawlessly from start to finish.', rating: 5 },
  { id: '3', name: 'Amit Verma', review: 'Communication was flawless. We booked them for a reception and they delivered exactly what they promised. Everything was perfect and on time.', rating: 5 },
];

export const APP_SETTINGS = {
  business_name: 'Kumar Wedding & Events',
  phone: '+91 70913 95999',
  email: 'hello@kumarwedding.com',
  address: 'NH23, Gumla Road, Near Reliance Petrol Pump, Tikratoli, Ranchi, Jharkhand 835303',
  whatsapp: 'https://wa.me/917091395999',
  instagram: 'https://www.instagram.com/kumarwedding',
  youtube: 'https://www.youtube.com/@Kumar-x7s',
  justdial: 'https://jsdl.in/RSL-GRL1781939199',
  hero_heading: 'Turning Dreams\nInto Unforgettable\nCelebrations',
  hero_subheading: 'Premium Wedding & Event Planning Services in Ranchi. From concept to execution, we craft elegance.',
  hero_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80'
};
