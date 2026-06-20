export type GalleryItem = {
  id: string;
  image_url: string;
  category: string;
  title: string;
  created_at: string;
};

export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  image_url: string;
};

export type Testimonial = {
  id: string;
  name: string;
  review: string;
  rating: number;
};

export type Settings = {
  id: string;
  business_name: string;
  phone: string;
  address: string;
  whatsapp: string;
  instagram: string;
  youtube: string;
  justdial: string;
};
