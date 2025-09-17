import { useState, useEffect } from 'react';
import { Search, Play, Users, Calendar, BookOpen, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { VideoModal } from '@/components/VideoModal';
import { useLocation } from 'react-router-dom';

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

interface Episode {
  id: string;
  title?: string;
  description?: string | null;
  duration_seconds?: number | null;
  published_date?: string | null;
  language_code?: string;
  is_featured?: boolean;
  thumbnail_url?: string | null;
  created_at?: string;
  youtube_url?: string | null;
  audio_url?: string | null;
  video_url?: string | null;
  episode_number?: number | null;
  season_number?: number | null;
  is_published?: boolean;
  updated_at?: string;
  author?: string | null;
  read_time?: string | null;
  likes?: number | null;
  category?: string | null;
}

const Podcast = () => {
  const { t, language } = useLanguage();
  const location = useLocation(); // Added to read URL parameters
  const [searchTerm, setSearchTerm] = useState('');
  const [content, setContent] = useState<ContentItem[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoModal, setVideoModal] = useState<{
    isOpen: boolean;
    videoUrl: string;
    title: string;
  }>({
    isOpen: false,
    videoUrl: '',
    title: ''
  });


  useEffect(() => {
    fetchContent();
    fetchEpisodes().then(() => {
      // Check if there's a 'play' parameter in the URL
      const searchParams = new URLSearchParams(location.search);
      const episodeId = searchParams.get('play');
      
      if (episodeId) {
        // Find the episode with the matching ID
        const episodeToPlay = episodes.find(episode => episode.id === episodeId);
        if (episodeToPlay?.youtube_url) {
          // Open the video modal with this episode
          openVideoModal(episodeToPlay.youtube_url, episodeToPlay.title);
        }
      }
    });
  }, [language]);

  useEffect(() => {
    // Also check for the play parameter when episodes are loaded
    const searchParams = new URLSearchParams(location.search);
    const episodeId = searchParams.get('play');
    
    if (episodeId && episodes.length > 0) {
      const episodeToPlay = episodes.find(episode => episode.id === episodeId);
      if (episodeToPlay?.youtube_url) {
        openVideoModal(episodeToPlay.youtube_url, episodeToPlay.title);
      }
    }
  }, [episodes, location.search]);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('page_key', 'podcast')
        .eq('language_code', language)
        .eq('is_published', true);

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const fetchEpisodes = async () => {
    try {
      setLoading(true);
      // Fetch episodes that either have 'podcast' category or no category at all
      const { data, error } = await supabase
        .from('episodes')
        .select('*')
        .eq('is_published', true)
        .eq('language_code', language)
        .or('category.eq.podcast,category.is.null')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEpisodes(data as unknown as Episode[]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching episodes:', error);
      setLoading(false);
    }
  };

  const getContentBySection = (sectionKey: string) => {
    const item = content.find(item => item.section_key === sectionKey);
    return item ? item.content_text : null;
  };

  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    // Format date based on language
    switch (language) {
      case 'sr':
        return date.toLocaleDateString('sr-RS', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }).replace(/\./g, '');
      case 'de':
        return date.toLocaleDateString('de-DE', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        });
      default:
        return date.toLocaleDateString('en-US', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        });
    }
  };

  const openVideoModal = (videoUrl: string, title: string) => {
    setVideoModal({
      isOpen: true,
      videoUrl,
      title
    });
  };

  const closeVideoModal = () => {
    setVideoModal({
      isOpen: false,
      videoUrl: '',
      title: ''
    });
    
    // Remove the 'play' parameter from the URL when closing the modal
    if (location.search.includes('play=')) {
      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.delete('play');
      const newSearch = newSearchParams.toString();
      const newPath = `${location.pathname}${newSearch ? `?${newSearch}` : ''}`;
      window.history.replaceState({}, '', newPath);
    }
  };

  const filteredEpisodes = episodes.filter(episode => {
    const matchesSearch = episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (episode.description && episode.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="animate-pulse h-16 bg-gray-200 rounded w-64 mx-auto mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-32 mx-auto max-w-4xl"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center mb-6">
            <img 
              src="/logo.png" 
              alt="Natalia Show Logo" 
              className="w-16 h-16 object-contain mr-4"
            />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {getContentBySection('hero_title') || t('podcast.hero.title')}
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {getContentBySection('hero_subtitle') || t('podcast.hero.subtitle')} 
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 bg-background border-b">
        <div className="max-w-7xl mx-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('podcast.searchPlaceholder')}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Episodes List */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredEpisodes.length === 0 ? (
            <div className="text-center py-12">
              <Play className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('podcast.noEpisodes')}</h3>
              <p className="text-muted-foreground">{t('podcast.noEpisodesDescription')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEpisodes.map((episode) => (
                <Card key={episode.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {episode.youtube_url && extractYouTubeId(episode.youtube_url) && (
                    <div 
                      className="relative aspect-video bg-muted cursor-pointer"
                      onClick={() => openVideoModal(episode.youtube_url!, episode.title)}
                    >
                      <img 
                        src={`https://img.youtube.com/vi/${extractYouTubeId(episode.youtube_url)}/mqdefault.jpg`} 
                        alt={episode.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="bg-primary/90 rounded-full p-3 hover:bg-primary transition-colors">
                          <Play className="h-6 w-6 text-white fill-white" />
                        </div>
                      </div>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{episode.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {episode.description && (
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {episode.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      {episode.author && (
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {episode.author}
                        </div>
                      )}
                      
                      {episode.created_at && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(episode.created_at)}
                        </div>
                      )}
                      
                      {episode.read_time && (
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {episode.read_time}
                        </div>
                      )}
                      
                      {episode.likes && (
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1 fill-red-500 text-red-500" />
                          {episode.likes}
                        </div>
                      )}
                    </div>
                    
                    {episode.category && (
                      <div className="text-sm px-2 py-1 bg-secondary/10 text-secondary rounded-full inline-block">
                        {episode.category}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                      onClick={() => openVideoModal(episode.youtube_url!, episode.title)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {t('podcast.watchNow')}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
      
      <VideoModal
        isOpen={videoModal.isOpen}
        onClose={closeVideoModal}
        videoUrl={videoModal.videoUrl}
        title={videoModal.title}
      />
    </div>
  );
};

export default Podcast;