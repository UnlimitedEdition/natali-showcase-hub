import { useState, useEffect } from 'react';
import { Play, Users, Calendar, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

// Define the Episode interface
interface Episode {
  id: string;
  title: string;
  description: string | null;
  duration_seconds: number | null;
  published_date: string | null;
  language_code: string;
  is_featured: boolean;
  thumbnail_url: string | null;
  created_at: string;
  youtube_url: string | null;
  audio_url: string | null;
  video_url: string | null;
  episode_number: number | null;
  season_number: number | null;
  is_published: boolean;
  updated_at: string;
}

interface ContentItem {
  id: string;
  page_key: string;
  section_key: string;
  language_code: string;
  content_text: string | null;
  content_html: string | null;
  media_url: string | null;
  media_type: string | null;
  is_published: boolean;
}

const HeroSection = () => {
  const { language, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate(); // Added useNavigate hook
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [episodeCount, setEpisodeCount] = useState(0);
  const [latestEpisode, setLatestEpisode] = useState<Episode | null>(null); // Fixed type annotation

  // Determine current page based on location
  const getCurrentPageKey = () => {
    switch (location.pathname) {
      case '/':
        return 'home';
      case '/kitchen':
        return 'kitchen';
      case '/stories':
        return 'stories';
      case '/podcast':
        return 'podcast';
      case '/contact':
        return 'contact';
      default:
        return 'home';
    }
  };

  const pageKey = getCurrentPageKey();

  useEffect(() => {
    fetchContent();
    if (pageKey === 'home') {
      fetchEpisodeCount();
      fetchLatestEpisode(); // Fetch latest episode for home page
    }
  }, [language, pageKey]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('page_key', pageKey)
        .eq('language_code', language)
        .in('section_key', ['hero_title', 'hero_subtitle'])
        .eq('is_published', true);

      if (error) throw error;
      setContent(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching content:', error);
      setLoading(false);
    }
  };

  const fetchEpisodeCount = async () => {
    try {
      // We need to count distinct group_id values, treating episodes without group_id as individual groups
      const { data, error } = await supabase
        .from('episodes')
        .select('id, group_id')
        .eq('is_published', true);
      
      if (error) throw error;
      
      // Count unique groups - episodes without group_id are treated as individual groups
      const uniqueGroups = new Set();
      
      data.forEach(episode => {
        // Use group_id if available, otherwise use episode id
        const groupId = episode.group_id || episode.id;
        uniqueGroups.add(groupId);
      });
      
      setEpisodeCount(uniqueGroups.size);
    } catch (error) {
      console.error('Error fetching episode count:', error);
    }
  };

  // Fetch the latest episode
  const fetchLatestEpisode = async () => {
    try {
      const { data, error } = await supabase
        .from('episodes')
        .select('*')
        .eq('is_published', true)
        .eq('language_code', language)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      setLatestEpisode(data);
    } catch (error) {
      console.error('Error fetching latest episode:', error);
    }
  };

  // Function to handle playing the latest episode
  const playLatestEpisode = () => {
    if (latestEpisode?.youtube_url) {
      // If it's a YouTube video, navigate to the podcast page with the episode ID
      navigate(`/podcast?play=${latestEpisode.id}`);
    } else {
      // For other cases, navigate to the podcast page
      navigate('/podcast');
    }
  };

  const getContentBySection = (sectionKey: string) => {
    const item = content.find(item => item.section_key === sectionKey);
    return item ? item.content_text : null;
  };

  const heroTitle = getContentBySection('hero_title');
  const heroSubtitle = getContentBySection('hero_subtitle');

  // Default titles and subtitles based on page
  const getDefaultTitle = () => {
    switch (pageKey) {
      case 'home':
        return t('home.hero.title');
      case 'kitchen':
        return t('kitchen.hero.title');
      case 'stories':
        return t('stories.hero.title');
      case 'podcast':
        return t('podcast.hero.title');
      case 'contact':
        return t('contact.hero.title');
      default:
        return t('home.hero.title');
    }
  };

  const getDefaultSubtitle = () => {
    switch (pageKey) {
      case 'home':
        return t('home.hero.subtitle');
      case 'kitchen':
        return t('kitchen.hero.subtitle');
      case 'stories':
        return t('stories.hero.subtitle');
      case 'podcast':
        return t('podcast.hero.subtitle');
      case 'contact':
        return t('contact.hero.subtitle');
      default:
        return t('home.hero.subtitle');
    }
  };

  if (loading) {
    return (
      <section className="hero-section relative flex items-center justify-center min-h-[50vh] pt-16">
        <div className="text-center">
          <div className="animate-pulse text-2xl">{t('common.loading')}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero-section relative flex items-center justify-center min-h-[50vh] pt-16">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-accent bg-clip-text text-transparent">
            {heroTitle || getDefaultTitle()}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {heroSubtitle || getDefaultSubtitle()}
          </p>
          
          {pageKey === 'home' && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button variant="hero" size="xl" className="group" onClick={playLatestEpisode}>
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                {t('home.hero.listen')}
              </Button>
              <Link to="/contact">
                <Button variant="premium" size="xl">
                  <Mic className="w-5 h-5 mr-2" />
                  {t('home.hero.book')}
                </Button>
              </Link>
            </div>
          )}

          {/* Stats for home page */}
          {pageKey === 'home' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="premium-card text-center p-6 rounded-xl">
                <div className="text-3xl font-bold text-primary-glow mb-2">{episodeCount}+</div>
                <div className="text-muted-foreground">{t('home.hero.episodes')}</div>
              </div>
              <div className="premium-card text-center p-6 rounded-xl">
                <div className="text-3xl font-bold text-secondary mb-2">20K+</div>
                <div className="text-muted-foreground">{t('home.hero.listeners')}</div>
              </div>
              <div className="premium-card text-center p-6 rounded-xl">
                <div className="text-3xl font-bold text-primary-glow mb-2">3</div>
                <div className="text-muted-foreground">{t('home.hero.languages')}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-primary-glow/20 rounded-full animate-float" />
      <div className="absolute top-3/4 right-1/4 w-16 h-16 bg-secondary/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
    </section>
  );
};

export default HeroSection;
