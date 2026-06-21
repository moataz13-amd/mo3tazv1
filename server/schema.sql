-- SUPABASE DATABASE SCHEMA SQL

-- 1. users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. settings Table
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) DEFAULT 'Alex Neon',
    title VARCHAR(255) DEFAULT 'Full Stack Developer',
    subtitle VARCHAR(255),
    bio TEXT,
    avatar TEXT,
    cv_url TEXT,
    email VARCHAR(255) DEFAULT 'hello@portfolio.dev',
    phone VARCHAR(50),
    location VARCHAR(255),
    seo_title VARCHAR(255),
    seo_description TEXT,
    hero_headline TEXT,
    hero_subheadline VARCHAR(255),
    about_description TEXT,
    about_section_title VARCHAR(255),
    about_section_heading VARCHAR(255),
    about_cta_text VARCHAR(255),
    stat1_value VARCHAR(50),
    stat1_label VARCHAR(100),
    stat2_value VARCHAR(50),
    stat2_label VARCHAR(100),
    client_logos JSONB DEFAULT '[]'::jsonb,
    marquee_row1 JSONB DEFAULT '[]'::jsonb,
    marquee_row2 JSONB DEFAULT '[]'::jsonb,
    social_links JSONB DEFAULT '[]'::jsonb,
    availability_status VARCHAR(50) DEFAULT 'available',
    availability_response_time VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT,
    cover_image TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    video_url TEXT,
    tech_stack TEXT[] DEFAULT '{}',
    github_url TEXT,
    live_url TEXT,
    category VARCHAR(100) DEFAULT 'web' CHECK (category IN ('web', 'ui-ux', 'graphic', 'branding', 'other')),
    featured BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. skills Table
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    level INTEGER NOT NULL CHECK (level >= 0 AND level <= 100),
    category VARCHAR(100) NOT NULL CHECK (category IN ('frontend', 'backend', 'database', 'ui-ux', 'graphic')),
    icon VARCHAR(255),
    color VARCHAR(50),
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. services Table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(255) DEFAULT '⚡',
    features TEXT[] DEFAULT '{}',
    price VARCHAR(100),
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name VARCHAR(255) NOT NULL,
    client_title VARCHAR(255) NOT NULL,
    client_company VARCHAR(255) NOT NULL,
    client_photo TEXT,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    project_type VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. messages Table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. blog_posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT,
    tags TEXT[] DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. analytics Table
CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitors INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 0,
    date DATE DEFAULT CURRENT_DATE UNIQUE,
    device_desktop INTEGER DEFAULT 0,
    device_mobile INTEGER DEFAULT 0,
    device_tablet INTEGER DEFAULT 0,
    browser_chrome INTEGER DEFAULT 0,
    browser_safari INTEGER DEFAULT 0,
    browser_firefox INTEGER DEFAULT 0,
    browser_edge INTEGER DEFAULT 0
);

-- 10. activity_logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(255) NOT NULL,
    description TEXT,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. experience Table
CREATE TABLE IF NOT EXISTS experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) DEFAULT 'experience' CHECK (type IN ('experience', 'education', 'certification')),
    title VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    period VARCHAR(100) NOT NULL,
    description TEXT,
    tags TEXT[] DEFAULT '{}',
    icon VARCHAR(50) DEFAULT '💼',
    color VARCHAR(50) DEFAULT '#00BFFF',
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. languages Table
CREATE TABLE IF NOT EXISTS languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    level VARCHAR(100) DEFAULT 'Professional',
    proficiency INTEGER DEFAULT 80,
    flag VARCHAR(50) DEFAULT '🇸🇦',
    color VARCHAR(50) DEFAULT '#00BFFF',
    description TEXT,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Admin User (Default Password: "password123")
-- Hash below corresponds to: bcrypt.hash("password123", 10)
INSERT INTO users (email, password_hash, name, role)
VALUES ('admin@portfolio.system', '$2b$10$r7H7cbLtShf4cyGAsGHUz.Jna4Rk.F7Cd5ZpVB7eNxeg60dA0aJmC', 'Site Administrator', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Ensure settings columns exist (Migration safety for existing tables)
ALTER TABLE settings ADD COLUMN IF NOT EXISTS hero_headline TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS hero_subheadline VARCHAR(255);
ALTER TABLE settings ADD COLUMN IF NOT EXISTS about_description TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS about_section_title VARCHAR(255);
ALTER TABLE settings ADD COLUMN IF NOT EXISTS about_section_heading VARCHAR(255);
ALTER TABLE settings ADD COLUMN IF NOT EXISTS about_cta_text VARCHAR(255);
ALTER TABLE settings ADD COLUMN IF NOT EXISTS stat1_value VARCHAR(50);
ALTER TABLE settings ADD COLUMN IF NOT EXISTS stat1_label VARCHAR(100);
ALTER TABLE settings ADD COLUMN IF NOT EXISTS stat2_value VARCHAR(50);
ALTER TABLE settings ADD COLUMN IF NOT EXISTS stat2_label VARCHAR(100);
ALTER TABLE settings ADD COLUMN IF NOT EXISTS client_logos JSONB DEFAULT '[]'::jsonb;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS marquee_row1 JSONB DEFAULT '[]'::jsonb;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS marquee_row2 JSONB DEFAULT '[]'::jsonb;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS availability_status VARCHAR(50) DEFAULT 'available';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS availability_response_time VARCHAR(100);

-- Seed Settings Row
INSERT INTO settings (id, name, title, bio, email, hero_headline, hero_subheadline, about_section_title, about_section_heading, stat1_value, stat1_label, stat2_value, stat2_label)
VALUES ('00000000-0000-0000-0000-000000000000', 'معتز جمعة', 'جونيور جرافيك ديزاينر', 'الإبداع ليس ما نفعله فقط بل ما نتركه في أذهان عملائنا من تصميم الهوية البصرية إلى المحتوى الإبداعي الذي يبرز علامتك التجارية.', 'hello@portfolio.dev', 'حين يجتمع الإبداع مع التفاصيل
تولد تصاميم استثنائية.', 'موثوق من قبل', 'نبذة عني', 'نحول الأفكار إلى تصاميم مؤثرة', '+4', 'شركات', '+75', 'تصميم')
ON CONFLICT (id) DO NOTHING;

