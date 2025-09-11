-- Create profiles table for admin users
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create content table for multi-language page content
CREATE TABLE public.content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL, -- 'home', 'podcast', 'kitchen', 'stories', 'contact'
  section_key TEXT NOT NULL, -- 'hero_title', 'hero_subtitle', 'about_text', etc.
  language_code TEXT NOT NULL DEFAULT 'sr' CHECK (language_code IN ('sr', 'de', 'en')),
  content_text TEXT,
  content_html TEXT,
  media_url TEXT, -- For images or video URLs
  media_type TEXT CHECK (media_type IN ('image', 'video', 'youtube')),
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(page_key, section_key, language_code)
);

-- Create episodes table for podcast episodes
CREATE TABLE public.episodes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  audio_url TEXT,
  video_url TEXT,
  youtube_url TEXT,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  episode_number INTEGER,
  season_number INTEGER DEFAULT 1,
  published_date TIMESTAMP WITH TIME ZONE,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT false,
  language_code TEXT NOT NULL DEFAULT 'sr' CHECK (language_code IN ('sr', 'de', 'en')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create newsletter subscribers table
CREATE TABLE public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  language_preference TEXT NOT NULL DEFAULT 'sr' CHECK (language_preference IN ('sr', 'de', 'en')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create GDPR consent table
CREATE TABLE public.gdpr_consents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_identifier TEXT NOT NULL, -- IP hash or user ID
  consent_type TEXT NOT NULL CHECK (consent_type IN ('necessary', 'analytics', 'marketing', 'preferences')),
  consent_given BOOLEAN NOT NULL,
  language_code TEXT NOT NULL DEFAULT 'de' CHECK (language_code IN ('sr', 'de', 'en')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gdpr_consents ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = user_uuid AND role IN ('admin', 'editor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (public.is_admin(auth.uid()));

-- RLS Policies for content
CREATE POLICY "Everyone can view published content" 
ON public.content FOR SELECT 
USING (is_published = true);

CREATE POLICY "Admins can manage all content" 
ON public.content FOR ALL 
USING (public.is_admin(auth.uid()));

-- RLS Policies for episodes
CREATE POLICY "Everyone can view published episodes" 
ON public.episodes FOR SELECT 
USING (is_published = true);

CREATE POLICY "Admins can manage all episodes" 
ON public.episodes FOR ALL 
USING (public.is_admin(auth.uid()));

-- RLS Policies for newsletter
CREATE POLICY "Admins can view newsletter subscribers" 
ON public.newsletter_subscribers FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can subscribe to newsletter" 
ON public.newsletter_subscribers FOR INSERT 
WITH CHECK (true);

-- RLS Policies for GDPR
CREATE POLICY "Anyone can record GDPR consent" 
ON public.gdpr_consents FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view GDPR consents" 
ON public.gdpr_consents FOR SELECT 
USING (public.is_admin(auth.uid()));

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    CASE 
      WHEN NEW.email = 'admin@natalishow.com' THEN 'admin'
      ELSE 'viewer'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_updated_at
  BEFORE UPDATE ON public.content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_episodes_updated_at
  BEFORE UPDATE ON public.episodes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial admin user content and sample data
INSERT INTO public.content (page_key, section_key, language_code, content_text) VALUES
-- Serbian content
('home', 'hero_title', 'sr', 'Dobrodošli na Natali Show'),
('home', 'hero_subtitle', 'sr', 'Prefinjen podcast o životu, kuvanju i pričama koje inspirišu'),
('podcast', 'page_title', 'sr', 'Podcast Epizode'),
('kitchen', 'page_title', 'sr', 'Natali u Kuhinji'),
('stories', 'page_title', 'sr', 'Priče'),
('contact', 'page_title', 'sr', 'Kontakt'),

-- German content
('home', 'hero_title', 'de', 'Willkommen bei der Natali Show'),
('home', 'hero_subtitle', 'de', 'Ein eleganter Podcast über Leben, Kochen und inspirierende Geschichten'),
('podcast', 'page_title', 'de', 'Podcast Episoden'),
('kitchen', 'page_title', 'de', 'Natali in der Küche'),
('stories', 'page_title', 'de', 'Geschichten'),
('contact', 'page_title', 'de', 'Kontakt'),

-- English content
('home', 'hero_title', 'en', 'Welcome to Natali Show'),
('home', 'hero_subtitle', 'en', 'An elegant podcast about life, cooking and inspiring stories'),
('podcast', 'page_title', 'en', 'Podcast Episodes'),
('kitchen', 'page_title', 'en', 'Natali in the Kitchen'),
('stories', 'page_title', 'en', 'Stories'),
('contact', 'page_title', 'en', 'Contact');