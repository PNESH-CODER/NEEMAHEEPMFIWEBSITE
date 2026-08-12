CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USER ROLES TABLE
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(100) NOT NULL DEFAULT 'Author',
    department VARCHAR(255) DEFAULT 'CMS Editorial',
    status VARCHAR(50) DEFAULT 'Active',
    assigned_by VARCHAR(255) DEFAULT 'System',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(255),
    middle_name VARCHAR(255),
    last_name VARCHAR(255),
    display_name VARCHAR(255),
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(100),
    whatsapp VARCHAR(100),
    gender VARCHAR(50),
    job_title VARCHAR(255),
    department VARCHAR(255),
    employee_id VARCHAR(100),
    role VARCHAR(100) DEFAULT 'Author',
    status VARCHAR(50) DEFAULT 'Active',
    verification_status VARCHAR(50) DEFAULT 'Verified',
    profile_photo TEXT,
    cover_photo TEXT,
    bio TEXT,
    short_bio TEXT,
    education JSONB DEFAULT '[]'::jsonb,
    work_experience JSONB DEFAULT '[]'::jsonb,
    expertise JSONB DEFAULT '[]'::jsonb,
    certifications JSONB DEFAULT '[]'::jsonb,
    memberships JSONB DEFAULT '[]'::jsonb,
    stats JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. LEADS TABLE
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name VARCHAR(255),
    name VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    type VARCHAR(100) DEFAULT 'Contact',
    score INTEGER CHECK (score >= 0 AND score <= 100),
    category VARCHAR(50),
    tags JSONB DEFAULT '[]'::jsonb,
    details JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(50) DEFAULT 'New',
    signup_source VARCHAR(255),
    consent_given BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 4. QUIZ RESPONSES TABLE
CREATE TABLE IF NOT EXISTS quiz_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    answers JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE quiz_responses ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 5. MEMBERS TABLE
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    linked_lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE members ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 6. JOBS TABLE
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    ref_number VARCHAR(100) UNIQUE,
    department VARCHAR(255),
    category VARCHAR(255),
    employment_type VARCHAR(100) DEFAULT 'Full-Time',
    location VARCHAR(255),
    work_arrangement VARCHAR(100) DEFAULT 'On-site',
    summary TEXT,
    responsibilities JSONB DEFAULT '[]'::jsonb,
    min_qualifications JSONB DEFAULT '[]'::jsonb,
    required_experience TEXT,
    required_skills JSONB DEFAULT '[]'::jsonb,
    benefits JSONB DEFAULT '[]'::jsonb,
    positions_count INTEGER DEFAULT 1,
    deadline VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Published',
    is_featured BOOLEAN DEFAULT false,
    is_urgent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 7. JOB APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    app_number VARCHAR(100) UNIQUE,
    vacancy_title VARCHAR(255),
    department VARCHAR(255),
    status VARCHAR(50) DEFAULT 'New',
    verification_status VARCHAR(50) DEFAULT 'Pending',
    identity JSONB DEFAULT '{}'::jsonb,
    education JSONB DEFAULT '[]'::jsonb,
    employment JSONB DEFAULT '[]'::jsonb,
    memberships JSONB DEFAULT '[]'::jsonb,
    "references" JSONB DEFAULT '[]'::jsonb,
    cv JSONB DEFAULT '{}'::jsonb,
    declaration JSONB DEFAULT '{}'::jsonb,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS "references" JSONB DEFAULT '[]'::jsonb;

-- 8. BLOG ARTICLES TABLE
CREATE TABLE IF NOT EXISTS blog_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    excerpt TEXT,
    content TEXT,
    blocks JSONB DEFAULT '[]'::jsonb,
    category VARCHAR(255),
    tags JSONB DEFAULT '[]'::jsonb,
    author_id VARCHAR(255),
    author_name VARCHAR(255),
    author_role VARCHAR(255),
    author_avatar TEXT,
    image TEXT,
    status VARCHAR(50) DEFAULT 'Published',
    likes INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    seo JSONB DEFAULT '{}'::jsonb,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE blog_articles ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 9. BLOG COMMENTS TABLE
CREATE TABLE IF NOT EXISTS blog_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    post_slug VARCHAR(255) NOT NULL,
    post_title VARCHAR(255),
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    author_avatar TEXT,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'Approved',
    ai_risk_score INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE blog_comments ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 10. BENEFICIARIES TABLE
CREATE TABLE IF NOT EXISTS beneficiaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    list_id VARCHAR(255),
    serial_number INTEGER,
    full_name VARCHAR(255) NOT NULL,
    masked_name VARCHAR(255),
    school VARCHAR(255),
    year VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 11. MEDIA LIBRARY TABLE
CREATE TABLE IF NOT EXISTS media_library (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    filename VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    file_type VARCHAR(100),
    file_size VARCHAR(100),
    folder VARCHAR(255) DEFAULT 'General',
    tags JSONB DEFAULT '[]'::jsonb,
    alt_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE media_library ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 12. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    folder VARCHAR(50) DEFAULT 'Inbox',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_user_roles_email ON user_roles(email);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_job_apps_user_id ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_apps_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_blog_articles_slug ON blog_articles(slug);
CREATE INDEX IF NOT EXISTS idx_blog_articles_user_id ON blog_articles(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_slug ON blog_comments(post_slug);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- IDEMPOTENT RLS POLICIES
DROP POLICY IF EXISTS "Public read user_roles" ON user_roles;
CREATE POLICY "Public read user_roles" ON user_roles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Auth or owner modify user_roles" ON user_roles;
CREATE POLICY "Auth or owner modify user_roles" ON user_roles FOR ALL USING (true);

DROP POLICY IF EXISTS "Public read user_profiles" ON user_profiles;
CREATE POLICY "Public read user_profiles" ON user_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "User manage own profile" ON user_profiles;
CREATE POLICY "User manage own profile" ON user_profiles FOR ALL USING (
    auth.uid() = user_id OR auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Public insert leads" ON leads;
CREATE POLICY "Public insert leads" ON leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Read leads" ON leads;
CREATE POLICY "Read leads" ON leads FOR SELECT USING (true);

DROP POLICY IF EXISTS "Modify leads" ON leads;
CREATE POLICY "Modify leads" ON leads FOR UPDATE USING (
    auth.uid() = user_id OR auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Delete leads" ON leads;
CREATE POLICY "Delete leads" ON leads FOR DELETE USING (
    auth.uid() = user_id OR auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Public insert quiz_responses" ON quiz_responses;
CREATE POLICY "Public insert quiz_responses" ON quiz_responses FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Read quiz_responses" ON quiz_responses;
CREATE POLICY "Read quiz_responses" ON quiz_responses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert members" ON members;
CREATE POLICY "Public insert members" ON members FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "User manage own member record" ON members;
CREATE POLICY "User manage own member record" ON members FOR ALL USING (
    auth.uid() = user_id OR auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Public read jobs" ON jobs;
CREATE POLICY "Public read jobs" ON jobs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Auth users manage jobs" ON jobs;
CREATE POLICY "Auth users manage jobs" ON jobs FOR ALL USING (
    auth.role() = 'authenticated' OR auth.uid() = user_id
);

DROP POLICY IF EXISTS "Public submit job applications" ON job_applications;
CREATE POLICY "Public submit job applications" ON job_applications FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Read job applications" ON job_applications;
CREATE POLICY "Read job applications" ON job_applications FOR SELECT USING (
    auth.uid() = user_id OR auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Manage job applications" ON job_applications;
CREATE POLICY "Manage job applications" ON job_applications FOR UPDATE USING (
    auth.uid() = user_id OR auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Public read published blog_articles" ON blog_articles;
CREATE POLICY "Public read published blog_articles" ON blog_articles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Auth users manage blog_articles" ON blog_articles;
CREATE POLICY "Auth users manage blog_articles" ON blog_articles FOR ALL USING (
    auth.role() = 'authenticated' OR auth.uid() = user_id
);

DROP POLICY IF EXISTS "Public read blog_comments" ON blog_comments;
CREATE POLICY "Public read blog_comments" ON blog_comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public submit blog_comments" ON blog_comments;
CREATE POLICY "Public submit blog_comments" ON blog_comments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Auth users manage blog_comments" ON blog_comments;
CREATE POLICY "Auth users manage blog_comments" ON blog_comments FOR ALL USING (
    auth.uid() = user_id OR auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Public read beneficiaries" ON beneficiaries;
CREATE POLICY "Public read beneficiaries" ON beneficiaries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Auth users manage beneficiaries" ON beneficiaries;
CREATE POLICY "Auth users manage beneficiaries" ON beneficiaries FOR ALL USING (
    auth.role() = 'authenticated' OR auth.uid() = user_id
);

DROP POLICY IF EXISTS "Public read media_library" ON media_library;
CREATE POLICY "Public read media_library" ON media_library FOR SELECT USING (true);

DROP POLICY IF EXISTS "Auth users manage media_library" ON media_library;
CREATE POLICY "Auth users manage media_library" ON media_library FOR ALL USING (
    auth.role() = 'authenticated' OR auth.uid() = user_id
);

DROP POLICY IF EXISTS "Public submit contact_messages" ON contact_messages;
CREATE POLICY "Public submit contact_messages" ON contact_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Auth users read contact_messages" ON contact_messages;
CREATE POLICY "Auth users read contact_messages" ON contact_messages FOR SELECT USING (
    auth.uid() = user_id OR auth.role() = 'authenticated'
);

-- CLEANUP PREVIOUS SEED USERS EXCEPT SUPER ADMIN PATRICK MUNENE
DELETE FROM user_roles WHERE email != 'ptrckmunene@gmail.com';
DELETE FROM user_profiles WHERE email != 'ptrckmunene@gmail.com';

-- INITIAL SEED SUPER ADMIN (PATRICK MUNENE ONLY)
INSERT INTO user_roles (user_name, email, role, department, status, assigned_by)
VALUES 
    ('Patrick Munene', 'ptrckmunene@gmail.com', 'Superadmin', 'Executive Administration', 'Active', 'System Initializer')
ON CONFLICT (email) DO UPDATE 
SET user_name = 'Patrick Munene', role = 'Superadmin', department = 'Executive Administration', status = 'Active';

INSERT INTO user_profiles (first_name, last_name, display_name, username, email, role, department, status, job_title)
VALUES 
    ('Patrick', 'Munene', 'Patrick Munene', 'ptrckmunene', 'ptrckmunene@gmail.com', 'Superadmin', 'Executive Administration', 'Active', 'Super Admin & Managing Director')
ON CONFLICT (email) DO UPDATE 
SET display_name = 'Patrick Munene', role = 'Superadmin', status = 'Active';
