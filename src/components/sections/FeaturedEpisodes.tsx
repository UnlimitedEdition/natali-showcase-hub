import { useState, useEffect } from 'react';
import { Play, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { VideoModal } from '@/components/VideoModal';
import { useNavigate } from 'react-router-dom';

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

const FeaturedEpisodes = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoModal, setVideoModal] = useState({
    isOpen: false,
    videoUrl: '',
    title: ''
  });

  useEffect(() => {
    fetchFeaturedEpisodes();
  }, [language]);

  const fetchFeaturedEpisodes = async () => {
    try {
      setLoading(true);
      
      // Fetch all published episodes for the current language
      const { data: allEpisodes, error } = await supabase
        .from('episodes')
        .select('*')
        .eq('is_published', true)
        .eq('language_code', language)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching episodes:', error);
        setLoading(false);
        return;
      }

      // Categorize episodes based on their category field
      const categorizedEpisodes: Record<string, Episode> = {};
      
      // Define our target categories
      const targetCategories = ['podcast', 'kitchen', 'stories'];
      
      // Initialize with null values
      targetCategories.forEach(category => {
        categorizedEpisodes[category] = null;
      });
      
      // Process each episode to categorize it
      for (const episode of allEpisodes) {
        // Determine episode category
        let episodeCategory = episode.category;
        
        // If no category is set, try to determine from title
        if (!episodeCategory) {
          const title = episode.title.toLowerCase();
          if (title.includes('kitchen') || title.includes('recept') || title.includes('кухињ') || title.includes('рецепт')) {
            episodeCategory = 'kitchen';
          } else if (title.includes('story') || title.includes('прича') || title.includes('storija')) {
            episodeCategory = 'stories';
          } else {
            episodeCategory = 'podcast';
          }
        }
        
        // Store the first (most recent) episode for each category
        if (targetCategories.includes(episodeCategory) && !categorizedEpisodes[episodeCategory]) {
          categorizedEpisodes[episodeCategory] = episode;
        }
        
        // If we have all categories, break early
        if (targetCategories.every(cat => categorizedEpisodes[cat])) {
          break;
        }
      }
      
      // Convert to array, maintaining order: podcast, kitchen, stories
      const episodesArray = targetCategories
        .map(category => categorizedEpisodes[category])
        .filter(Boolean) as Episode[];

      setEpisodes(episodesArray);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching featured episodes:', error);
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
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

  // Get category from episode
  const getCategoryName = (episode: Episode) => {
    // Try to determine category based on title
    const title = episode.title.toLowerCase();
    
    if (title.includes('kitchen') || title.includes('recept') || title.includes('кухињ') || title.includes('рецепт')) {
      return t('podcast.categories.kitchen');
    } else if (title.includes('story') || title.includes('прича') || title.includes('storija')) {
      return t('podcast.categories.stories');
    } else {
      return t('podcast.categories.podcast');
    }
  };

  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
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
  };

  if (loading) {
    return (
      <>
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="animate-pulse h-10 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="animate-pulse h-6 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    </div>
                    <div className="flex justify-between mt-4">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <VideoModal
          isOpen={videoModal.isOpen}
          onClose={closeVideoModal}
          videoUrl={videoModal.videoUrl}
          title={videoModal.title}
        />
      </>
    );
  }

  return (
    <>
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-accent bg-clip-text text-transparent">
              {t('home.featuredEpisodes.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.featuredEpisodes.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {episodes.map((episode, index) => (
              <Card key={episode.id} className="episode-card group animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-primary-glow bg-primary/10 px-2 py-1 rounded-full">
                      {getCategoryName(episode)}
                    </span>
                    <div className="text-3xl animate-float">
                      {episode.thumbnail_url ? (
                        <img 
                          src={episode.thumbnail_url} 
                          alt={episode.title} 
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      ) : episode.youtube_url && extractYouTubeId(episode.youtube_url) ? (
                        <img
                          src={`https://img.youtube.com/vi/${extractYouTubeId(episode.youtube_url)}/mqdefault.jpg`}
                          alt={episode.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      ) : (
                        <span>📺</span>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary-glow transition-colors">
                    {episode.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {episode.description || t('podcast.episode.noDescription')}
                  </p>
                  
                  <div className="flex items-center text-sm text-muted-foreground space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(episode.published_date) || formatDate(episode.created_at) || t('podcast.episode.dateUnknown')}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  {episode.youtube_url ? (
                    <Button 
                      variant="podcast" 
                      className="w-full group"
                      onClick={() => openVideoModal(episode.youtube_url!, episode.title)}
                    >
                      <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      {t('podcast.watchNow')}
                    </Button>
                  ) : (
                    <Button variant="podcast" className="w-full group">
                      <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      {t('podcast.listen')}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg" onClick={() => navigate('/podcast')}>
                {t('nav.podcast')} epizode
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/kitchen')}>
                {t('nav.kitchen')} epizode
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/stories')}>
                {t('nav.stories')} epizode
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <VideoModal
        isOpen={videoModal.isOpen}
        onClose={closeVideoModal}
        videoUrl={videoModal.videoUrl}
        title={videoModal.title}
      />
    </>
  );
};

export default FeaturedEpisodes;