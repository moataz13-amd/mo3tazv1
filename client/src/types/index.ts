// ============================================
// CORE TYPES
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor';
  avatar?: string;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  internal_name?: string;
  description: string;
  long_description?: string;
  cover_image: string;
  images?: string[];
  video_url?: string;
  tech_stack: string[];
  github_url?: string;
  live_url?: string;
  category: 'web' | 'ui-ux' | 'graphic' | 'branding' | 'other';
  featured: boolean;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 0-100
  category: 'frontend' | 'backend' | 'database' | 'ui-ux' | 'graphic';
  icon?: string;
  color?: string;
  order: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  price?: string;
  order: number;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_title: string;
  client_company: string;
  client_photo?: string;
  content: string;
  rating: number;
  project_type?: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  category_id?: string;
  category?: BlogCategory;
  tags: string[];
  status: 'draft' | 'published';
  author_id: string;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  order: number;
}

export interface ClientLogo {
  name: string;
  src: string;
}

export interface MarqueeTag {
  text: string;
  variant: 'glass' | 'solid';
}

export interface SiteSettings {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  bio: string;
  avatar: string;
  cv_url?: string;
  email: string;
  phone?: string;
  location?: string;
  seo_title?: string;
  seo_description?: string;
  social_links: SocialLink[];
  hero_headline?: string;
  hero_subheadline?: string;
  about_description?: string;
  about_section_title?: string;
  about_section_heading?: string;
  about_cta_text?: string;
  stat1_value?: string;
  stat1_label?: string;
  stat2_value?: string;
  stat2_label?: string;
  client_logos?: ClientLogo[];
  marquee_row1?: MarqueeTag[];
  marquee_row2?: MarqueeTag[];
  facebook_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
  availability_status?: 'available' | 'busy' | 'unavailable';
  availability_response_time?: string;
}

export interface ExperienceEntry {
  id: string;
  type: 'experience' | 'education' | 'certification';
  title: string;
  organization: string;
  period: string;
  description: string;
  tags: string[];
  icon: string;
  color: string;
  order: number;
  created_at: string;
}

export interface Language {
  id: string;
  name: string;
  level: string;
  proficiency: number;
  flag: string;
  color: string;
  description: string;
  order: number;
  created_at: string;
}

export interface AnalyticsData {
  visitors: number;
  page_views: number;
  date: string;
  device?: string;
  browser?: string;
  country?: string;
}

export interface DashboardStats {
  total_visitors: number;
  total_projects: number;
  total_messages: number;
  total_posts: number;
  unread_messages: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  user_id?: string;
  created_at: string;
}

export interface MediaFile {
  id: string;
  url: string;
  public_id: string;
  resource_type: 'image' | 'video';
  format: string;
  width?: number;
  height?: number;
  size: number;
  created_at: string;
}

export type ProjectCategory = 'all' | 'web' | 'ui-ux' | 'graphic' | 'branding';
export type SkillCategory = 'frontend' | 'backend' | 'database' | 'ui-ux' | 'graphic';
