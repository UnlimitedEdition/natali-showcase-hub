-- Script to complete missing content data for all pages
-- This ensures each page has hero_title and hero_subtitle in all three languages

-- Home page content (already exists but let's ensure it's complete)
INSERT INTO public.content (page_key, section_key, language_code, content_text, is_published) VALUES
('home', 'hero_title', 'sr', 'Dobrodošli na Natalia Show', true),
('home', 'hero_subtitle', 'sr', 'Prefinjen podcast o životu, kuvanju i pričama koje inspirišu', true),
('home', 'hero_title', 'de', 'Willkommen bei der Natalia Show', true),
('home', 'hero_subtitle', 'de', 'Ein eleganter Podcast über Leben, Kochen und inspirierende Geschichten', true),
('home', 'hero_title', 'en', 'Welcome to Natalia Show', true),
('home', 'hero_subtitle', 'en', 'An elegant podcast about life, cooking and inspiring stories', true),

-- Podcast page content
('podcast', 'hero_title', 'sr', 'Podcast Epizode', true),
('podcast', 'hero_subtitle', 'sr', 'Istražite arhivu inspirativnih razgovora, kulinarskih avantura i životnih priča', true),
('podcast', 'hero_title', 'de', 'Podcast Episoden', true),
('podcast', 'hero_subtitle', 'de', 'Erkunden Sie das Archiv inspirierender Gespräche, kulinarischer Abenteuer und Lebensgeschichten', true),
('podcast', 'hero_title', 'en', 'Podcast Episodes', true),
('podcast', 'hero_subtitle', 'en', 'Explore the archive of inspiring conversations, culinary adventures and life stories', true),

-- Kitchen/Foodcast page content
('kitchen', 'hero_title', 'sr', 'Natalia u Kuhinji', true),
('kitchen', 'hero_subtitle', 'sr', 'Kulinarika inspirisana putovanjima i lokalnim tradicijama', true),
('kitchen', 'hero_title', 'de', 'Natalia in der Küche', true),
('kitchen', 'hero_subtitle', 'de', 'Kulinarik inspiriert von Reisen und lokalen Traditionen', true),
('kitchen', 'hero_title', 'en', 'Natalia in the Kitchen', true),
('kitchen', 'hero_subtitle', 'en', 'Culinary delights inspired by travels and local traditions', true),

-- Stories page content
('stories', 'hero_title', 'sr', 'Priče', true),
('stories', 'hero_subtitle', 'sr', 'Autentične priče iz života koje ostavljaju trag', true),
('stories', 'hero_title', 'de', 'Geschichten', true),
('stories', 'hero_subtitle', 'de', 'Authentische Lebensgeschichten, die einen bleibenden Eindruck hinterlassen', true),
('stories', 'hero_title', 'en', 'Stories', true),
('stories', 'hero_subtitle', 'en', 'Authentic life stories that leave a lasting impression', true),

-- Contact page content
('contact', 'hero_title', 'sr', 'Kontakt', true),
('contact', 'hero_subtitle', 'sr', 'Zakažite gostovanje ili poručite saradnju', true),
('contact', 'hero_title', 'de', 'Kontakt', true),
('contact', 'hero_subtitle', 'de', 'Buchen Sie ein Gastspiel oder bestellen Sie eine Zusammenarbeit', true),
('contact', 'hero_title', 'en', 'Contact', true),
('contact', 'hero_subtitle', 'en', 'Book a guest appearance or order collaboration', true)
ON CONFLICT (page_key, section_key, language_code) 
DO UPDATE SET 
  content_text = EXCLUDED.content_text,
  is_published = EXCLUDED.is_published;